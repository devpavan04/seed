import { openai } from "@ai-sdk/openai";
import {
  InferAgentUIMessage,
  stepCountIs,
  Tool,
  tool,
  ToolLoopAgent,
} from "ai";
import { z } from "zod";

// =============================================================================
// Environment Variables
// =============================================================================

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Check if OpenAI API key is available.
 */
export function hasApiKey(): boolean {
  return !!OPENAI_API_KEY;
}

// =============================================================================
// Agent Configuration (Internal)
// =============================================================================

/**
 * Seed Agent Configuration
 *
 * These settings are intentionally hardcoded to provide a consistent,
 * optimized experience. Users interact with "Seed" as a unified product,
 * not as a model picker.
 *
 * - Model: GPT-5.2 (most capable for complex generative art)
 * - Reasoning: Low (fast, light reasoning for responsive UX)
 * - Web Search: Enabled (for current trends, references)
 */
const AGENT_CONFIG = {
  modelId: "gpt-4o-mini",
  reasoningEffort: "low" as const,
  webSearchEnabled: true,
  searchContextSize: "low" as const,
  reasoningSummary: "concise" as const,
} as const;

// =============================================================================
// Schemas
// =============================================================================

/**
 * Schema for a single parameter control that can be rendered in the UI.
 */
export const paramSchema = z.object({
  id: z
    .string()
    .describe(
      "The JavaScript variable name used in the params object. Use camelCase, be descriptive. Examples: 'waveAmplitude', 'particleCount', 'backgroundColor'"
    ),
  label: z
    .string()
    .describe(
      "Human-readable label shown in the UI control. Be clear and concise. Examples: 'Wave Amplitude', 'Number of Particles'"
    ),
  type: z
    .enum(["slider", "color", "number", "boolean", "select"])
    .describe(
      "The UI control type. Use 'slider' for continuous values, 'color' for hex colors, 'number' for integers, 'boolean' for toggles, 'select' for options"
    ),
  value: z
    .union([z.number(), z.string(), z.boolean()])
    .describe("The default/initial value. Must match the type."),
  min: z
    .number()
    .nullable()
    .describe("Minimum value for slider/number types. Null otherwise."),
  max: z
    .number()
    .nullable()
    .describe("Maximum value for slider/number types. Null otherwise."),
  step: z
    .number()
    .nullable()
    .describe("Step increment for slider/number types. Null otherwise."),
  options: z
    .array(z.string())
    .nullable()
    .describe("Options for select type only. Null otherwise."),
});

export type Param = z.infer<typeof paramSchema>;

/**
 * Schema for the complete sketch output from the generate_sketch tool.
 */
export const sketchOutputSchema = z.object({
  code: z.string().describe(
    `Complete, self-contained p5.js code.

REQUIRED STRUCTURE:
1. Start with a params object containing ALL tunable values
2. In setup(): call randomSeed(params.seed) and noiseSeed(params.seed)
3. Use params.* for every value that could be artistically varied

EXAMPLE:
let params = {
  canvasWidth: 800,
  canvasHeight: 800,
  seed: 12345,
  particleCount: 100,
};

function setup() {
  createCanvas(params.canvasWidth, params.canvasHeight);
  randomSeed(params.seed);
  noiseSeed(params.seed);
}

function draw() {
  // Use params.* everywhere
}`
  ),
  params: z.array(paramSchema).describe(
    `Array of parameter controls for the UI. MUST include:
- canvasWidth (slider, 400-1200)
- canvasHeight (slider, 400-1200)
- seed (number, 1-999999)

Also include parameters for colors, counts, sizes, speeds, behaviors.
Aim for 5-15 parameters that give meaningful artistic control.`
  ),
  seed: z
    .number()
    .describe(
      "Random seed for deterministic reproduction. Generate a random integer between 1 and 999999."
    ),
  response: z
    .string()
    .describe(
      "A brief, friendly explanation (2-4 sentences) of what the sketch does and any creative decisions you made."
    ),
});

export type SketchOutput = z.infer<typeof sketchOutputSchema>;

// =============================================================================
// System Prompt
// =============================================================================

const SEED_AGENT_INSTRUCTIONS = `Formatting re-enabled

You are Seed, an expert generative artist and creative coder. You help users create beautiful, interactive p5.js sketches through natural conversation.

<expertise>
## p5.js Mastery
- Drawing: shapes, curves, vertices, beziers, custom geometry
- Color: RGB, HSB modes, gradients, palettes, transparency, blending
- Animation: frameCount, deltaTime, easing, tweening, state machines
- Interaction: mouse, keyboard, touch events
- Math: trigonometry, vectors, matrices, mapping, lerp, constrain
- Noise: Perlin noise, noise fields, flow fields, turbulence
- Particles: systems, forces, behaviors, trails, lifetimes
- Transformations: translate, rotate, scale, push/pop matrix

## Generative Art Techniques
- Algorithms: L-systems, cellular automata, reaction-diffusion, voronoi, delaunay
- Randomness: seeded randomness, controlled chaos, probability distributions
- Emergence: simple rules creating complex behavior
- Nature: flocking (boids), growth patterns, phyllotaxis, organic movement
- Geometry: fractals, tessellations, sacred geometry, parametric curves, spirals

## Aesthetic Principles
- Color theory and harmony
- Composition and balance
- Visual rhythm and repetition
- Negative space
- Movement and flow
</expertise>

<tools>
## generate_sketch
Use this tool when the user wants to CREATE, MODIFY, or ITERATE on visual art.

WHEN TO USE:
- Creating new sketches: "make a particle system", "create waves", "draw spirals"
- Modifying existing: "change the color", "make it faster", "add more particles"
- Iterating on designs: "make it more organic", "add trails"

WHEN NOT TO USE:
- General questions about p5.js or creative coding
- Explaining concepts or techniques
- Casual conversation

## web_search
Use only when you need current, real-time information.

WHEN TO USE:
- Recent p5.js library updates
- Current generative art trends or artists
- Specific dates, news, or events

WHEN NOT TO USE:
- General p5.js knowledge (you already know this)
- Creative coding techniques (you already know this)
</tools>

<behavior>
## When Creating New Sketches
1. Understand the user's vision - ask clarifying questions if needed
2. Use generate_sketch to produce complete, runnable code
3. Include thoughtful parameters for artistic control
4. Explain your creative decisions briefly

## When Modifying Sketches
1. Reference the existing sketch from conversation context
2. Preserve the original concept while applying requested changes
3. Explain what you modified

## Conversation Style
- Be friendly, encouraging, and collaborative
- Use plain language, avoid jargon unless asked
- For questions and explanations, respond naturally without tools
- Suggest creative directions when appropriate
</behavior>

<code_standards>
Always structure sketches with a params object at the top:

\`\`\`javascript
let params = {
  canvasWidth: 800,
  canvasHeight: 800,
  seed: 12345,
  // Include ALL tunable values here
};

function setup() {
  createCanvas(params.canvasWidth, params.canvasHeight);
  randomSeed(params.seed);
  noiseSeed(params.seed);
}

function draw() {
  // Always use params.* for tunable values
}
\`\`\`
</code_standards>`;

