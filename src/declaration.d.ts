// CSS and LESS module declarations
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.less' {
  const content: { [className: string]: string };
  export default content;
}

// Moment locale module declarations
declare module 'moment/locale/*' {
  const localeData: unknown;
  export default localeData;
}
