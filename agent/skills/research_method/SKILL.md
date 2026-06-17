---
description: Use when the user asks you to research a question, compare sources, or produce a cited brief — gather from multiple URLs, cross-check claims, and always end with a Sources list.
---

# Research method

Follow this procedure whenever you're asked to research a topic or back an answer
with sources.

1. **Gather broadly.** Fetch every URL the user gave you with `fetch_url`, one call
   per URL. Don't stop at the first source — a brief built on a single page is a
   summary, not research. If a fetch fails (timeout, 403, 404), record it and keep
   going with the sources you do have.

2. **Extract claims.** For each source, pull out the concrete claims relevant to the
   question (numbers, dates, statements of fact). Keep track of which URL each claim
   came from.

3. **Cross-check.** Line the claims up against each other:
   - **Corroborated** — two or more independent sources agree. State it plainly.
   - **Conflicting** — sources disagree. Report both and attribute each side. Prefer
     the more specific, more recent, or more authoritative source, and say why.
   - **Single-source** — only one source supports it. Label it as such; don't promote
     it to settled fact.

4. **Write the brief.**
   - One- to three-sentence **summary** answering the question up front.
   - **Key findings** as bullets or short paragraphs, with inline attribution.
   - **Caveats / open questions** if the sources leave gaps.

5. **Cite.** End with a numbered `Sources:` list of the exact URLs you fetched
   (use the final, post-redirect URL `fetch_url` returns). Never list a source you
   didn't actually read.

## Guardrail

Never present an unverified claim as fact. If you couldn't ground it in a fetched
source, either leave it out or mark it explicitly as an inference or an unconfirmed
single-source claim.
