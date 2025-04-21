import {model, models, Schema} from "mongoose";

const user_schema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    profile_picture: { type: String, required: true },
    password: { type: String, required: true },
    previousPasswords: { type: [String], required: true },
    passwordLastChanged: { type: Date, default: null },
    phone_number: { type: String },
    address: { type: String },
    zip_code: { type: String },
    city: { type: String },
    country: { type: String },
    failedLoginAttempts: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    lockoutUntil: { type: Date, default: null },
    securityQuestion1: [
        {
            question: { type: String, required: true },
            answer: { type: String, required: true }
        }
    ],
    securityQuestion2: [
        {
            question: { type: String, required: true },
            answer: { type: String, required: true }
        }
    ],
    lastSuccessfulLogin: { type: Date, default: null },
    lastUnsuccessfulLogin: { type: Date, default: null },
    role: { 
        type: String, 
        enum: ["admin", "customer", "manager"], 
        required: true 
    }
}, { timestamps: true });

export const User = models?.User || model('User', user_schema)