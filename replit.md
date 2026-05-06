# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Document Formatter (`artifacts/doc-formatter`)
- **Package**: `@workspace/doc-formatter`
- **Preview path**: `/`
- **Stack**: React + Vite, Tailwind CSS, wouter routing, shadcn/ui
- **Purpose**: Configure document formatting elements, see live previews, generate AI prompts, export settings

#### Key Files
- `src/types/formatting.ts` — ColorPalette type (13 themes), CONDITIONAL_ELEMENT_IDS, COLOR_PALETTES, DOCUMENT_PRESETS (8 templates), INITIAL_STATE
- `src/hooks/useFormattingState.ts` — all state handlers incl. updateElementIfApplicable, generatePrompt with conditional hints
- `src/context/FormattingContext.tsx` — React context wrapping the state hook
- `src/pages/Home.tsx` — main editor UI with palette sub-bar, tabs, element list, sticky generate button
- `src/pages/PreviewPage.tsx` — full document preview with compact single-row header
- `src/components/ElementEditor.tsx` — element card with toggle, if-applicable, AI-decides, Edit Style expand panel, before/after compare
- `src/components/LivePreview.tsx` — live A4-style document preview rendering
- `src/components/PromptOutput.tsx` — ChatGPT/Claude/Gemini prompt tabs with copy
- `src/components/FloatingPreviewButton.tsx` — sticky bottom-right Preview button
- `src/components/ElementMiniPreview.tsx` — mini preview used in expanded style panel

#### Features
- 13 color themes in a horizontally-scrollable palette sub-bar
- 8 document presets (Academic, Technical, Business, etc.)
- Per-element "if applicable" toggle (orange pill) for 6 conditional elements
- Per-element "AI decides" toggle (purple pill) — hides style controls when enabled
- Before/after compare mode when editing styles
- Undo/redo support
- Export/Import settings as JSON
- Dark mode toggle
- Full document preview with Export PDF (browser print)
- AI prompt generation optimized for ChatGPT, Claude, Gemini
