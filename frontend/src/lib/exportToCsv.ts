/**
 * Export data to CSV file
 */
export function exportToCsv<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columnHeaders?: Record<keyof T, string>
): void {
  if (data.length === 0) {
    return;
  }

  // Get all keys from the first object
  const keys = Object.keys(data[0]) as Array<keyof T>;

  // Create CSV header
  const header = keys.map(
    (key) => columnHeaders?.[key] || String(key)
  );

  // Create CSV rows
  const rows = data.map((item) =>
    keys.map((key) => {
      const value = item[key];
      // Handle null/undefined
      if (value == null) {
        return "";
      }
      // Handle objects/arrays
      if (typeof value === "object") {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      // Handle strings with quotes or commas
      if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return String(value);
    })
  );

  // Combine header and rows
  const csvContent = [header, ...rows]
    .map((row) => row.join(","))
    .join("\n");

  // Add BOM for Excel to recognize UTF-8
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });

  // Create download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Format date for CSV filename
 */
export function getCsvFilename(prefix: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${prefix}_${year}${month}${day}_${hours}${minutes}`;
}
