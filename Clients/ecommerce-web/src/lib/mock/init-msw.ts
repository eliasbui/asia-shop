export async function initMSW() {
  if (typeof window === "undefined") {
    return;
  }

  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const { worker } = await import("./browser");

  await worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: {
      url: "/mockServiceWorker.js",
    },
  });

  console.log("🔧 MSW started");
}
