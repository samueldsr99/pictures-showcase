/**
 * @template TInput, TOutput
 * @typedef {import("./types").MatchProps<TInput, TOutput>} MatchProps
 * @typedef {import("./types").Branch} Branch
 */

/**
 * @description Pattern matching syntax proposal implemented as a function.
 * It only uses basic `===` equality for matching
 * @link https://github.com/tc39/proposal-pattern-matching
 *
 * @template TInput, TOutput
 * @param {MatchProps<TInput, TOutput>} props
 * @returns {TOutput}
 */
export function match_({ value, branches, fallback }) {
  for (const branch of branches) {
    if (branch.pattern === value) {
      return branch.result instanceof Function
        ? branch.result()
        : branch.result;
    }
  }

  if (fallback) {
    return fallback instanceof Function ? fallback() : fallback;
  }

  throw new Error("No match found");
}
