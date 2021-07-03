import { FormProps, Form as GrommetForm } from "grommet";
import React, { useMemo } from "react";
import { lang, useI18nStore } from "src/i18n";

type Props<T = unknown> =
  FormProps<T> & Omit<JSX.IntrinsicElements["form"], "onChange" | "onSubmit">

const root = lang.components.form.validationError;

export const Form = React.forwardRef<HTMLFormElement, Props>((props, ref)  => {

  const i18nStore = useI18nStore();

  const messages = useMemo(() => ({
    invalid: i18nStore.translate(root.invalid) as string,
    required: i18nStore.translate(root.required) as string,
  }), [i18nStore.currentLanguage]);

  return (
    <GrommetForm {...props} ref={ref as any} messages={messages} />
  );
});
