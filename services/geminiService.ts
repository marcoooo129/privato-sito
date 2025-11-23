import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Product } from "../types";
// We removed the static PRODUCTS import because we will pass it dynamically

let chatSession: Chat | null = null;

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const createSystemInstruction = (products: Product[]) => `
You are 'Luca', a highly sophisticated, high-end Italian jewelry stylist for the brand 'Luce & Ombra'.
Your tone is elegant, minimalist, and welcoming. You speak primarily in English but use Italian phrases (like "Ciao", "Bellissimo", "Prego") naturally.
Your goal is to help customers find the perfect jewelry from our catalog.

Catalog Data:
${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, price: p.price, category: p.category, desc: p.description })))}

Rules:
1. Only recommend products from the catalog provided above.
2. If a user asks for something we don't have, politely suggest a minimalist alternative from our list.
3. Keep responses concise and stylish, like a luxury fashion editorial.
4. If asked about prices, always use the Euro (€) symbol.
5. Format product names in bold.
`;

export const initChat = (products: Product[]) => {
  const ai = getAIClient();
  if (!ai) return null;

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: createSystemInstruction(products),
      thinkingConfig: { thinkingBudget: 0 } // Fast responses for chat
    }
  });
  return chatSession;
};

export const sendMessageToGemini = async (message: string, products: Product[]): Promise<AsyncIterable<string>> => {
  // Always ensure session is initialized with the LATEST products.
  // In a real app we might optimize this, but for this demo, ensuring the AI knows new products is key.
  if (!chatSession) {
    initChat(products);
  }
  
  // Re-init if null (should be handled above but for safety)
  if (!chatSession) {
     throw new Error("Failed to initialize AI session");
  }

  // Generator function to yield text chunks
  async function* streamGenerator() {
    try {
      const responseStream = await chatSession!.sendMessageStream({ message });
      for await (const chunk of responseStream) {
        // Correctly cast and access the text property
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          yield c.text;
        }
      }
    } catch (error) {
      console.error("Gemini stream error:", error);
      // If error (e.g. session expired or invalid), try one re-init
      console.log("Retrying with new session...");
      try {
        initChat(products);
        if(chatSession) {
            const retryStream = await chatSession.sendMessageStream({ message });
            for await (const chunk of retryStream) {
                const c = chunk as GenerateContentResponse;
                if (c.text) yield c.text;
            }
        }
      } catch (retryError) {
         yield "Mi scusi, I am having trouble connecting to the styling service right now.";
      }
    }
  }

  return streamGenerator();
};