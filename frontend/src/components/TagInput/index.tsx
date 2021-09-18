import React from "react";

import { Box, Keyboard, TextInput } from "grommet";
import { Tag } from "./Tag";

interface Props {
  name: string;
  value: string[];
  onAdd: (tags: string[]) => void;
  onChange?: (currentInput: string) => void;
  onRemove: (str: string) => void;
  disabled?: boolean;
  maxLength?: number;
  split?: boolean;
}


export const TagInput: React.FC<Props> = ({
  name,
  value = [],
  onAdd,
  onChange,
  onRemove,
  disabled = false,
  maxLength = 30,
  split = false,
}) => {
  const [currentTag, setCurrentTag] = React.useState("");

  const updateCurrentTag = (event) => {
    setCurrentTag(event.target.value);
    onChange?.(event);
  };

  const onAddTag = (tag: string) => {

    if (onAdd) {
      // includes to dedup
      const items = split
        ? tag.split(/,|，|;|；/)
          .map((x) => x.trim().substr(0, maxLength))
          .filter((x) => !!x && !value.includes(x))
        : [tag.trim()].filter((x) => !value.includes(x));

      onAdd(items);
    }
  };

  const onEnter = () => {
    if (currentTag.length) {
      onAddTag(currentTag);
      setCurrentTag("");
    }
  };

  return (
    <Keyboard onEnter={onEnter}>
      <Box
        direction="row"
        align="center"
        pad={{ horizontal: "xsmall" }}
        wrap

      >
        {
          value.map((v, index) => (
            <Tag
              disabled={disabled}
              key={`${v}${index + 0}`}
              onRemove={() => onRemove(v)}
            >
              {v}
            </Tag>
          ))
        }
        <Box flex style={{ minWidth: "120px" }}>
          <TextInput
            name={name}
            type="search"
            plain
            onBlur={onEnter}
            onChange={updateCurrentTag}
            disabled={disabled}
            value={currentTag}
            maxLength={split ? undefined : maxLength}
            onSelect={(event) => {
              // event.stopPropagation();
              onAddTag(event.suggestion);
            }}
          />
        </Box>
      </Box>
    </Keyboard>
  );
};
