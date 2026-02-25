import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const apiKey = process.env.GEMINI_API_KEY || "";
if (!apiKey) {
  console.warn("GEMINI_API_KEY not found. Please set it in environment variables.");
}

const ai = new GoogleGenAI({ apiKey });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    productName: { type: Type.STRING, description: "Name of the product if identifiable" },
    healthScore: { type: Type.NUMBER, description: "Overall health score from 0 to 100" },
    rank: { type: Type.STRING, description: "Healthy, Moderate, or Unhealthy" },
    safetyStatus: { type: Type.STRING, description: "Yes, Limit, or Avoid" },
    summary: { type: Type.STRING, description: "Brief summary of the product's healthiness" },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Common/Normalized name of the ingredient" },
          originalName: { type: Type.STRING, description: "Name as it appears on the label" },
          description: { type: Type.STRING, description: "What this ingredient is" },
          purpose: { type: Type.STRING, description: "Why it is used in the product" },
          impact: { type: Type.STRING, description: "good, neutral, or harmful" },
          risks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Known risks or side effects" }
        },
        required: ["name", "originalName", "description", "purpose", "impact", "risks"]
      }
    },
    warnings: {
      type: Type.OBJECT,
      properties: {
        ageSpecific: { type: Type.STRING, description: "Warnings for specific age groups" },
        general: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["ageSpecific", "general"]
    },
    dietCompatibility: {
      type: Type.OBJECT,
      properties: {
        vegan: { type: Type.BOOLEAN },
        keto: { type: Type.BOOLEAN },
        diabetic: { type: Type.BOOLEAN },
        heartSafe: { type: Type.BOOLEAN }
      },
      required: ["vegan", "keto", "diabetic", "heartSafe"]
    },
    recommendations: { type: Type.STRING, description: "Recommended daily/weekly intake" },
    alternatives: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Healthier alternatives" }
  },
  required: ["healthScore", "rank", "safetyStatus", "summary", "ingredients", "warnings", "dietCompatibility", "recommendations", "alternatives"]
};

export async function analyzeIngredients(base64Image: string, userAge?: number): Promise<AnalysisResult> {
  if (!apiKey) {
    throw new Error("Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables.");
  }

  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze the food ingredient list in this image. 
    1. EXHAUSTIVE EXTRACTION: Identify the "Ingredients" section and extract EVERY SINGLE ingredient listed. Do not skip any, even if they seem minor (like salt, water, or spices).
    2. NORMALIZATION: Normalize names (e.g., E102 -> Tartrazine, INS 330 -> Citric Acid). Keep the original text as 'originalName'.
    3. INDIVIDUAL ANALYSIS: For EVERY extracted ingredient, provide a description, its purpose, and its health impact.
    4. HEALTH SCORE: Calculate a score (0-95) based on the cumulative impact of all ingredients. Ensure the score does not exceed 95, even for the healthiest products.
    5. LANGUAGE: Use simple, non-medical language that a regular consumer can understand.
    6. ERROR HANDLING: If the image does not contain a clear ingredient list, state this clearly in the 'summary' field.
    ${userAge ? `7. AGE-SPECIFIC: The user is ${userAge} years old. Provide specific safety warnings and recommendations tailored for this age group in the 'warnings.ageSpecific' field.` : ""}
    
    IMPORTANT: Ensure the 'ingredients' array in your JSON response contains ALL ingredients found in the text.
  `;

  const result = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(",")[1] || base64Image
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA
    }
  });

  const text = result.text;
  if (!text) throw new Error("No response from AI");
  
  const parsed = JSON.parse(text);
  return {
    ...parsed,
    timestamp: Date.now(),
    id: Math.random().toString(36).substring(7)
  };
}
