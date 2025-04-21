import {model, models, Schema} from "mongoose";

const reviews_schema = new Schema({
    restaurant: {type: String, required: true},
    user: {type:String},
    rating: {type: Number, required: true, min: 0, max: 5},
    comment: {type: String}
});

export const Review = models?.Review || model('Review', reviews_schema)