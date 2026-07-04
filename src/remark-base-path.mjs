import { visit } from "unist-util-visit";

/**
 * Rewrites root-relative markdown links/images (e.g. "/blog") to include the
 * site's base path (e.g. "/doctor-ra/blog"), so content authors can write
 * natural absolute paths without needing to know about the base path.
 */
export function remarkBasePath(base) {
  return () => (tree) => {
    visit(tree, (node) => {
      if (node.type !== "link" && node.type !== "image") return;
      if (!node.url || !node.url.startsWith("/") || node.url.startsWith("//")) return;
      if (node.url.startsWith(`${base}/`) || node.url === base) return;
      node.url = `${base}${node.url}`;
    });
  };
}
