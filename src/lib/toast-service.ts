export type ToastKind = "error" | "success" | "info";

type NotifyFn = (message: string, kind?: ToastKind) => void;

let notifyHandler: NotifyFn | null = null;

export function setToastHandler(handler: NotifyFn | null) {
  notifyHandler = handler;
}

export function notify(message: string, kind: ToastKind = "error") {
  notifyHandler?.(message, kind);
}
