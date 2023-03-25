/**
 * Combine classNames
 */
export const cn = (mainName: string, ...names: (string | undefined)[]): string =>
  names.reduce<string>((result, name) => (name ? `${result} ${name}` : result), mainName);

/**
 * Create BEM classNames
 */
export const createBEM =
  (blockAndElement: string) =>
  (...modifiers: (string | undefined)[]): string =>
    modifiers.reduce<string>(
      (result, modifier) => (modifier ? `${result} ${blockAndElement}--${modifier}` : result),
      blockAndElement
    );
