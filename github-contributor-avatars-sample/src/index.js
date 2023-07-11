import * as cheerio from "cheerio";

gopeed.events.onResolve(async function (ctx) {
  let path = new URL(ctx.req.url).pathname.substring(1);
  const reg = /^(.*)\/contributors$/;
  const matched = path.match(reg);
  if (!matched) {
    return;
  }
  // parse repo path from url, e.g. GopeedLab/gopeed
  const repoPath = matched[1];
  // generate resource name, e.g. gopeed-contributor-avatars
  const resName = repoPath.split("/")[1] + "-contributor-avatars";

  // fetch repo html
  const resp = await fetch(`https://github.com/${repoPath}`);
  const html = await resp.text();
  const $ = cheerio.load(html);
  const files = $("img.avatar")
    .map(function () {
      const url = $(this).attr("src");
      const name = $(this).attr("alt").substring(1) + ".jpg";
      return {
        name,
        path: resName,
        req: {
          url,
        },
      };
    })
    .toArray();
  if (files.length === 0) {
    return;
  }

  ctx.res = {
    name: resName,
    range: false,
    files,
  };
});
