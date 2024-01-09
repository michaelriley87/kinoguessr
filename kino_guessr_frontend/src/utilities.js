//transform answers to title-case to display
export function toTitleCase(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  
  //randomize the order of actors
  export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  //extract title from file name
  export function getFilenameFromUrl(url) {
    if (!url) {return ''}
    const match = url.match(/([^/]+)(?=\.\w+$)/);
    return match ? match[0].replace(/_/g, ' ') : '';
  }
  