import {Restaurant} from "../../models/Restaurant.js";
import mongoose from "mongoose";

export async function POST(req) {
    const data = await req.json();
    console.log({data})
    mongoose.connect(process.env.MONGODB_URL);
    const restaurant_item = await Restaurant.create(data);
    return Response.json(restaurant_item);
}

export async function GET() {
    mongoose.connect(process.env.MONGODB_URL);
    return Response.json( 
        await Restaurant.find()
    )
}

export async function PUT(req) {
    const data = await req.json();
    mongoose.connect(process.env.MONGODB_URL);
    
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
        { name: data.originalName },
        {
            name: data.name,
            address: data.address,
            tags: data.tags,
            price_range: data.price_range,
            resto_image: data.resto_image,
            description: data.description,
            owner: data.owner
        },
        { new: true }
    );
    
    return Response.json(updatedRestaurant);
}
