
import React from "react";

import { Box, Keyboard, TextInput } from "grommet";
import { Tag } from "./Tag";

interface Props {
  name: string;
  value: string[];
  onAdd: (str: string) => void;
  onChange?: (currentInput: string) => void;
  onRemove: (str: string) => void;
  disabled?: boolean;
}


export const TagInput: React.FC<Props> = ({
  name,
  value = [],
  onAdd,
  onChange,
  onRemove,
  disabled = false,
}) => {
  const [currentTag, setCurrentTag] = React.useState("");

  const updateCurrentTag = (event) => {
    setCurrentTag(event.target.value);
    onChange?.(event);
  };

  const onAddTag = (tag) => {
    onAdd?.(tag);
  };

  const onEnter = () => {
    if (currentTag.length) {
      onAddTag(currentTag);
      setCurrentTag("");
    }
  };

  const renderValue = () =>
    value.map((v, index) => (
      <Tag
        disabled={disabled}
        key={`${v}${index + 0}`}
        onRemove={() => onRemove(v)}
      >
        {v}
      </Tag>
    ));

  return (
    <Keyboard onEnter={onEnter}>
      <Box
        direction="row"
        align="center"
        pad={{ horizontal: "xsmall" }}
        wrap
      >
        {value.length > 0 && renderValue()}
        <Box flex style={{ minWidth: "120px" }}>
          <TextInput
            name={name}
            type="search"
            plain
            onChange={updateCurrentTag}
            disabled={disabled}
            value={currentTag}
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
