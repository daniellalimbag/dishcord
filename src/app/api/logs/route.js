import {Log} from "../../models/Log.js";
import mongoose from "mongoose";

export async function POST(req) {
    const data = await req.json();
    mongoose.connect(process.env.MONGODB_URL);
    const log = await Log.create(data);
    return Response.json(log);
}

export async function GET() {
    mongoose.connect(process.env.MONGODB_URL);
    return Response.json( 
        await Log.find()
    )
}