import { Select } from "grommet";
import React, { useCallback, useState } from "react";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { useHttpRequest } from "src/utils/useHttpErrorHandler";

export type Publicity = "public" | "private";

export interface Props {
  initialValue: Publicity;
  onChange: (changed: Publicity) => Promise<void>;
}

const root = lang.components.publicitySelect;

const options = [
  { label: <LocalizedString id={root.public} />, value: "public" },
  { label: <LocalizedString id={root.private} />, value: "private" },
];


export const PublicitySelect: React.FC<Props> = ({ initialValue: value, onChange }) => {

  const [loading, setLoading] = useState(false);
  const request = useHttpRequest(setLoading);

  const handleChange = useCallback(async () => {
    await request(async () => {
      await onChange(value === "public" ? "private" : "public");
    });
  }, [onChange, value]);

  return (
    <Select
      options={options}
      value={value}
      onChange={handleChange}
      disabled={loading}
    />
  );
};
