declare module 'timecut' {
  export default function timecut(params: {
    duration: number,
    output: string,
    tempDir: string,
    url: string,
    viewport: {
      width: number,
      height: number,
    },
  }): { then: (arg: () => void) => void };
}
