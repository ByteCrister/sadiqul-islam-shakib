/**
 * Convert a File object to a Base64 encoded string.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Validates that the file size is under the specified limit (in MB).
 * @param file The file to check.
 * @param maxMb Maximum allowed size in Megabytes (default: 2MB).
 */
export function validateFileSize(file: File, maxMb = 2): boolean {
  const bytesLimit = maxMb * 1024 * 1024;
  return file.size <= bytesLimit;
}
