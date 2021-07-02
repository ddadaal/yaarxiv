import { Select } from "grommet";
import React, { useCallback } from "react";
import { useAsync } from "react-async";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { useHttpErrorHandler } from "src/utils/useHttpErrorHandler";
import { PublicityText } from "./PublicityText";

export interface Props {
  initialValue: boolean;
  onChange: (changed: boolean) => Promise<boolean>;
}

const root = lang.components.publicitySelect;

const options = [
  { label: <LocalizedString id={root.public} />, value: "public" },
  { label: <LocalizedString id={root.private} />, value: "private" },
];


export const PublicitySelect: React.FC<Props> = ({ initialValue, onChange }) => {

  const errorHandler = useHttpErrorHandler();

  const deferFn = useCallback(async ([changed]) => {
    return await onChange(changed);
  }, [onChange]);

  const { data, isLoading, run } = useAsync({
    initialValue,
    deferFn,
    onReject: errorHandler,
  });

  const handleChange = (e) => {
    const newValue = e.value.value === "public";
    run(newValue);
  };

  return (
    <Select
      options={options}
      value={data ? "public" : "private"}
      labelKey="label"
      valueKey="value"
      valueLabel={
        <PublicityText publicity={data!} />
      }
      onChange={handleChange}
      disabled={isLoading}
    />
  );
};
