import type { RepoFile } from "./types";

const SKIP_DIRS =
  /(^|\/)(node_modules|\.git|\.next|dist|build|out|coverage|\.venv|venv|__pycache__|\.turbo|target|vendor)\//;
const SKIP_FILES = /(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|\.min\.(js|css)|\.map)$/;

/** Dependency folders, build output and lockfiles are noise for an interviewer. */
export function isIgnoredPath(path: string): boolean {
  return SKIP_DIRS.test(path) || SKIP_FILES.test(path);
}

const TEXT_EXT =
  /\.(ts|tsx|js|jsx|mjs|cjs|py|go|rs|java|kt|rb|php|cs|c|cc|cpp|h|hpp|swift|sql|md|json|ya?ml|toml|html|css|scss|sh|prisma|graphql|txt)$/i;
const BARE_NAMES = /(^|\/)(Dockerfile|Makefile|README|Procfile)$/;

/** Only source and config files are worth sending to the model. */
export function isTextFile(path: string): boolean {
  return TEXT_EXT.test(path) || BARE_NAMES.test(path);
}

export const MAX_FILE_CHARS = 120_000;
export const MAX_TOTAL_CHARS = 1_500_000; // roughly 400k tokens, well inside a 1M context

export type RepoLoad = { files: RepoFile[]; skipped: string[]; totalChars: number };

/** Minimal shape of a browser File so this is testable outside the DOM. */
export type FileLike = { name: string; size: number; webkitRelativePath?: string; text(): Promise<string> };

export async function readRepoFolder(list: ArrayLike<FileLike>): Promise<RepoLoad> {
  const files: RepoFile[] = [];
  const skipped: string[] = [];
  let totalChars = 0;

  for (const file of Array.from(list)) {
    const path = stripRootFolder(file.webkitRelativePath || file.name);
    if (isIgnoredPath(path) || !isTextFile(path)) continue;
    if (file.size > MAX_FILE_CHARS) {
      skipped.push(`${path} (too large)`);
      continue;
    }
    const content = await file.text();
    if (totalChars + content.length > MAX_TOTAL_CHARS) {
      skipped.push(`${path} (repo size limit)`);
      continue;
    }
    totalChars += content.length;
    files.push({ path, content });
  }
  return { files, skipped, totalChars };
}

/** "my-takehome/src/app.ts" -> "src/app.ts" so paths read like they do in an editor. */
export function stripRootFolder(path: string): string {
  const i = path.indexOf("/");
  return i === -1 ? path : path.slice(i + 1);
}
