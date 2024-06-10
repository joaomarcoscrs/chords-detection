export function playElementSound(element) {
  if (!element) {
    return;
  }

  element.play();
}