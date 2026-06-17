<div align="center">

# 🔎 Web Research

**An Eve agent that researches a question across URLs and returns a cited brief**, cross-checking claims so every fact is traceable to a source. A web chat plus the agent, ready to deploy.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FuxKero%2Fweb-research&env=AI_GATEWAY_API_KEY&envDescription=Model%20access%20via%20the%20Vercel%20AI%20Gateway&envLink=https%3A%2F%2Fgithub.com%2FuxKero%2Fweb-research%2Fblob%2Fmain%2Fdocs%2FENVIRONMENT.md&project-name=web-research&repository-name=web-research)

[![Powered by Vercel](https://img.shields.io/badge/▲%20Powered%20by%20Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Built on Eve](https://img.shields.io/badge/Built%20on%20Eve-000000?style=for-the-badge)](https://eve.dev)
[![License MIT](https://img.shields.io/badge/License-MIT-3b3b3b?style=for-the-badge)](./LICENSE)

**▶ [Live demo](https://web-research-nine.vercel.app)** · a visual preview (deploy your own, add a key, and it answers)

</div>

---

## How it works

Give it a question and a set of URLs. It:

- **reads** the readable text from each page (`fetch_url`),
- **cross-checks** claims across sources,
- **returns** a dense brief where every fact has a citation, flags conflicts, labels single-source and unconfirmed claims, and ends with a numbered `Sources` list.

It never states unverified claims as fact. No keys beyond the model, the tool only does plain HTTP fetches.

Two services run on Vercel from [`vercel.json`](vercel.json): the **web** chat (Next.js) and the **eve** agent runtime, reached same-origin via `useEveAgent`.

## Deploy

Click the button above. Vercel clones this repo and asks for one variable, `AI_GATEWAY_API_KEY` (or link the project for OIDC). See [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md).

## Run it locally

Requirements: **Node 24+**, pnpm.

```bash
pnpm install
cp .env.example .env.local   # add your AI Gateway key
pnpm dev                     # http://localhost:3000
```

## Inside the agent

```
agent/
├─ agent.ts                       # model (via the AI Gateway) + runtime
├─ instructions.md                # the analyst persona + citation rules
├─ tools/
│  └─ fetch_url.ts                # pulls readable text from a URL
└─ skills/
   └─ research_method/SKILL.md    # cross-check, label, cite
```

## Make it your own

- Add a search tool so it finds sources itself, not just the ones you give it.
- Tighten the citation rules in `instructions.md` for your domain.
- Swap the model in `agent/agent.ts` (anything on the AI Gateway).

## Stack

[Vercel Eve](https://eve.dev) · [AI Gateway](https://vercel.com/ai-gateway) · [Next.js](https://nextjs.org) · deployed on [Vercel](https://vercel.com).

<sub>One of the Eve agent templates from <a href="https://github.com/uxKero">Eden</a>. MIT licensed.</sub>
