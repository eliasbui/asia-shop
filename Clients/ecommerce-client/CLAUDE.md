# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 ecommerce client application using:
- **Framework**: Next.js 15.5.4 with React 19.1.0
- **Styling**: Tailwind CSS v4 with PostCSS
- **TypeScript**: v5 with strict mode enabled
- **Build System**: Turbopack for development and builds

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Architecture

This is a minimal Next.js project following the App Router pattern:

### Directory Structure
- `src/app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with Geist fonts
  - `page.tsx` - Homepage with Next.js branding
  - `globals.css` - Global styles with Tailwind CSS and CSS variables
- `public/` - Static assets (Next.js logo, Vercel logo, icons)

### Key Configuration
- **TypeScript**: Path alias `@/*` maps to `./src/*`
- **Tailwind CSS v4**: Uses new inline theme configuration with CSS variables
- **Font Configuration**: Geist Sans and Geist Mono fonts optimized with next/font
- **Theme System**: CSS variables for background/foreground colors with dark mode support

### Current State
This is a fresh Next.js project with minimal customization - essentially the create-next-app template with:
- Tailwind CSS v4 integration
- TypeScript path aliases
- Geist font configuration
- Dark mode CSS variables

The application is ready for ecommerce functionality development.