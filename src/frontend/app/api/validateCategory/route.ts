// app/api/validateCategory/route.ts
import { validateCategoryWithGemini } from "@/app/utils/geminiValidator";

export async function POST(req: Request) {
    const body = await req.json();
    const { category, description } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("Missing GEMINI_API_KEY");
        return new Response(JSON.stringify({ error: "Missing API key" }), { status: 500 });
    }

    try {
        const result = await validateCategoryWithGemini(category, description);
        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.error("Gemini validation failed:", error);
        return new Response(JSON.stringify({ error: "Gemini API call failed" }), { status: 500 });
    }
}

