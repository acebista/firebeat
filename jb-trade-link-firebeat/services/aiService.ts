/**
 * AI Service using OpenRouter with NVIDIA Nemotron Nano 9B V2
 * Guarded by an opt-in flag to avoid accidental network calls in production.
 */

const MODEL = 'nvidia/nemotron-nano-9b-v2:free';
const OPENROUTER_API_KEY =
    import.meta.env.VITE_OPENROUTER_API_KEY ||
    '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';
const AI_ENABLED = import.meta.env.VITE_ENABLE_AI === 'true';

export interface AIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface AIResponse {
    content: string;
    error?: string;
}

/**
 * Send a message to the AI and get a response
 */
export async function sendAIMessage(messages: AIMessage[]): Promise<AIResponse> {
    if (!AI_ENABLED) {
        return { content: '', error: 'AI is disabled. Set VITE_ENABLE_AI=true to enable.' };
    }

    if (!OPENROUTER_API_KEY) {
        return { content: '', error: 'AI key missing. Provide VITE_OPENROUTER_API_KEY.' };
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Firebeat DMS',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL,
                messages,
            }),
        });

        if (!response.ok) {
            throw new Error(`AI request failed: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || 'AI request failed');
        }

        const content = data.choices?.[0]?.message?.content || '';

        return { content };
    } catch (error: any) {
        console.error('AI service error:', error);
        return {
            content: '',
            error: error.message || 'Failed to get AI response',
        };
    }
}

/**
 * Get sales insights from AI
 */
export async function getSalesInsights(salesData: {
    todaySales: number;
    weekSales: number;
    monthSales: number;
    todayOrders: number;
    totalOrders: number;
    topProducts?: string[];
    topCustomers?: string[];
}): Promise<AIResponse> {
    const prompt = `As a sales performance analyst, analyze this sales data and provide 3-4 actionable insights:

Sales Data:
- Today's Sales: ₹${salesData.todaySales.toLocaleString()}
- This Week: ₹${salesData.weekSales.toLocaleString()}
- This Month: ₹${salesData.monthSales.toLocaleString()}
- Today's Orders: ${salesData.todayOrders}
- Total Orders (30 days): ${salesData.totalOrders}
${salesData.topProducts ? `- Top Products: ${salesData.topProducts.join(', ')}` : ''}
${salesData.topCustomers ? `- Top Customers: ${salesData.topCustomers.join(', ')}` : ''}

Provide insights in this format:
1. [Insight about performance trend]
2. [Recommendation for improvement]
3. [Opportunity or risk to watch]

Keep each insight to 1-2 sentences. Be specific and actionable.`;

    return sendAIMessage([
        {
            role: 'user',
            content: prompt,
        },
    ]);
}

/**
 * Get product recommendations from AI
 */
export async function getProductRecommendations(
    customerName: string,
    previousOrders: string[]
): Promise<AIResponse> {
    const prompt = `Based on a customer's purchase history, suggest 3 products they might be interested in:

Customer: ${customerName}
Previous Orders: ${previousOrders.join(', ')}

Provide recommendations in this format:
1. [Product name] - [Brief reason]
2. [Product name] - [Brief reason]
3. [Product name] - [Brief reason]

Keep each recommendation to 1 sentence.`;

    return sendAIMessage([
        {
            role: 'user',
            content: prompt,
        },
    ]);
}

/**
 * Get performance tips from AI
 */
export async function getPerformanceTips(
    currentPerformance: string
): Promise<AIResponse> {
    const prompt = `As a sales coach, provide 3 specific tips to improve sales performance:

Current Performance: ${currentPerformance}

Provide tips in this format:
1. [Specific actionable tip]
2. [Specific actionable tip]
3. [Specific actionable tip]

Keep each tip to 1-2 sentences. Be practical and specific.`;

    return sendAIMessage([
        {
            role: 'user',
            content: prompt,
        },
    ]);
}
