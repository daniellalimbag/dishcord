import { User } from "../../models/User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import connectToDB from "../../lib/mongodb.js";

export async function POST(req) {
    const body = await req.json();
    const pass = body.password;
    const currentTime = new Date();

    try {
        await connectToDB();
        console.log("Database connection readyState:", mongoose.connection.readyState);

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(pass, salt);

        const userData = {
            ...body,
            password: hashedPassword,
            previousPasswords: [hashedPassword],
            passwordLastChanged: currentTime,
        };

        console.log("Data being saved to MongoDB");
        const user = await User.create(userData);
        console.log("User successfully created:", user);

        return new Response(JSON.stringify(user), { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}


export async function GET() {
    await connectToDB();
    return Response.json( 
        await User.find()
    )
}

export async function PUT(req) {
    try {
        const data = await req.json();
        await connectToDB();
        console.log({data})
        const updateResult = await User.updateOne(
            { username: data.username },
            {
            $set: {
                phone_number: data.phone_number,
                address: data.address,
                zip_code: data.zip_code,
                city: data.city,
                country: data.country,
            },
            }
        );
        return Response.json(updateResult)
      } catch (e) {
        return Response.json(e)  
      }
}