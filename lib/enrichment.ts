import { JSDOM } from "jsdom";

export async function extractPage(url: string) {
  const response = await fetch(url);
  const html = await response.text();
  const dom = new JSDOM(html);
  const title = dom.window.document.title || url;
  const text = dom.window.document.body.textContent?.replace(/\s+/g, " ").trim() ?? "";

  return {
    url,
    title,
    text,
    snippet: text.slice(0, 400)
  };
}

export async function simpleSearch(query: string): Promise<string[]> {
  const encoded = encodeURIComponent(query);
  return [
    `https://duckduckgo.com/?q=${encoded}`
  ];
}
