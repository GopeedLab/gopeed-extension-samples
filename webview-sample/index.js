function getTarget(rawUrl) {
  const source = new URL(rawUrl);
  const target = source.searchParams.get("url");
  if (!target) {
    throw new MessageError("missing query parameter: url");
  }
  return target;
}

gopeed.events.onResolve(async function (ctx) {
  gopeed.logger.info("Received request:", ctx.req.url);
  if (!gopeed.runtime.webview || !gopeed.runtime.webview.isAvailable()) {
    throw new MessageError("webview is unavailable");
  }

  const target = getTarget(ctx.req.url);
  const page = await gopeed.runtime.webview.open({
    headless: true,
    title: "Gopeed WebView Probe",
    width: 1280,
    height: 800,
  });

  try {
    await page.navigate(target, { timeoutMS: 30000 });
    await page.waitForLoad({ timeoutMS: 30000 });

    const snapshot = await page.execute(() => ({
      title: document.title || "",
      url: String(location.href || ""),
      readyState: document.readyState,
      userAgent: navigator.userAgent,
    }));
    const cookies = await page.getCookies();
    const body = JSON.stringify({ ...snapshot, cookies }, null, 2);

    ctx.res = {
      name: "webview-probe",
      files: [
        {
          name: "webview-probe.json",
          size: body.length,
          req: {
            url: URL.createObjectURL(
              new Blob([body], { type: "application/json" }),
            ),
          },
        },
      ],
    };
  } finally {
    await page.close();
  }
});
