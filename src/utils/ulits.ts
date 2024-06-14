export function secondstoTime(s: number) {
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s - hours * 3600) / 60);
  const seconds = Math.floor(s - hours * 3600 - minutes * 60);

  const time =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");

  return time;
}

export function kbToSize(kilobit: number) {
  if (Number.isNaN(kilobit)) {
    return "Incalculable";
  }
  const megabytes = kilobit / 1024 / 1024;
  if (megabytes >= 1024) {
    const gigabyte = megabytes / 1024;
    return gigabyte.toFixed(2) + "GB";
  }
  return megabytes.toFixed(2) + "MB";
}

//? It's for future :)
// export function toSize(kilobyte: number) {
//   const megabytes = kilobyte / 1024;
//   if (megabytes >= 1024) {
//     const gigabyte = megabytes / 1024;
//     return gigabyte.toFixed(2) + "GB";
//   }
//   return megabytes.toFixed(2) + "MB";
// }
