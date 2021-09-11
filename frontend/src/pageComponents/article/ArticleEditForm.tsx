import {
  Anchor, Box, Button, CheckBox, FormField,
  Heading, Paragraph,
} from "grommet";
import React, { useMemo, useState } from "react";
import { Localized, prefix } from "src/i18n";
import { FileUploader } from "src/components/FileUploader";
import { Form } from "src/components/form/Form";
import { TagInput } from "src/components/TagInput";
import {
  codeLinkValidation,
  ACCEPTABLE_CODE_SITES,
} from "src/utils/validations/codeLink";
import {
  ArticleId,
  ArticleInfoI18nPart,
  Author,
  TITLE_MAX_LENGTH,
} from "yaarxiv-api/api/article/models";
import { DownloadPdfLink } from "./DownloadPdfLink";
import {
  ALLOWED_SCRIPT_FORMAT,
  SCRIPT_SIZE_LIMIT_MB,
} from "yaarxiv-api/api/article/uploadScript";
import { ARTICLE_ABSTRACT_LENGTH_LIMIT } from "yaarxiv-api/api/article/upload";
import { FormFieldMessage } from "src/components/form/FormFieldMessage";
import { AuthorInput } from "src/pageComponents/article/AuthorInput";
import { authorEquals } from "src/models/Article";
import { ArticleAbstractInput } from "src/pageComponents/article/ArticleAbstractInput";
import { Modal } from "src/components/modals/Modal";

const root = prefix("pages.upload.");

type ArticleFormInternal = {
  authors: Author[];
  abstract: string;
  codeLink: string;
  cnTitle: string;
  enTitle: string;
  cnKeywords: string[];
  enKeywords: string[];
  file: File | undefined;
  doi?: string;
  promise: boolean;
};

export type ArticleForm = {
  authors: Author[];
  abstract: string;
  codeLink?: string;
  doi?: string;
} & ArticleInfoI18nPart;

interface Props {
  articleId: ArticleId | undefined;
  initial: ArticleForm;
  disabled: boolean;
  onSubmit: (file: File | undefined, form: ArticleForm) => void;
}

