# CutNFlow Portfolio

A React + Vite portfolio landing page for a video editor and storyteller.

## Overview

This project demonstrates a cinematic web portfolio with interactive video content, custom cursor behavior, animated card hover effects, and a fullscreen cinema playback experience.

## Key features

- React 19 + Vite
- Custom cinematic styling and motion effects in `src/App.jsx`
- Interactive work cards with hover tilt and fullscreen video playback
- Featured section with looping background video and playable showreel
- Shared cinema modal for video playback controls
- Smooth scrolling, scroll progress indicator, and reveal animations

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Project structure

- `src/App.jsx` — main application logic for all sections and interactions
- `src/index.css` — base styling and layout resets
- `src/App.css` — additional component and animation styles
- `public/` — static assets for the app

## Notes

- The featured section now uses the same cinema player behavior as the work cards.
- Clicking the featured play button opens a fullscreen modal with playback controls.
- This is a single-page interactive portfolio, not a multi-route application.
