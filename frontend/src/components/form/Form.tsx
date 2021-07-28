import { FormProps, Form as GrommetForm, Box } from "grommet";
import React, { useMemo } from "react";
import { prefix, useI18n } from "src/i18n";

type Props<T = unknown> =
  FormProps<T> & Omit<JSX.IntrinsicElements["form"], "onChange" | "onSubmit">

const root = prefix("components.form.validationError.");

export const Form = React.forwardRef<HTMLFormElement, Props>((props, ref)  => {

  const i18nStore = useI18n();

  const messages = useMemo(() => ({
    invalid: i18nStore.translate(root("invalid")) as string,
    required: i18nStore.translate(root("required")) as string,
  }), [i18nStore.currentLanguage]);

  return (
    <Box width={"large"}>
      <GrommetForm {...props} ref={ref as any} messages={messages} />
    </Box>
  );
});
