import {Review} from "../../models/Review.js";
import connectToDB from "../../lib/mongodb.js";

export async function POST(req) {
    const data = await req.json();
    await connectToDB();
    const review_item = await Review.create(data);
    return Response.json(review_item);
}

export async function GET() {
    await connectToDB();
    return Response.json( 
        await Review.find()
    )
}

export async function PUT(req) {
    try {
        const data = await req.json();
        console.log("api data", data)
        await connectToDB();
        const updateResult = await Review.updateOne(
            { user: data.user, restaurant: data.restaurant },
            {
                $set: {
                    rating: data.rating,
                    comment: data.comment
                },
            }
        );
        console.log(updateResult)
        return Response.json(updateResult)
      } catch (e) {
        return Response.json(e)  
      }
}

export async function DELETE(req) {
    try {
        const data = await req.json();
        const user = data.userName;

        await connectToDB();
        console.log({user})
        return Response.json(
            await Review.deleteOne({user: data.userName, restaurant: data.restaurantname})
        )
      } catch (e) {
        return Response.json(e)  
      }
}
