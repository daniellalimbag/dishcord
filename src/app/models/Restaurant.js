import {model, models, Schema} from "mongoose";

const restaurant_schema = new Schema({
    name: {type:String},
    address: {type:String},
    tags: [{type:String}],
    price_range: {type:String},
    resto_image: {type:String},
    description: {type:String},
    owner: {type:String}
}, {timestamps: true});

export const Restaurant = models?.Restaurant || model('Restaurant', restaurant_schema)