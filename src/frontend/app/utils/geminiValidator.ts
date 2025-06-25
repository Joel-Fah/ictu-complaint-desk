// utils/geminiValidator.ts
import axios from "axios";

export const validateCategoryWithGemini = async (
    category: string,
    description: string
): Promise<{ valid: boolean; suggestion?: string }> => {
    const prompt = `A user submitted a complaint with category: "${category}" and description: "${description}". 
Does the description match the category? Reply "yes" if it matches, otherwise suggest a better matching category from: 
missing grade, no CA mark, no exam mark, unsatisfied with final grade.`;

    const apiKey = process.env.GEMINI_API_KEY;

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            {
                contents: [{ parts: [{ text: prompt }] }],
            }
        );

        const output = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase() ?? "";

        if (output.includes("yes")) {
            return { valid: true };
        } else {
            const match = output.match(/suggest(?:ing)?(?: a)? category[:\-\s]+(.+)/i);
            return {
                valid: false,
                suggestion: match?.[1]?.trim() ?? "another category",
            };
        }
    } catch (err) {
        console.error("Gemini API call failed:", err);
        return { valid: true }; // fallback: don't block user
    }
};
