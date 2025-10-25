"use client";

export async function queueApiPostSync(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  if (!("serviceWorker" in navigator) || !("SyncManager" in window)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    if (!("sync" in registration)) {
      return false;
    }
    await registration.sync.register("api-post-sync");
    return true;
  } catch (error: unknown) {
    console.debug("Background sync registration failed", error);
    return false;
  }
}
