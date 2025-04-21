import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "../../models/User";
import { logMessage } from "../../lib/logger";

export async function POST(req) {
    const { username, password } = await req.json();

    try {
        await mongoose.connect(process.env.MONGODB_URL);

        const user = await User.findOne({ username });
        if (!user) {
            await logMessage(`Authentication failed: User '${username}' not found`, "warning", "");
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            await logMessage(`Authentication failed: Incorrect password for user '${username}'`, "warning", "");
            return new Response(JSON.stringify({ error: "Incorrect password" }), { status: 401 });
        }

        await logMessage(`Authentication successful for user '${username}'`, "info", "");
        return new Response(JSON.stringify({ success: true, message: "Authentication successful" }), { status: 200 });
    } catch (error) {
        console.error("Error during authentication:", error.message);
        await logMessage(`Internal server error during authentication for user '${username}': ${error.message}`, "error", "");
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}