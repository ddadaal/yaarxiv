import React, { useState, useCallback } from "react";
import { Box, Text, TextInput, Anchor } from "grommet";
import { ButtonInput } from "../ButtonInput";
import { Add, Clear } from "grommet-icons";

interface Props {
  values: string[];
  onChange: (values: string[]) => void;
  allowDuplicate?: boolean;
}

export const MultipleInput: React.FC<Props> = ({
  values,
  onChange,
  allowDuplicate = false,
}) => {

  const [input, setInput] = useState("");

  const onAdd = useCallback((value: string) => {
    const newValues = [...values];
    if (allowDuplicate || !values.includes(value)) {
      newValues.push(value);
    }
    onChange(newValues);
  }, [onChange]);

  return (
    <Box gap="small">
      <Box gap="xsmall">
        {values.map((val, i) => (
          <Box direction="row" key={i} justify="between">
            <Text>{val}</Text>
            <Anchor onClick={() => {
              onChange(values.filter((x, j) => i !==j));
            }}
            >
              <Clear size="small" />
            </Anchor>
          </Box>
        ))}
      </Box>
      <ButtonInput
        value={input}
        onChange={setInput}
        onConfirm={onAdd}
      >
        <Add size="small" />
      </ButtonInput>
    </Box>
  );
};
