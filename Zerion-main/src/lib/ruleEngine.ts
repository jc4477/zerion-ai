/**
 * Phase 1: Rule-Based Extraction Engine
 * Uses Regex patterns and Linguistic rules as per USER's Step 3 requirements.
 */

export interface ActionItem {
    task: string;
    owner: string;
    deadline: string;
    priority?: "High" | "Medium" | "Low";
    confidence?: number;
}

const RULES = [
    // Pattern: "X will do Y"
    {
        regex: /(.+?)\s+will\s+(.+)/i,
        map: (match: RegExpMatchArray): Partial<ActionItem> => ({ owner: match[1].trim(), task: match[2].trim() })
    },
    // Pattern: "Assign Y to X"
    {
        regex: /assign\s+(.+?)\s+to\s+(.+)/i,
        map: (match: RegExpMatchArray): Partial<ActionItem> => ({ owner: match[2].trim(), task: match[1].trim() })
    },
    // Pattern: "X is responsible for Y"
    {
        regex: /(.+?)\s+is\s+responsible\s+for\s+(.+)/i,
        map: (match: RegExpMatchArray): Partial<ActionItem> => ({ owner: match[1].trim(), task: match[2].trim() })
    },
    // Pattern: "Y needs to be completed by DATE"
    {
        regex: /(.+?)\s+needs\s+to\s+be\s+completed\s+by\s+(.+)/i,
        map: (match: RegExpMatchArray): Partial<ActionItem> => ({ task: match[1].trim(), deadline: match[2].trim() })
    },
    // Generic: "X needs to Y"
    {
        regex: /(.+?)\s+needs\s+to\s+(.+)/i,
        map: (match: RegExpMatchArray): Partial<ActionItem> => ({ owner: match[1].trim(), task: match[2].trim() })
    }
];

// NER Dictionary (Lite) - Simulation of Phase 2 logic
const RECOGNIZED_NAMES = ["Rahul", "Priya", "Amit", "Sara", "John", "David", "Emily", "Team"];
const DATE_MARKERS = ["tomorrow", "monday", "friday", "next week", "march", "april", "june"];

export const ruleBasedExtraction = (text: string): ActionItem[] => {
    const sentences = text.split(/[.!?\n]/).filter(s => s.trim().length > 5);
    const extractedItems: ActionItem[] = [];

    sentences.forEach(sentence => {
        let found = false;
        for (const rule of RULES) {
            const match = sentence.match(rule.regex);
            if (match) {
                const data = rule.map(match);

                let owner = data.owner || "Unassigned";
                let deadline = data.deadline || "TBD";

                if (owner === "Unassigned" || owner === "I") {
                    const foundName = RECOGNIZED_NAMES.find(n => sentence.includes(n));
                    if (foundName) owner = foundName;
                }

                if (deadline === "TBD") {
                    const foundDate = DATE_MARKERS.find(d => sentence.toLowerCase().includes(d));
                    if (foundDate) deadline = foundDate.charAt(0).toUpperCase() + foundDate.slice(1);
                }

                extractedItems.push({
                    task: data.task || "Unknown Task",
                    owner: owner,
                    deadline: deadline,
                    priority: "Medium",
                    confidence: 0.85 // Rule-based extraction has high but fixed confidence for patterns
                });
                found = true;
                break;
            }
        }

        // Fallback: Basic Dependency parsing simulation for committed verbs
        if (!found && (sentence.toLowerCase().includes(" must ") || sentence.toLowerCase().includes(" should ") || sentence.toLowerCase().includes(" need "))) {
            const foundName = RECOGNIZED_NAMES.find(n => sentence.includes(n)) || "Everyone";
            extractedItems.push({
                task: sentence.trim(),
                owner: foundName,
                deadline: "ASAP",
                priority: "High",
                confidence: 0.70 // Lower confidence for fallbacks
            });
        }
    });

    return extractedItems;
};

/**
 * Generates a content-aware summary for the Rule Engine using basic keyword matching.
 */
export const generateRuleBasedSummary = (text: string): string => {
    const content = text.toLowerCase();

    const topics = [
        { keywords: ["interview", "candidate", "hiring", "resume"], topic: "an interview discussion" },
        { keywords: ["kickoff", "launch", "starting"], topic: "a project kickoff" },
        { keywords: ["sprint", "development", "bug", "feature", "code"], topic: "a technical development sync" },
        { keywords: ["sales", "revenue", "client", "deal"], topic: "a sales and performance review" },
        { keywords: ["marketing", "campaign", "social"], topic: "a marketing strategy session" },
        { keywords: ["design", "ui", "ux", "wireframe"], topic: "a creative design review" }
    ];

    const match = topics.find(t => t.keywords.some(k => content.includes(k)));

    if (match) {
        return `This meeting is primarily about ${match.topic}. The conversation focuses on key actionable requirements and team coordination.`;
    }

    return "This meeting transcript covers general project updates and collective team action items.";
};
