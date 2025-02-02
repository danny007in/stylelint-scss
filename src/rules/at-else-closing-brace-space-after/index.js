import { namespace, ruleUrl } from "../../utils";
import { utils } from "stylelint";
import { sassConditionalBraceSpaceAfterChecker } from "../at-if-closing-brace-space-after";

export const ruleName = namespace("at-else-closing-brace-space-after");

export const messages = utils.ruleMessages(ruleName, {
  expected: 'Expected single space after "}" of @else statement',
  rejected: 'Unexpected space after "}" of @else statement'
});

export const meta = {
  url: ruleUrl(ruleName)
};

export default function rule(expectation, _, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always-intermediate", "never-intermediate"]
    });

    if (!validOptions) {
      return;
    }

    sassConditionalBraceSpaceAfterChecker({
      root,
      result,
      ruleName,
      atRuleName: "else",
      expectation,
      messages,
      context
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
