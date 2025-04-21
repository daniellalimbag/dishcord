import { User } from "../../models/User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { logMessage } from "../../lib/logger.js";

const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    
    await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

export async function PUT(req) {
    try {
        const { username, password } = await req.json();
        
        await connectDB();
        
        const user = await User.findOne({ username: username.trim() });
        
        if (!user) {
            console.log("User not found:", username);
            return new Response(
                JSON.stringify({ success: false, error: "User not found" }), 
                { status: 404 }
            );
        }

        if (!user.previousPasswords || !Array.isArray(user.previousPasswords)) {
            user.previousPasswords = [];
        }
        

        const isReusedPassword = user.previousPasswords.some((oldPasswordHash) =>
            bcrypt.compareSync(password, oldPasswordHash)
        );

        if (isReusedPassword) {
            await logMessage(`User ${username} reused their old password in 'Forgot Password'`, "error", "");
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "You cannot reuse a previous password. Please choose a new password.",
                }),
                { status: 400 }
            );
        }
        
        console.log("User found. Current password field:", user.password ? "exists" : "missing");
        
        const now = new Date();
        if (user.passwordLastChanged && (now - user.passwordLastChanged) < 24 * 60 * 60 * 1000) {
            console.log("Password change attempted too soon");
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Passwords must be at least one day old before they can be changed.",
                }),
                { status: 400 }
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        await logMessage(`New hashed password generated for user ${username}: ${hashedPassword.substring(0, 10)}`,"info","");
        
        const updateResult = await User.updateOne(
            { username: username.trim() },
            {
                $set: { password: hashedPassword },
                $push: { previousPasswords: { $each: [hashedPassword], $slice: -5 } },
            }
        );
        
        console.log("Update result:", updateResult);
        
        if (updateResult.matchedCount === 0) {
            return new Response(
                JSON.stringify({ success: false, error: "User not found during update" }), 
                { status: 404 }
            );
        }
        
        if (updateResult.modifiedCount === 0) {
            return new Response(
                JSON.stringify({ success: false, error: "Password not modified" }), 
                { status: 400 }
            );
        }
        
        const updatedUser = await User.findOne({ username: username.trim() });
        const passwordUpdated = updatedUser.password !== user.password;
        
        console.log("Password field changed:", passwordUpdated);
        
        return new Response(
            JSON.stringify({ 
                success: true, 
                message: "Password reset successful",
                updated: passwordUpdated
            }), 
            { status: 200 }
        );
    } catch (error) {
        await logMessage(`An error occured during password reset for user ${username}`,"error","");
        return new Response(
            JSON.stringify({ 
                success: false, 
                error: error.message || "An error occurred during password reset" 
            }), 
            { status: 500 }
        );
    }
}