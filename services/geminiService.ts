import { GoogleGenAI, Type } from "@google/genai";
import { Receipt } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    date: {
      type: Type.STRING,
      description: 'The date of the transaction in YYYY-MM-DD format. Infer from the receipt.',
    },
    company: {
      type: Type.STRING,
      description: 'The name of the company or vendor from which the purchase was made.',
    },
    category: {
      type: Type.STRING,
      description: 'A relevant spending category for the purchase (e.g., "Groceries", "Dining", "Gas", "Office Supplies", "Travel", "Entertainment").',
    },
    description: {
      type: Type.STRING,
      description: 'A brief, one-sentence summary of the key items purchased.',
    },
    total: {
      type: Type.NUMBER,
      description: 'The final total amount of the transaction, including tax.',
    },
    totalTax: {
      type: Type.NUMBER,
      description: 'The total tax amount on the receipt. If not present, this should be 0. It should be the sum of GST and PST if they are present.',
    },
    gst: {
        type: Type.NUMBER,
        description: 'The Goods and Services Tax (GST) amount. If not present or not applicable, this should be 0.'
    },
    pst: {
        type: Type.NUMBER,
        description: 'The Provincial Sales Tax (PST) amount. If not present or not applicable, this should be 0.'
    }
  },
  required: ['date', 'company', 'category', 'description', 'total', 'totalTax', 'gst', 'pst'],
};

export const extractReceiptInfo = async (imageDataUrl: string): Promise<Omit<Receipt, 'thumbnail'>> => {
  const mimeTypeMatch = imageDataUrl.match(/data:(.*);base64,/);
  if (!mimeTypeMatch) {
    throw new Error('Invalid image data URL');
  }
  const mimeType = mimeTypeMatch[1];
  const base64Data = imageDataUrl.split(',')[1];

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: "Analyze this receipt image and extract the company name, date, a brief summary of items, spending category, and total amount. Also extract the tax details. Provide the total tax, and if available, a breakdown of GST (Goods and Services Tax) and PST (Provincial Sales Tax). If a tax breakdown isn't available, set gst and pst to 0. Provide the output in the requested JSON format.",
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    const jsonString = response.text;
    const parsedData = JSON.parse(jsonString);

    // Basic validation
    if (
      typeof parsedData.date !== 'string' ||
      typeof parsedData.company !== 'string' ||
      typeof parsedData.category !== 'string' ||
      typeof parsedData.description !== 'string' ||
      typeof parsedData.total !== 'number' ||
      typeof parsedData.totalTax !== 'number' ||
      typeof parsedData.gst !== 'number' ||
      typeof parsedData.pst !== 'number'
    ) {
      throw new Error("AI response did not match the expected format.");
    }
    
    return parsedData as Omit<Receipt, 'thumbnail'>;
  } catch (error) {
    console.error("Error processing receipt with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to extract receipt information: ${error.message}`);
    }
    throw new Error("An unknown error occurred while processing the receipt.");
  }
};
