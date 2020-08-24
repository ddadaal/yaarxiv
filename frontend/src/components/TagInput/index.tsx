
import React from "react";

import { Box, Keyboard, TextInput } from "grommet";
import { Tag } from "./Tag";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";

const root = lang.components.tagInput;

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
            onBlur={onEnter}
            onChange={updateCurrentTag}
            disabled={disabled}
            value={currentTag}
            placeholder={<LocalizedString id={root.placeholder} />}
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
