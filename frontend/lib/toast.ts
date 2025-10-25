export function toast(
  message: string,
  timeout: number = 2500,
  actionLabel?: string,
  action?: () => void
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("toast", { detail: { message, timeout, actionLabel, action } })
  );
}
