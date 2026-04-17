const encoder = new TextEncoder();

function getParams(rawUrl) {
  return new URL(rawUrl).searchParams;
}

function getMode(rawUrl) {
  return getParams(rawUrl).get("mode") || "blob";
}

function getTarget(rawUrl) {
  const target = getParams(rawUrl).get("url");
  if (!target) {
    throw new MessageError("missing query parameter: url");
  }
  return target;
}

function getName(rawUrl, fallback) {
  return getParams(rawUrl).get("name") || fallback;
}

function getText(rawUrl, fallback) {
  return getParams(rawUrl).get("text") || fallback;
}

function buildBlobResource(rawUrl) {
  const text = getText(rawUrl, "hello from gblob blob\n");
  const blob = new Blob([text], { type: "text/plain" });
  return {
    name: "gblob-blob",
    files: [
      {
        name: getName(rawUrl, "blob.txt"),
        size: text.length,
        req: {
          url: URL.createObjectURL(blob),
        },
      },
    ],
  };
}

function buildReadableStreamResource(rawUrl) {
  const text = getText(rawUrl, "line 1\nline 2\n");
  const lines = text.split(/\n/);
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < lines.length; i++) {
        if (i === lines.length - 1 && lines[i] === "") {
          continue;
        }
        const suffix = i < lines.length - 1 ? "\n" : "";
        controller.enqueue(encoder.encode(lines[i] + suffix));
        await new Promise((resolve) => setTimeout(resolve, 80));
      }
      controller.close();
    },
  });
  return {
    name: "gblob-stream",
    files: [
      {
        name: getName(rawUrl, "stream.txt"),
        req: {
          url: URL.createObjectURL(stream),
        },
      },
    ],
  };
}

async function buildHTTPResource(rawUrl, resumable) {
  const target = getTarget(rawUrl);
  const name = getName(rawUrl, resumable ? "remote-range.bin" : "remote.bin");

  if (resumable) {
    const head = await fetch(target, { method: "HEAD" });
    const size = parseInt(head.headers.get("content-length") || "", 10) || 0;
    const openReadable = async (offset) => {
      const headers = {};
      if (offset > 0) {
        headers.Range = `bytes=${offset}-`;
      }
      const response = await fetch(target, { headers });
      const expectedStatus = offset > 0 ? 206 : 200;
      if (response.status !== expectedStatus) {
        throw new Error(
          `unexpected response status: ${response.status}, expected ${expectedStatus}`,
        );
      }
      if (!response.body) {
        throw new Error("empty response body");
      }
      return response.body;
    };
    return {
      name: "gblob-http-range",
      range: true,
      files: [
        {
          name,
          size,
          req: {
            url: URL.createObjectURL(openReadable),
          },
        },
      ],
    };
  }

  const response = await fetch(target);
  if (response.status !== 200) {
    throw new Error(
      `unexpected response status: ${response.status}, expected 200`,
    );
  }
  if (!response.body) {
    throw new Error("empty response body");
  }
  const size = parseInt(response.headers.get("content-length") || "", 10) || 0;
  return {
    name: "gblob-http",
    files: [
      {
        name,
        size,
        req: {
          url: URL.createObjectURL(response.body),
        },
      },
    ],
  };
}

gopeed.events.onResolve(async function (ctx) {
  const mode = getMode(ctx.req.url);

  if (mode === "blob") {
    ctx.res = buildBlobResource(ctx.req.url);
    return;
  }
  if (mode === "stream") {
    ctx.res = buildReadableStreamResource(ctx.req.url);
    return;
  }
  if (mode === "http") {
    ctx.res = await buildHTTPResource(ctx.req.url, false);
    return;
  }
  if (mode === "range") {
    ctx.res = await buildHTTPResource(ctx.req.url, true);
    return;
  }

  throw new MessageError(`unsupported gblob mode: ${mode}`);
});
