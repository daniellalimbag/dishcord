export async function logMessage(message, level = "info", meta = {}) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // fallback for dev
        await fetch(`${baseUrl}/api/logs`, {
            method: 'POST',
            body: JSON.stringify({
                message,
                level,
                meta
            }),
            headers: {
                'Content-Type' : 'application/json'
            }
        });
    } catch (err) {
      console.error("Failed to log message:", err);
    }
  }