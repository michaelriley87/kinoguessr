// Transform answers to title-case to display
export function toTitleCase(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Randomize the order of actors
export function shuffleArray(array) {
for (let i = array.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [array[i], array[j]] = [array[j], array[i]];
}
return array;
}

// Convert any name (film title or actor) to a sanitized image filename
export function getImageFilename(name) {
  return `${import.meta.env.BASE_URL}images/${name
    .toLowerCase()
    .replace(/['!.,:?]/g, "")
    .replace(/ /g, "_")}.jpg`;
}

// Remove punctuation for text comparison
export function sanitizeText(text) {
  return text.toLowerCase().replace(/['!.,:?]/g, "");
}