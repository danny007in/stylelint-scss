import { isSingleLineString, namespace, ruleUrl } from "../../utils";
import { utils } from "stylelint";
import { isBoolean } from "lodash";

export const ruleName = namespace("at-if-closing-brace-newline-after");

export const messages = utils.ruleMessages(ruleName, {
  expected: 'Expected newline after "}" of @if statement',
  rejected: 'Unexpected newline after "}" of @if statement'
});

export const meta = {
  url: ruleUrl(ruleName)
};

export default function rule(expectation, options, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: expectation,
        possible: ["always-last-in-chain"]
      },
      {
        actual: options,
        possible: {
          disableFix: isBoolean
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    sassConditionalBraceNLAfterChecker({
      root,
      result,
      ruleName,
      atRuleName: "if",
      expectation,
      messages,
      context,
      options
    });
  };
}

/**
 * The core logic for this rule. Can be imported by other rules with similar
 * logic, namely at-else-closing-brace-newline-after
 *
 * @param {Object} args -- Named arguments object
 * @param {PostCSS root} args.root
 * @param {PostCSS result} args.result
 * @param {String ruleName} args.ruleName - needed for `report` function
 * @param {String} args.atRuleName - the name of the at-rule to be checked, e.g. "if", "else"
 * @param {Object} args.messages - returned by stylelint.utils.ruleMessages
 * @return {undefined}
 */
export function sassConditionalBraceNLAfterChecker({
  root,
  result,
  ruleName,
  atRuleName,
  expectation,
  messages,
  context,
  options
}) {
  const shouldFix = context.fix && (!options || options.disableFix !== true);

  function complain(node, message, index, fixValue) {
    if (shouldFix) {
      node.next().raws.before = fixValue;

      return;
    }

    utils.report({
      result,
      ruleName,
      node,
      message,
      index
    });
  }

  root.walkAtRules(atrule => {
    // Do nothing if it's not an @if
    if (atrule.name !== atRuleName) {
      return;
    }

    const nextNode = atrule.next();

    if (!nextNode) {
      return;
    }

    const nextBefore = nextNode.raws.before;
    const hasNewLinesBeforeNext = nextBefore && !isSingleLineString(nextBefore);
    const reportIndex = atrule.toString().length;

    if (expectation === "always-last-in-chain") {
      // If followed by @else, no newline is needed
      if (
        nextNode.type === "atrule" &&
        (nextNode.name === "else" || nextNode.name === "elseif")
      ) {
        if (hasNewLinesBeforeNext) {
          complain(atrule, messages.rejected, reportIndex, " ");
        }
      } else {
        if (!hasNewLinesBeforeNext) {
          complain(atrule, messages.expected, reportIndex, context.newline);
        }
      }
    }
  });
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
