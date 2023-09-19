gopeed.events.onResolve(async function (ctx) {
  ctx.res = {
    name: "test",
    files: data.assets.map((item) => ({
      name: "test.txt",
      req: {
        url: item.browser_download_url,
      },
    })),
  };
});
