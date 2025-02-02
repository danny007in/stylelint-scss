/**
 * Check whether a string has JS template literal interpolation or HTML-like template
 *
 * @param {string} string
 * @return {boolean} If `true`, a string has template literal interpolation
 */
export default function (string) {
  return /{.+?}/.test(string);
}
