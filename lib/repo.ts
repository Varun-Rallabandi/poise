const SKIP_DIRS =
  /(^|\/)(node_modules|\.git|\.next|dist|build|out|coverage|\.venv|venv|__pycache__|\.turbo|target|vendor)\//;
const SKIP_FILES = /(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|\.min\.(js|css)|\.map)$/;

/** Dependency folders, build output and lockfiles are noise for an interviewer. */
export function isIgnoredPath(path: string): boolean {
  return SKIP_DIRS.test(path) || SKIP_FILES.test(path);
}
