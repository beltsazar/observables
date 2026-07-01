export function randomString(length = 50) {
  return [...Array(length + 10)]
    .map(() => (Math.random() * 1000000).toString(36).replace(".", ""))
    .join("")
    .substring(0, length);
}
