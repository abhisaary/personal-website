# Abhisaar Yadav — Personal Site

A lightweight one-page portfolio for fractional product and AI engineering work.

## Stack

- Vite static site
- Plain HTML / CSS / JS
- Ready for Vercel

## Local development

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Export resume PDF

Generates a print-friendly PDF (media hidden, denser spacing) at `public/Abhisaar-Yadav.pdf`:

```bash
npm run export:pdf
```

## Deploy on Vercel

1. Push this repository to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Use the defaults:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Set `VITE_SITE_URL` to your production URL (e.g. `https://your-domain.com`) so Open Graph / Twitter previews use an absolute image URL.
5. Deploy.

## Adding project footage later

Drop short muted looping clips into `public/media/`:

| Project | Files |
| --- | --- |
| Vball Studio | screenshot: `vball-studio.png` (optional upload shot: `vball-upload.png`); optional clip: `vball-studio.webm` / `.mp4` |
| Studdy | `studdy-before.png`, concatenated pan strip `studdy-after-strip.png` |
| Diet Tracker | slideshow stills + history pan strip `diet-history-strip.png`; optional clip: `diet-tracker.webm` / `.mp4` |

Vball currently uses the editor screenshot as the default preview. If a video clip is added later, it replaces the still when available. Visitors with reduced-motion or Save-Data preferences keep the still.
