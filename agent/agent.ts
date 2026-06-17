import { defineAgent } from "eve";

// Model routed through Vercel AI Gateway — no per-provider API key needed.
// Sonnet 4.6 handles multi-source synthesis well; swap to
// "anthropic/claude-opus-4.8" when the question needs heavier reasoning or
// reconciling many conflicting sources.
export default defineAgent({
  model: "anthropic/claude-sonnet-4.6",
});
