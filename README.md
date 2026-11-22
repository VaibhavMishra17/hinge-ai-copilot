# Hinge AI Copilot — Phase 1

A free, installable Android PWA for manual profile analysis and AI-assisted conversation drafting.

## Included
- Profile prompt input
- Personalised analysis prompt using your saved preferences:
  - Casual dating
  - Mixed conversation style, adapting to the profile's tone
  - Human approval for every action
  - Equal priorities: shared interests, intellectual compatibility, sense of humour
- Copy prompt to ChatGPT/Gemini
- Paste and save AI analysis locally
- Saved profile list, export and delete
- Offline app shell / PWA installation

## Important limitations
This app does not log in to Hinge, read Hinge screens, scrape profiles, swipe, like, match, or send messages. It is deliberately a human-controlled companion. Use only profile information voluntarily shown to you. Avoid storing names, contact details, private/intimate data or identifiable screenshots.

## Fastest Android setup: GitHub Pages
1. Extract this ZIP.
2. Sign in to GitHub and create a new **public** repository, e.g. `hinge-ai-copilot`.
3. Upload all files and folders from this ZIP to the repository root (not the ZIP itself).
4. In repository **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for GitHub Pages to publish. Open the provided `https://<username>.github.io/hinge-ai-copilot/` URL in Chrome on Android.
6. Chrome menu **⋮ → Add to Home screen** or **Install app**.

The app is static. Profile notes are stored in that browser's local storage on your phone. Clearing site data or changing browsers can remove them; use Export my saved data periodically.

## Test without publishing
Open `index.html` on a computer for a basic preview. PWA install/offline features require HTTPS or localhost. For Android, GitHub Pages is the easiest free HTTPS host.

## How to use
1. Open Profile analysis.
2. Enter a nickname if useful, then paste one or more Hinge prompts and optional non-sensitive context.
3. Tap **Build AI analysis prompt**.
4. Tap **Copy prompt**, open ChatGPT or Gemini, paste it and ask for the analysis.
5. Copy the AI response back into **Save the analysis**, then tap **Save profile and analysis**.
6. Find it under **Saved profiles**.

## Privacy and security
- No analytics, tracking, external database, or API key.
- Profile information is not transmitted by this app. It is transmitted only if you choose to paste the generated prompt into an AI service; check that service's privacy settings.
- Do not publish personal profile data in the GitHub repository. The repository contains app source only.
- The app uses localStorage; it is not encrypted. Do not store sensitive information.

## Phase 2 ideas
- Conversation coach prompt builder
- User-defined compatibility weights
- Match status and follow-up reminders
- Optional AI API integration through a secure server-side proxy (not an API key embedded in the frontend)
