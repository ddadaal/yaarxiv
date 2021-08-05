import {
  Anchor, Box, Button, FormField,
  Heading, Paragraph, TextArea,
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
  TITLE_MAX_LENGTH,
} from "yaarxiv-api/api/article/models";
import { DownloadPdfLink } from "./DownloadPdfLink";
import { PDF_SIZE_LIMIT_MB } from "yaarxiv-api/api/article/uploadPDF";
import { ARTICLE_ABSTRACT_LENGTH_LIMIT } from "yaarxiv-api/api/article/upload";
import { FormFieldMessage } from "src/components/form/FormFieldMessage";

const root = prefix("pages.upload.");

type ArticleFormInternal = {
  authors: string[];
  abstract: string;
  codeLink: string;
  cnTitle: string;
  enTitle: string;
  cnKeywords: string[];
  enKeywords: string[];
  file: File | undefined;
};

export type ArticleForm = {
  authors: string[];
  abstract: string;
  codeLink?: string;
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
  }), [initial]);

  const [info, setInfo] = useState<ArticleFormInternal>(initialInternal);

  const updateInfo = (newInfo: Partial<ArticleFormInternal>) =>
    setInfo({ ...info, ...newInfo });

  const pdfSizeLimit = PDF_SIZE_LIMIT_MB;

  return (
    <Box gap="large">
      <Form
        disableEnterToSubmit
        onReset={() => setInfo(initialInternal)}
        value={info}
        onSubmit={() => {
          onSubmit(info.file, {
            abstract: info.abstract,
            authors: info.authors,
            codeLink: info.codeLink || undefined,
            cnKeywords: info.cnKeywords.length === 0 ? undefined : info.cnKeywords,
            enKeywords: info.enKeywords.length === 0 ? undefined : info.enKeywords,
            cnTitle: info.cnTitle || undefined,
            enTitle: info.enTitle || undefined,
          });
        }}
        validate="change"
      >
        <Box>
          <Heading level="2" size="small" margin="none">
            <Localized id={root("pdf.title")}/>
          </Heading>
          <Paragraph fill>
            <Localized
              id={root("pdf.description")}
              args={[pdfSizeLimit]}
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
                accept: ".pdf",
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
              label={<Localized id={root("info.authors")} args={[50]} />}
              name="authors"
              validate={(authors: string[]) => {
                if (authors.length === 0) {
                  return <FormFieldMessage id={root("info.authorsRequired")} />;
                }
              }}
            >
              <TagInput
                name="authorss"
                value={info.authors}
                disabled={disabled}
                onAdd={(val) => updateInfo({ authors: info.authors.concat(val) })}
                onRemove={(val) => setInfo({
                  ...info,
                  authors: info.authors.filter((x) => x !== val),
                })}
                maxLength={50}
              />
            </FormField>
            <FormField
              label={(
                <Localized
                  id={root("info.abstract")}
                  args={[ARTICLE_ABSTRACT_LENGTH_LIMIT]}
                />
              )}
              name="abstract"
              required
            >
              <TextArea
                disabled={disabled}
                name="abstract"
                value={info.abstract}
                onChange={(e) => updateInfo({ abstract: e.target.value })}
                maxLength={2000}
                rows={15}
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
    </Box>
  );
};
