/// <reference types="vite/client" />

interface Window {
  opentype?: {
    parse: (buffer: ArrayBuffer) => Promise<opentype.Font>;
  };
}
