import React, { useMemo } from "react";
import { range } from "src/utils/array";

// How many words should be saved at the context
const CONTEXT_WORD_LENGTH = 40;
// If there is no highlight, how many words should be shown at maximum?
const WHOLE_CONTENT_LIMIT = 60;

interface Props {
  text: string;
  highlights: string[];
  truncate?: boolean;
}

export const Mark: React.FC = ({ children }) => (
  <mark>{children}</mark>
);

// https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string
function escapeRegExp(regex: string) {
  return regex.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Split the input with space or Chinese charater
 * Also removes empty string ""
 * @param str the string to split
 */
function splitWithSpaceAndChineseChar(str: string): string[] {
  return str.split(/(\s|[\u4E00-\uFA29])/).filter((x) => x !== "");
}

function truncateSentence(content: string) {
  const words = splitWithSpaceAndChineseChar(content);
  if (words.length > WHOLE_CONTENT_LIMIT) {
    return words.slice(0, WHOLE_CONTENT_LIMIT).join("") + " ...";
  } else {
    return words;
  }
}

export const HighlightedText: React.FC<Props> = ({
  text,
  highlights,
  truncate = false,
}) => {

  const element = useMemo(() => {

    const nonEmptyHighlights = highlights.filter((x) => x.length > 0);
    if (nonEmptyHighlights.length === 0) {
      // nothing to highlight
      // just truncate and return
      return truncate ? truncateSentence(text) : text;
    }
    const regex = new RegExp(`(${nonEmptyHighlights.map(escapeRegExp).join("|")})`, "gi");
    const splitted = text.split(regex) as (string | React.ReactNode)[];

    const matched = splitted.length > 1;

    // the odd index of the result is the matched string
    // replace the matched with highlighted text
    range(1, splitted.length, 2).forEach((i) => {
      splitted[i] = <Mark key={i}>{splitted[i]}</Mark>;
    });

    if (truncate) {
      if (matched) {
        // truncate the texts before and after the highlighted

        range(0, splitted.length, 2).forEach((i) => {
          const part = splitted[i] as string;
          // split to words
          const words = splitWithSpaceAndChineseChar(part);
          // take the leading and trailing texts
          if (words.length > CONTEXT_WORD_LENGTH) {
            // truncate the words
            const partLength = CONTEXT_WORD_LENGTH / 2;
            splitted[i] = [
              ...words.slice(0, partLength),
              " ... ",
              ...words.slice(words.length - partLength, words.length),
            ].join("");
          }
        });
      } else {
        // just truncate the whole text
        splitted[0] = truncateSentence(splitted[0] as string);
      }
    }

    return splitted;
  }, [text, ...highlights, truncate]);

  return <>{element}</>;
};

