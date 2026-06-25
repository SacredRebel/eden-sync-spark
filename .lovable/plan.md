# Free Quote Intake + AI Assistant + Admin Dashboard

A hybrid intake flow on the public site, an optional AI assistant that reviews the submission, and a login-protected admin dashboard to review every lead.

## 1. Public intake flow (`/quote`)

A single-page wizard, simple and visual:

1. **Project vision** — short text + budget range + timeline + project type (food forest, outdoor living, etc.).
2. **Show me your space** — drag/drop or tap to upload images & videos (multi-file).
3. **Talk to me** — one-tap voice recorder (records to webm/mp4) OR short video recorder using `MediaRecorder`. Optional, can skip.
4. **Contact** — name, email, phone, address.
5. **Review & submit** — preview everything, then submit.

After submit:
- Files upload to Lovable Cloud Storage (`submissions` bucket, private).
- A `submissions` row is created with all text + file references.
- Voice/video recordings are auto-transcribed via Lovable AI speech-to-text.
- Client lands on a thank-you screen with the option to **"Chat with our AI assistant about your project"**.

## 2. AI assistant (optional, after submit)

Chat panel on the thank-you screen powered by Lovable AI (`google/gemini-3-flash-preview`):
- Receives the full submission (text + transcripts + image descriptions) as context.
- Asks 2–4 smart follow-up questions, suggests design ideas, and produces a **rough estimate range** with reasoning.
- The whole conversation is appended to the submission record.
- A "Looks great — I want to move forward" button marks the lead as `ready_to_book` so it surfaces in the dashboard.

## 3. Admin dashboard (`/admin`)

Login-protected (email + Google). Only users with `admin` role see it.

- **Leads list**: status, name, project type, budget, created date, AI estimate.
- **Lead detail**: contact, project text, image gallery, video/audio players, transcripts, AI chat transcript, AI-suggested estimate.
- **Actions**: change status (new → contacted → quoted → won/lost), add internal notes, download all assets as a zip.

## 4. GitHub mirror (optional)

When a submission is created, a server function pushes a summary `.md` file + media links to a configured GitHub repo (`SUBMISSIONS_REPO`, `GITHUB_TOKEN`). Best-effort — failures are logged, never block the user.

## 5. Site integration

- Sticky **"Get a free quote"** floating action button bottom-right on every page → opens the wizard.
- New `/quote` route for the full-screen experience.
- Navigation link added.

---

## Technical notes (for me)

- **Stack**: TanStack Start + Lovable Cloud (Supabase) + Lovable AI Gateway.
- **DB tables**: `submissions`, `submission_messages` (AI chat), `submission_status_history`, `user_roles` (`admin` enum), plus `has_role()` security-definer function.
- **Storage bucket**: `submissions` (private), path `submissions/<submission_id>/<filename>`.
- **Server fns**: `createSubmission`, `getSubmission`, `listSubmissions` (admin), `transcribeRecording`, `chatWithAssistant`, `updateSubmissionStatus`, `pushSubmissionToGithub`.
- **STT**: `openai/gpt-4o-mini-transcribe` via Lovable AI.
- **Auth**: email/password + Google. Admin role assigned via SQL after the first admin signs up.
- **Build order**:
  1. Enable Cloud, schema + roles + storage + auth + admin layout
  2. Public wizard + file upload + submission create
  3. Transcription server fn + AI chat assistant
  4. Admin dashboard (list + detail + status)
  5. Floating CTA + nav link
  6. GitHub mirror (last — needs your repo + token)

I'll skip the GitHub mirror in the first pass and ask you for repo name + token at the end. Sound good? Approve and I'll start building.