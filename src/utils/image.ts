export function getRandomImage(width = 640, height = 360) {
  const seed = Math.floor(Math.random() * 1_000_000);
  return `https://picsum.photos/${width}/${height}?random=${seed}`;
}