export const ArticleEditForm: React.FC<Props> = ({
  articleId,
  initial,
  disabled,
  onSubmit,
}) => {

  const initialInternal = useMemo(() => ({
    abstract: initial.abstract,
    authors: initial.authors,
    codeLink: initial.codeLink || "",
    cnKeywords: initial.cnKeywords || [],
    cnTitle: initial.cnTitle || "",
    enKeywords: initial.enKeywords || [],
    enTitle: initial.enTitle || "",
    file: undefined,
    doi: initial.doi || "",
    promise: false,
  }), [initial]);

  const [info, setInfo] = useState<ArticleFormInternal>(initialInternal);

  const updateInfo = (newInfo: Partial<ArticleFormInternal>) =>
    setInfo({ ...info, ...newInfo });

  const pdfSizeLimit = SCRIPT_SIZE_LIMIT_MB;

  const [showConfirm, setShowConfirm] = useState(false);

  const submit = () => {
    onSubmit(info.file, {
      abstract: info.abstract,
      authors: info.authors,
      codeLink: info.codeLink || undefined,
      cnKeywords: info.cnKeywords.length === 0 ? undefined : info.cnKeywords,
      enKeywords: info.enKeywords.length === 0 ? undefined : info.enKeywords,
      cnTitle: info.cnTitle || undefined,
      enTitle: info.enTitle || undefined,
      doi: info.doi || undefined,
    });
  };

  return (
    <Box gap="large">
      <Form
        disableEnterToSubmit
        onReset={() => setInfo(initialInternal)}
        value={info}
        onSubmit={() => setShowConfirm(true)}
        validate="change"
      >
        <Box>
          <Heading level="2" size="small" margin="none">
            <Localized id={root("pdf.title")}/>
          </Heading>
          <Paragraph fill>
            <Localized
              id={root("pdf.description")}
              args={[pdfSizeLimit, ALLOWED_SCRIPT_FORMAT.join(", ")]}
            />
          </Paragraph>
          { articleId
            ? (
              <Paragraph>
                <Localized id={root("pdf.existing")} args={[
                  <DownloadPdfLink articleId={articleId} key="download">
                    {(downloadLink) => (
                      <Anchor
                        target="__blank"
                        onClick={downloadLink}
                      >
                        <Localized id={root("pdf.here")} />
                      </Anchor>
                    )}
                  </DownloadPdfLink>,
                ]}
                />
              </Paragraph>
            ) : undefined
          }
          <FormField
            name="file"
            validate={(value) => {
              if (!articleId && !value) {
                return <FormFieldMessage id={root("pdf.prompt")} />;
              }
            }}
            contentProps={{ border: undefined }}
          >
            <FileUploader
              options={{
                accept: [".pdf", ".docx", ".doc", ".txt"],
                multiple: false,
                maxSize: pdfSizeLimit * 1024 * 1024,
              }}
              files={info.file ? [info.file] : []}
              onFileRemoved={() => updateInfo({ file: undefined })}
              onFilesAccepted={(f) => updateInfo({ file: f[0] })}
            />
          </FormField>
        </Box>
        <Box>
          <Heading level="2" size="small" margin={{ top: "small" }}>
            <Localized id={root("info.title")} />
          </Heading>
          <Box align="center" pad="medium" border>
            <Localized id={root("info.prompt")} />
          </Box>
          <Box margin={{ vertical: "small" }}>
            <FormField
              label={(
                <Localized
                  id={root("info.articleTitleCn")}
                  args={[TITLE_MAX_LENGTH]}
                />)}
              name="cnTitle"
              value={info.cnTitle}
              disabled={disabled}
              maxLength={TITLE_MAX_LENGTH}
              onChange={(e) => updateInfo({ cnTitle: e.target.value })}
              validate={(value: string, values: ArticleFormInternal) => {
                if (values.cnKeywords.length > 0 && !value) {
                  return (
                    <FormFieldMessage id={root("info.fillOrDelete")} args={[
                      <Localized key="keywordsCn" id={root("info.keywordsCn")} />,
                    ]}
                    />
                  );
                }
                if (!values.cnTitle && !values.enTitle) {
                  return (
                    <FormFieldMessage id={root("info.oneLanguageRequired")} />
                  );
                }
              }}
            />
            <FormField
              label={<Localized id={root("info.keywordsCn")} args={[50]} />}
              name="cnKeywords"
              validate={(value: string[], values: ArticleFormInternal) => {
                if (values.cnTitle && value.length === 0) {
                  return (
                    <FormFieldMessage id={root("info.fillOrDelete")} args={[
                      <Localized key="titleCn" id={root("info.articleTitleCn")} />,
                    ]}
                    />
                  );
                }
              }}
            >
              <TagInput
                name="cnKeywords"
                disabled={disabled}
                value={info.cnKeywords || []}
                maxLength={50}
                onAdd={(v) => updateInfo({ cnKeywords: info.cnKeywords.concat(v) })}
                onRemove={(val) =>
                  updateInfo({ cnKeywords: info.cnKeywords.filter((x) => x !== val) })}
                commaToSplit={true}
              />
            </FormField>
            <FormField
              label={<Localized id={root("info.articleTitleEn")} args={[100]} />}
              name="enTitle"
              value={info.enTitle}
              disabled={disabled}
              maxLength={100}
              onChange={(e) => updateInfo({ enTitle: e.target.value })}
              validate={(value: string, values: ArticleFormInternal) => {
                if (values.enKeywords.length > 0 && !value) {
                  return (
                    <FormFieldMessage id={root("info.fillOrDelete")} args={[
                      <Localized key="keywordsEn" id={root("info.keywordsEn")} />,
                    ]}
                    />
                  );
                }
                if (!values.cnTitle && !values.enTitle) {
                  return (
                    <FormFieldMessage id={root("info.oneLanguageRequired")} />
                  );
                }
              }}
            />
            <FormField
              label={<Localized id={root("info.keywordsEn")} args={[50]} />}
              name="enKeywords"
              validate={(value: string[], values: ArticleFormInternal) => {
                if (values.enTitle && value.length === 0) {
                  return (
                    <FormFieldMessage id={root("info.fillOrDelete")} args={[
                      <Localized key="titleEn" id={root("info.articleTitleEn")} />,
                    ]}
                    />
                  );
                }
              }}
            >
              <TagInput
                name="enKeywords"
                disabled={disabled}
                value={info.enKeywords || []}
                maxLength={50}
                onAdd={(v) => updateInfo({ enKeywords: info.enKeywords.concat(v) })}
                onRemove={(val) =>
                  updateInfo({ enKeywords: info.enKeywords.filter((x) => x !== val) })}
                commaToSplit={true}
              />
            </FormField>
            <FormField
              label={<Localized id={root("info.authors.field")} args={[50]} />}
              name="authors"
              contentProps={{ border: undefined }}
              validate={(authors: string[]) => {
                if (authors.length === 0) {
                  return <FormFieldMessage id={root("info.authors.required")} />;
                }
              }}
            >
              <AuthorInput
                value={info.authors}
                disabled={disabled}
                onAdd={(val) => updateInfo({ authors: info.authors.concat(val) })}
                onRemove={(val) => updateInfo({
                  authors: info.authors.filter((x) => !authorEquals(x, val)),
                })}
              />
            </FormField>
            <FormField
              label={(
                <Localized
                  id={root("info.abstract.title")}
                />
              )}
              name="abstract"
              required
              contentProps={{ border: undefined }}
            >
              <ArticleAbstractInput
                disabled={disabled}
                value={info.abstract}
                onChange={(val) => updateInfo({ abstract: val })}
                maxLength={ARTICLE_ABSTRACT_LENGTH_LIMIT}
              />
            </FormField>
            <FormField
              label={
                <Localized
                  id={root("info.codeLink")}
                  args={[Object.values(ACCEPTABLE_CODE_SITES).join(", ")]}
                />
              }
              validate={codeLinkValidation}
              name="codeLink"
              value={info.codeLink}
              disabled={disabled}
              maxLength={100}
              onChange={(e) => updateInfo({ codeLink: e.target.value })}
            />
            <FormField
              label={
                <Localized id={root("info.doi")} />
              }
              name="doi"
              value={info.doi}
              disabled={disabled}
              onChange={(e) => updateInfo({ doi: e.target.value })}
            />
            <FormField
              name="promise"
              validate={(value: boolean) => {
                if (!value) {
                  return {
                    message: <FormFieldMessage id={root("info.promiseRequired")} />,
                    status: "error",
                  };
                }
              }}
              contentProps={{ border: undefined, pad: { vertical: "small" } }}
            >
              <CheckBox
                name="promise"
                label={<Localized id={root("info.promise")} />}
                checked={info.promise}
                onChange={(e) => updateInfo({ promise: e.target.checked })}
              />
            </FormField>
            <Box direction="row" justify="between" margin={{ top: "medium" }}>
              <Button
                type="reset"
                label={<Localized id={root("info.reset")} />}
                disabled={disabled}
              />
              <Button
                type="submit"
                label={<Localized id={root("info.upload")} />}
                primary
                disabled={disabled}
              />
            </Box>
          </Box>
        </Box>
      </Form>
      <Modal
        open={showConfirm}
        title={<Localized id={root("info.confirm.title")} />}
        footer={[
          <Button
            key="confirm"
            primary
            label={<Localized id={root("info.confirm.confirm")} />}
            onClick={submit}
            disabled={disabled}
          />,
          <Button
            key="cancel"
            label={<Localized id={root("info.confirm.cancel")} />}
            onClick={() => setShowConfirm(false)}
            disabled={disabled}
          />,
        ]}
      >
        <Localized id={root("info.confirm.description")} />
      </Modal>
    </Box>
  );
};
