// utils/geminiValidator.ts
import axios from "axios";

export const validateCategoryWithGemini = async (
    categoryName: string,
    description: string
): Promise<{ valid: boolean; suggestion?: string }> => {
    const prompt = `A user has submitted a complaint with category: "${categoryName}" and description: "${description}". 
Does the description match the category? Reply "yes" if it matches, otherwise suggest a better matching category.`;

    const apiKey = process.env.GEMINI_API_KEY;

    try {
        const response = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey,
            {
                contents: [{ parts: [{ text: prompt }] }],
            }
        );

        const output = response.data.candidates[0]?.content?.parts[0]?.text.toLowerCase();

        if (output.includes("yes")) {
            return { valid: true };
        } else {
            const match = output.match(/suggest(?:ing)?(?: a)? category[:\-\s]+(.+)/i);
            return {
                valid: false,
                suggestion: match?.[1]?.trim() ?? "another category",
            };
        }
    } catch (error) {
        console.error("Gemini validation failed:", error);
        return { valid: true }; // Allow if AI fails to avoid blocking user
    }
};
