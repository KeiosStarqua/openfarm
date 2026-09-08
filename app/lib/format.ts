export function formatDate(ms: number) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(ms))
}

export function formatDateTime(ms: number) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(ms))
}

export function daysBetween(from: number, to: number) {
  return Math.max(0, Math.round((to - from) / (24 * 60 * 60 * 1000)))
}
