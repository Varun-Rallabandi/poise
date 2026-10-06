# Poise

Practice defending your take-home project on camera until it feels boring.

Upload your take-home repo. Poise reads the whole thing and plays the interviewer, asking out loud the questions a real interviewer would ask about *your* code. You answer on camera while it tracks pace, filler words and pauses. Hints fade as you improve, until you're doing a full mock interview with no help.

Built for people who know their code but freeze on video calls.

## How it works

1. **Load your repo.** Pick the folder. node_modules, build output, lockfiles and binaries are skipped, and anything that's too large is listed rather than silently dropped.
2. **Claude writes the interview.** It reads every file and returns a project summary, the weak spots an interviewer will probe, and 3–20 questions covering design, tradeoffs, scaling, edge cases, testing, bugs, and "change this live" prompts. Each question comes with talking points and cue words grounded in real files.
3. **Practice on camera.** It's a video-call layout with an AI interviewer that speaks, your mirrored webcam, live transcript and live delivery metrics.
4. **Get coached.** After each answer you get a score, what worked, what to fix, points from your code you missed, a tighter 30–45s version (it can read that aloud), and a realistic follow-up you can take as the next question.

### The hint ladder

| Level | Name | While you answer | Feedback |
|---|---|---|---|
| 1 | Training wheels | Full talking points | After each answer |
| 2 | Cue words | 2–4 keywords | After each answer |
| 3 | Solo, coached | Nothing | After each answer |
| 4 | Mock interview | Nothing | All at the end |

After each session Poise suggests moving up a level when your average score is 7.5 or higher, or back down when it's under 4.5.

### Friend mode (Google Meet)

Practicing with a real person is the closest thing to the real interview. Turn on friend mode, start a Google Meet with a friend, and click **Copy questions for your friend** to paste them a script (questions plus what to listen for). The AI voice stays quiet and the question text is hidden so you have to listen. Poise keeps transcribing and coaching in your tab.

### Progress

Every session's average score, pace, fillers per minute and longest pause are saved in your browser, with a trend line on the home page. Demo runs aren't counted.

## Run it

```bash
pnpm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
pnpm dev
```

Open http://localhost:3000 in **Chrome or Edge** (speech-to-text uses the Web Speech API). No key yet? Click **Try a 3-question demo**, which uses canned questions and offline scoring.

## Stack

- Next.js 16 (App Router) + Tailwind 4
- Claude (`claude-opus-4-8`) through `@anthropic-ai/sdk`, with adaptive thinking and zod structured outputs
- The repo is sent as a single cached system block that leads every request, so after question generation each answer is graded at cache-read prices
- Web Speech API for speech-to-text and the interviewer voice, `getUserMedia` for the camera preview (nothing is recorded or uploaded)

## Development

```bash
pnpm test     # vitest: repo filtering, metrics, session reducer, hints, grading, history, summary
pnpm e2e      # playwright: full demo sessions with a fake camera, TTS and speech recognition
pnpm lint
```

```
app/api/questions   question generation (streams, structured output)
app/api/feedback    grades one answer against the code
lib/session.ts      session state machine (ask → answer → grade → review)
lib/hints.ts        the hint ladder
lib/metrics.ts      wpm, fillers, pauses
hooks/useSpeech.ts  continuous speech-to-text with pause tracking
components/room     the practice room
```
