gopeed.events.onResolve(async function (ctx) {
  // Support the releases page, latest release, and a specific release tag.
  const match = new URL(ctx.req.url).pathname.match(
    /^\/([^/]+)\/([^/]+)\/releases(?:\/(?:latest|tag\/(.+?)))?\/?$/
  );
  if (!match) {
    throw new Error("Use a GitHub releases, releases/latest, or releases/tag/<tag> URL.");
  }
  const repo = `${match[1]}/${match[2]}`;
  const release = match[3]
    ? `tags/${encodeURIComponent(decodeURIComponent(match[3]))}`
    : "latest";
  const headers = {
    "User-Agent": gopeed.settings.ua,
    Accept: "application/vnd.github+json",
  };
  const token = (gopeed.settings.token || "").trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  // fetch release info by github api
  const resp = await fetch(`https://api.github.com/repos/${repo}/releases/${release}`, {
    headers,
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(`GitHub API request failed (${resp.status}): ${data.message || resp.statusText}`);
  }
  const resName = match[2] + "-" + data.tag_name;
  ctx.res = {
    name: resName,
    files: data.assets.map((item) => ({
      name: item.name,
      size: item.size,
      req: {
        url: item.browser_download_url,
      },
    })),
  };
});
