export const normalizePath = (url: string): string => {
  const clean = url.split("?")[0].split("#")[0]; // Remove query parameters and hash

  if (clean.length > 1 && clean.endsWith("/")) {
    return clean.slice(0, -1); // Remove trailing slash unless it's the root path
  }

  return clean;
};

export const isActiveLink = (
  pathname: string,
  href: string,
  exact = false,
): boolean => {
  // console.log({ pathname, href });

  const current = normalizePath(pathname);
  const target = normalizePath(href);
  // console.log({ current, target });

  if (exact) return current === target;

  // Match exact Or child routes
  return current === target || current?.startsWith(target + "/");
};
