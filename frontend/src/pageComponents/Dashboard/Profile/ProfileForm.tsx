import React, { useState } from "react";
import { prefix } from "src/i18n";

import { FormField, Box, Button } from "grommet";
import { Localized } from "src/i18n";
import { useHttpRequest } from "src/utils/http";
import { toast } from "react-toastify";
import { Form } from "src/components/form/Form";
import { api } from "src/apis";
import { CheckboxInput } from "src/pageComponents/Dashboard/Profile/CheckboxInput";
import { Profile } from "yaarxiv-api/api/dashboard/model";
import { TagInput } from "src/components/TagInput";

const root = prefix("pages.dashboard.profile.");

interface Props {
  profile: Profile;
}

export const ProfileForm: React.FC<Props> = ({ profile }) => {

  const [form, setForm] = useState(profile);

  const [loading, setLoading] = useState(false);
  const request = useHttpRequest(setLoading);
  const submit = () => request(async () => {
    await api.dashboard.changeProfile({ body: { profileChange: form } })
      .then(() => {
        toast.success(
          <Localized id={root("success")} />
        );
      });
  });

  return (
    <Form
      onSubmit={submit}
      validate="blur"
      onReset={() => setForm(profile)}
    >
      <FormField
        label={<Localized id={root("honor")} />}
        name="honor"
        contentProps={{ border: undefined }}
      >
        <CheckboxInput
          value={{ value: form.honor, checked: form.honorPublic }}
          onChange={({ value, checked }) =>
            setForm({ ...form, honor: value, honorPublic: checked })}
          checkboxLabel={<Localized id={root("public")} />}
        />
      </FormField>
      <FormField
        label={<Localized id={root("jobTitle")} />}
        name="jobTitle"
        contentProps={{ border: undefined }}
      >
        <CheckboxInput
          value={{ value: form.jobTitle, checked: form.jobTitlePublic }}
          onChange={({ value, checked }) =>
            setForm({ ...form, jobTitle: value, jobTitlePublic: checked })}
          checkboxLabel={<Localized id={root("public")} />}
        />
      </FormField>
      <FormField
        label={<Localized id={root("institution")} />}
        name="institution"
        contentProps={{ border: undefined }}
      >
        <CheckboxInput
          value={{ value: form.institution, checked: form.institutionPublic }}
          onChange={({ value, checked }) =>
            setForm({ ...form, institution: value, institutionPublic: checked })}
          checkboxLabel={<Localized id={root("public")} />}
        />
      </FormField>
      <FormField
        label={<Localized id={root("academicKeywords")} args={[50]} />}
        name="academicKeywords"
      >
        <TagInput
          name="academicKeywords"
          value={form.academicKeywords}
          onAdd={(val) => setForm({
            ...form,
            academicKeywords: form.academicKeywords.concat(val),
          })}
          onRemove={(val) => setForm({
            ...form,
            academicKeywords: form.academicKeywords.filter((x) => x !== val),
          })}
          commaToSplit={true}
        />
      </FormField>
      <FormField
        label={<Localized id={root("researchLabels")} args={[50]} />}
        name="researchLabels"
      >
        <TagInput
          name="researchLabels"
          value={form.researchLabels}
          onAdd={(val) => setForm({
            ...form,
            researchLabels: form.researchLabels.concat(val),
          })}
          onRemove={(val) => setForm({
            ...form,
            researchLabels: form.researchLabels.filter((x) => x !== val),
          })}
          commaToSplit={true}
        />
      </FormField>
      <Box direction="row" gap="medium" margin={{ top: "medium" }}>
        <Button
          type="submit"
          label={
            <Localized
              id={loading ? root("confirming") : root("confirm")}
            />
          }
          primary
          disabled={loading}
        />
        <Button
          type="reset"
          label={<Localized id={root("reset")} />}
          disabled={loading}
        />
      </Box>
    </Form>
  );
};
