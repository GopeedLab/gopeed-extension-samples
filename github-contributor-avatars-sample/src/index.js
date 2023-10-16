import gopeed from 'gopeed';
import * as cheerio from 'cheerio';

gopeed.events.onResolve(async function (ctx) {
  let path = new URL(ctx.req.url).pathname.substring(1);
  const reg = /^(.*)\/contributors$/;
  const matched = path.match(reg);
  if (!matched) {
    return;
  }
  // parse repo path from url, e.g. GopeedLab/gopeed
  const repoPath = matched[1];
  gopeed.logger.debug('repoPath', repoPath);

  // generate resource name, e.g. gopeed-contributor-avatars
  const resName = repoPath.split('/')[1] + '-contributor-avatars';

  // fetch repo html
  const resp = await fetch(`https://github.com/${repoPath}`, {
    headers: {
      'User-Agent': ctx.settings.ua,
    },
  });
  const html = await resp.text();
  const $ = cheerio.load(html);
  const files = $('img.avatar')
    .map(function () {
      const url = $(this).attr('src');
      const name = $(this).attr('alt').substring(1) + '.jpg';
      return {
        name,
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
    files,
  };
});
