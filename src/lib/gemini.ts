import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ActionItem {
  task: string;
  owner: string;
  deadline: string;
  priority?: "High" | "Medium" | "Low";
  confidence?: number; // Added: Smart Feature (0.0 to 1.0)
}

export interface ExtractionResult {
  actionItems: ActionItem[];
  summary: string;
}

const SYSTEM_PROMPT = `
You are an advanced ML-based Meeting Intelligence Engine. Your core objective is Phase 2: Action Item Detection and Summarization.
Analyze the transcript and perform three sub-tasks:
1. **Summarization**: Provide a brief (2-3 sentences) overview of what was discussed in the conversation.
2. **Classification**: Identify sentences that are actionable commitments.
3. **NER (Named Entity Recognition)**: Extract the Task description, the Owner (Person/Team), and the Deadline (Date/Time).
4. **Confidence Scoring**: Assign a confidence score (0.0 to 1.0) based on how explicit the commitment is.

Format your response ONLY as a JSON object with these two keys:
"summary": "a brief string overview of the conversation",
"actionItems": [ ... array of objects with "task", "owner", "deadline", "priority", "confidence" keys ... ]

Example Output: {
  "summary": "The team discussed the upcoming Q1 product launch. Key concerns were raised about the backend stability.",
  "actionItems": [{"task": "Prepare proposal", "owner": "Rahul", "deadline": "10 March", "priority": "High", "confidence": 0.95}]
}
`;

export async function extractActionItems(transcript: string, apiKey?: string, modelName: string = "gemini-2.0-flash"): Promise<ExtractionResult> {
  if (!transcript.trim()) return { actionItems: [], summary: "" };

  if (!apiKey) {
    console.warn("No API key provided, using mock extraction.");
    return { actionItems: mockExtraction(transcript), summary: "Mock summary for demonstration purposes." };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `${SYSTEM_PROMPT}\n\nTranscript:\n${transcript}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response (handling potential markdown formatting)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;

    return JSON.parse(jsonStr);
  } catch (error: any) {
    console.error("AI Extraction failed:", error);
    const message = error?.message || "Failed to process transcript with AI.";
    throw new Error(message);
  }
}

export async function listAvailableModels(apiKey: string) {
  if (!apiKey) return [];
  try {
    // Return common known stable models as a fallback
    return ["gemini-1.5-flash-latest", "gemini-1.5-pro-latest", "gemini-pro", "gemini-1.0-pro"];
  } catch (error) {
    console.error("List models failed:", error);
    return [];
  }
}

function mockExtraction(transcript: string): ActionItem[] {
  const items: ActionItem[] = [];

  // Basic heuristic: look for sentences with common action words
  const actionWords = ['prepare', 'submit', 'send', 'email', 'call', 'fix', 'update', 'complete', 'coordinate'];
  const names = ['Rahul', 'Priya', 'Amit', 'Sara', 'John', 'Team'];

  const sentences = transcript.split(/[.!?\n]/);

  sentences.forEach(s => {
    const matchedWord = actionWords.find(word => s.toLowerCase().includes(word));
    if (matchedWord) {
      const owner = names.find(name => s.includes(name)) || "Unassigned";
      items.push({
        task: s.trim().substring(0, 100),
        owner: owner,
        deadline: s.toLowerCase().includes('by') ? s.split(/by/i)[1]?.trim().split(' ')[0] : "TBD",
        priority: s.toLowerCase().includes('urgent') || s.toLowerCase().includes('soon') ? "High" : "Medium"
      });
    }
  });

  // Fallback if no actions found
  if (items.length === 0) {
    return [
      {
        task: "Project kickoff meeting follow-up",
        owner: "Team",
        deadline: "Next Week",
        priority: "High"
      }
    ];
  }

  return items;
}
