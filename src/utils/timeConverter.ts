export function timeConverter(seconds: number, format: string = "en"): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(secs).padStart(2, "0");

  return format === "en"
    ? `${formattedMinutes}m ${formattedSeconds}s`
    : `${formattedMinutes}:${formattedSeconds}`;
}
