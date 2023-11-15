gopeed.events.onResolve(async function (ctx) {
  ctx.res = {
    name: "test",
    files: [
      {
        name: "index.html",
        req: {
          url: "https://github.com",
        },
      },
    ],
  };
});
