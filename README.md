# Caresse — Multitherapeutic Services

Website for Caresse, a multitherapeutic services center offering Speech
Therapy, ABA, Occupational Therapy, Psychomotor Therapy, and Psychological
Support.

## Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** — design tokens (colors, fonts) centralized in
  `tailwind.config.ts`, derived from the brand logo palette

## Project structure

```
app/            Next.js App Router pages, layout, global styles
components/     Presentational, typed React components (one per section)
data/           Content as typed data (services, team, stats) —
                edit here, not inside components
lib/            Shared TypeScript types
public/images/  Static assets (illustrations go here once sourced)
```

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Known gap: illustrations

The Hero and About sections have dashed placeholder boxes instead of
illustrations. The brand needs hand-drawn, textured "yarn-ball" scribble
character illustrations (reference: expressable.com), not flat vector
shapes. See the Figma design brief from our earlier conversation for the
full illustration spec. Once assets are ready, drop them in
`public/images/` and swap the placeholder `<div>` in `Hero.tsx` /
`About.tsx` for a Next.js `<Image>` component.

## Publishing this to GitHub

This repo was initialized locally (`git init`) but has **not** been
pushed anywhere yet — there's no GitHub connection available from this
environment. To publish it:

1. Create a new empty repository on GitHub (no README/gitignore — we
   already have them): https://github.com/new
2. In your terminal, from this project folder:

```bash
git add .
git commit -m "Initial commit: Next.js + TypeScript + Tailwind scaffold"
git branch -M main
git remote add origin https://github.com/<your-username>/caresse-website.git
git push -u origin main
```

Replace `<your-username>` with your GitHub handle. If you'd rather use
the GitHub CLI:

```bash
gh repo create caresse-website --public --source=. --remote=origin --push
```
