/** Prefixes an app-relative path with the configured base path (e.g. '/doctor-ra'). */
export function withBase(path: string = "/"): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const clean = path === "/" ? "/" : `/${path.replace(/^\/+/, "")}`;
  return `${base}${clean}`;
}

/** Compares the current URL pathname against an app-relative path, ignoring trailing slashes. */
export function isActivePath(currentPathname: string, targetPath: string): boolean {
  const normalize = (p: string) => p.replace(/\/+$/, "") || "/";
  return normalize(currentPathname) === normalize(withBase(targetPath));
}
