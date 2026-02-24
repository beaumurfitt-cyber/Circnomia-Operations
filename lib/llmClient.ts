export interface LlmMessage {
  role: "system" | "user";
  content: string;
}

export async function generateJson<T>(messages: LlmMessage[], fallback: T): Promise<T> {
  if (!process.env.LLM_API_KEY) return fallback;
  // Provider-agnostic placeholder. Swap with OpenAI/Anthropic/etc.
  const body = { model: process.env.LLM_MODEL ?? "gpt-4o-mini", messages };
  const res = await fetch(process.env.LLM_BASE_URL ?? "https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LLM_API_KEY}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) return fallback;
  const data = await res.json();
  try {
    const text = data.choices?.[0]?.message?.content;
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}
