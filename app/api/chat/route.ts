import { createAgentUIStreamResponse } from "ai";

import { createSeedAgent, hasApiKey } from "@/lib/seed-agent";

/**
 * Chat API endpoint for the Seed agent.
 *
 * POST /api/chat
 *
 * Request body:
 * - messages: UIMessage[] - The conversation messages
 *
 * Response:
 * - Streaming UI message response with reasoning and sources
 *
 * Errors:
 * - Returns 400 if request is invalid or OPENAI_API_KEY is missing
 */
export async function POST(request: Request) {
  // Parse request body
  let body: { messages: unknown[] };

  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        error: "Invalid request",
        message: "Could not parse request body as JSON.",
      },
      { status: 400 }
    );
  }

  const { messages } = body;

  // Validate messages array
  if (!Array.isArray(messages)) {
    return Response.json(
      {
        error: "Invalid request",
        message: "The 'messages' field must be an array.",
      },
      { status: 400 }
    );
  }

  // Check if OpenAI API key is available
  if (!hasApiKey()) {
    return Response.json(
      {
        error: "API key missing",
        message:
          "The OPENAI_API_KEY environment variable is not set. Please add it to your .env file.",
      },
      { status: 400 }
    );
  }

  // Create the Seed agent (no configuration needed)
  const agent = createSeedAgent();

  // Return streaming response
  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
    abortSignal: request.signal,
    sendSources: true,
    sendReasoning: true,
  });
}
