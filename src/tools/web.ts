/**
 * Web tools - Pattern: Action + Object
 * search_web, fetch_page
 */

// ============ search_web ============
export const searchWebDefinition = {
  type: "function" as const,
  function: {
    name: "search_web",
    description: "Search the internet for information. Use only for external data not in codebase.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
      },
      required: ["query"],
    },
  },
};

export async function executeSearchWeb(
  args: { query: string },
  tavilyApiKey?: string
): Promise<{ success: boolean; output?: string; error?: string }> {
  if (!tavilyApiKey) {
    return { success: false, error: "TAVILY_API_KEY not configured" };
  }
  
  try {
    const { tavily } = await import('@tavily/core');
    const client = tavily({ apiKey: tavilyApiKey });
    const response = await client.search(args.query, { maxResults: 5 });
    
    const output = response.results.map((r: any, i: number) => 
      `[${i + 1}] ${r.title}\n${r.url}\n${r.content.slice(0, 300)}`
    ).join('\n\n');
    
    return { success: true, output: output || "(no results)" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ============ fetch_page ============
export const fetchPageDefinition = {
  type: "function" as const,
  function: {
    name: "fetch_page",
    description: "Fetch content from a URL.",
    parameters: {
      type: "object",
      properties: {
        url: { type: "string", description: "URL to fetch" },
      },
      required: ["url"],
    },
  },
};

export async function executeFetchPage(
  args: { url: string }
): Promise<{ success: boolean; output?: string; error?: string }> {
  try {
    const response = await fetch(args.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Agent/1.0)' },
    });
    
    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }
    
    const text = await response.text();
    return { success: true, output: text.slice(0, 50000) };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
