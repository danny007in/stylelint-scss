/**
 * Check if a string contains at least one empty line
 *
 * @param {string} string
 * @return {boolean}
 */
export default function (string) {
  return string && (string.includes("\n\n") || string.includes("\n\r\n"));
}
