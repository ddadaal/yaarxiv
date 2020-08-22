import React, { useState, useCallback, useMemo, useEffect } from "react";
import { TextInput, Box, Button } from "grommet";
import { Search } from "grommet-icons";
import Link from "next/link";
import { constructSearchString, SearchQuery } from "src/models/SearchQuery";

interface Props {
  value: string;
  onChange?: (newValue: string) => void;
  onConfirm?: (value: string) => void;
}

export const ButtonInput: React.FC<Props> = ({
  value,
  onConfirm,
  onChange,
  children,
}) => {
  return (
    <Box
      width="medium"
      direction="row"
      align="center"
      round="small"
      border
    >
      <TextInput
        plain
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <Button margin="xsmall" onClick={() => onConfirm?.(value)}>
        {children}
      </Button>
    </Box>
  );

};