// =============================================================================
// Helpers
// =============================================================================

/**
 * Extract the most recent sketch from step history.
 */
function extractCurrentSketchFromSteps(
  steps: Array<{ toolCalls: Array<{ toolName: string; input: unknown }> }>
): SketchOutput | null {
  for (let i = steps.length - 1; i >= 0; i--) {
    const step = steps[i];
    for (const toolCall of step.toolCalls) {
      if (toolCall.toolName === "generate_sketch") {
        return toolCall.input as SketchOutput;
      }
    }
  }
  return null;
}

/**
 * Build sketch context for modifications.
 */
function buildSketchContext(sketch: SketchOutput): string {
  const paramsSummary = sketch.params
    .map((p) => `  ${p.id}: ${JSON.stringify(p.value)}`)
    .join("\n");

  return `

<current_sketch>
## Active Sketch

The user has an active sketch. When they request modifications, update this code while preserving the core concept.

### Code
\`\`\`javascript
${sketch.code}
\`\`\`

### Parameters
${paramsSummary}

### Seed
${sketch.seed}
</current_sketch>`;
}

// =============================================================================
// Tools
// =============================================================================

const generateSketchTool = tool({
  description: `Generate or modify a p5.js sketch with full code and UI parameters.

USE THIS TOOL WHEN:
- User requests new generative art
- User wants to modify existing sketch
- User wants to iterate on a design

The sketch should be immediately runnable and visually interesting.`,
  inputSchema: sketchOutputSchema,
  execute: async (params): Promise<SketchOutput> => params,
});

const webSearchTool = openai.tools.webSearch({
  searchContextSize: AGENT_CONFIG.searchContextSize,
});

// =============================================================================
// Agent Factory
// =============================================================================

/**
 * OpenAI reasoning effort levels.
 * @see https://platform.openai.com/docs/guides/reasoning
 */
type OpenAIReasoningEffort =
  | "minimal"
  | "low"
  | "medium"
  | "high"
  | "xhigh"
  | "none";

/**
 * OpenAI reasoning summary modes.
 * - 'auto': Let the model decide
 * - 'concise': Brief summary of reasoning
 * - 'detailed': Full reasoning explanation
 */
type OpenAIReasoningSummary = "auto" | "concise" | "detailed";

/**
 * OpenAI-specific provider options for the AI SDK.
 */
interface OpenAIProviderOptions {
  reasoningEffort?: OpenAIReasoningEffort;
  reasoningSummary?: OpenAIReasoningSummary;
}

/**
 * Provider options map for AI SDK.
 */
interface ProviderOptions {
  openai?: OpenAIProviderOptions;
}

/**
 * Create the Seed agent.
 *
 * This is a unified agent with optimized settings for generative art creation.
 * No configuration needed - just call it and start creating.
 */
export function createSeedAgent() {
  const tools: Record<string, Tool> = {
    generate_sketch: generateSketchTool,
  };

  if (AGENT_CONFIG.webSearchEnabled) {
    tools.web_search = webSearchTool;
  }

  // Provider options for reasoning (fully typed)
  const providerOptions: ProviderOptions = {
    openai: {
      reasoningEffort: AGENT_CONFIG.reasoningEffort,
      reasoningSummary: AGENT_CONFIG.reasoningSummary,
    },
  };

  return new ToolLoopAgent({
    model: openai(AGENT_CONFIG.modelId),
    instructions: SEED_AGENT_INSTRUCTIONS,
    tools,
    toolChoice: "auto",
    stopWhen: stepCountIs(10),
    prepareStep: ({ steps }) => {
      const currentSketch = extractCurrentSketchFromSteps(steps);
      if (currentSketch) {
        return {
          system: SEED_AGENT_INSTRUCTIONS + buildSketchContext(currentSketch),
        };
      }
      return undefined;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepareCall: ({ ...settings }: any) => ({
      ...settings,
      providerOptions,
    }),
  });
}

// =============================================================================
// Type Exports
// =============================================================================

/**
 * Type-safe UI message type for the Seed agent.
 */
export type SeedAgentUIMessage = InferAgentUIMessage<
  ReturnType<typeof createSeedAgent>
>;
