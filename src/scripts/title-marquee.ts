const fullTitle = document.title;
const windowSize = 30;

if (fullTitle.length > windowSize) {
  const maxPos = fullTitle.length - windowSize;
  let pos = 0;
  let direction: 1 | -1 = 1;
  let pauseTicks = 0;

  setInterval(() => {
    if (pauseTicks > 0) {
      pauseTicks -= 1;
      return;
    }
    document.title = fullTitle.slice(pos, pos + windowSize);
    pos += direction;
    if (pos >= maxPos || pos <= 0) {
      direction = direction === 1 ? -1 : 1;
      pauseTicks = 6;
    }
  }, 200);
}
