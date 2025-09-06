import 'vitest-axe/extend-expect'

// Silence jsdom canvas getContext warnings during axe checks by overriding with a lightweight mock
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  // axe-core calls getContext during contrast checks; return a minimal object
  value: () => ({
    fillRect: () => undefined,
    clearRect: () => undefined,
    getImageData: () => ({ data: [] }),
    putImageData: () => undefined,
    createImageData: () => [],
    setTransform: () => undefined,
    drawImage: () => undefined,
    save: () => undefined,
    fillText: () => undefined,
    restore: () => undefined,
    beginPath: () => undefined,
    moveTo: () => undefined,
    lineTo: () => undefined,
    closePath: () => undefined,
    stroke: () => undefined,
    translate: () => undefined,
    scale: () => undefined,
    rotate: () => undefined,
    arc: () => undefined,
    fill: () => undefined,
    measureText: () => ({ width: 0 }),
    transform: () => undefined,
    resetTransform: () => undefined,
    drawFocusIfNeeded: () => undefined,
  }),
  writable: true,
})
