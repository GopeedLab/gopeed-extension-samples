gopeed.events.onResolve(async function (ctx) {
  // parse repo release path from url, e.g. GopeedLab/gopeed/releases or GopeedLab/gopeed/releases/tag/v1.3.0
  let path = new URL(ctx.req.url).pathname.substring(1);
  let tag = path.split("/").pop();
  if (tag === "releases") {
    path += "/latest";
  } else {
    path += `/tags/${tag}`;
  }
  // fetch release info by github api
  const resp = await fetch(`https://api.github.com/repos/${path}`, {
    headers: {
      "User-Agent": gopeed.settings.ua,
    },
  });
  const data = await resp.json();
  const resName = path.split("/")[1] + "-" + data.tag_name;
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
