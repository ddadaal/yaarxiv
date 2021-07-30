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
  getCodeLinkInfo,
} from "src/utils/validations/codeLink";
import { ArticleId, ArticleInfoMultiLangPart, TITLE_MAX_LENGTH } from "yaarxiv-api/api/article/models";
import { DownloadPdfLink } from "./DownloadPdfLink";
import { PDF_SIZE_LIMIT_MB } from "yaarxiv-api/api/article/uploadPDF";
import { ARTICLE_ABSTRACT_LENGTH_LIMIT } from "yaarxiv-api/api/article/upload";
import { removeNullOrUndefinedKey } from "src/utils/array";

const root = prefix("pages.upload.");

type ArticleFormInternal = {
  authors: string[];
  abstract: string;
  codeLink: string;
  cnTitle: string;
  enTitle: string;
  cnKeywords: string[];
  enKeywords: string[];
};

export type ArticleForm = {
  authors: string[];
  abstract: string;
  codeLink: string | undefined;
} & ArticleInfoMultiLangPart;

interface Props {
  articleId: ArticleId | undefined;
  initial: ArticleForm;
  disabled: boolean;
  onSubmit: (file: File | undefined, form: ArticleForm) => void;
}

function filled(title: string, keywords: string[]) {
  return title !== "" && keywords.length > 0;
}

function notFilled(title: string, keywords: string[]) {
  return title === "" && keywords.length === 0;
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
    cnKeywords: "cnKeywords" in initial ? initial.cnKeywords : [],
    cnTitle: "cnTitle" in initial ? initial.cnTitle : "",
    enKeywords: "enKeywords" in initial ? initial.enKeywords : [],
    enTitle: "enTitle" in initial ? initial.enTitle : "",
  }), [initial]);

  const [file, setFile] = useState<File | undefined>(undefined);
  const [info, setInfo] = useState<ArticleFormInternal>(initialInternal);

  const cnFilled = filled(info.cnTitle, info.cnKeywords);
  const enFilled = filled(info.enTitle, info.enKeywords);
  const cnNotFilled = notFilled(info.cnTitle, info.cnKeywords);
  const enNotFilled = notFilled(info.enTitle, info.enKeywords);

  const submittable =
    (articleId !== undefined || file !== undefined)
    && (
      (
        cnFilled && (enFilled || enNotFilled)
      ) || (
        enFilled && (cnNotFilled)
      )
    )
    && info.authors.length > 0
    && (!info.codeLink || getCodeLinkInfo(info.codeLink) !== undefined)
    && info.abstract !== "";

  const pdfSizeLimit = PDF_SIZE_LIMIT_MB;

  return (
    <Box gap="large">
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
        <FileUploader
          options={{
            accept: ".pdf",
            multiple: false,
            maxSize: pdfSizeLimit * 1024 * 1024,
          }}
          files={file ? [file] : []}
          onFileRemoved={() => setFile(undefined)}
          onFilesAccepted={(f) => setFile(f[0])}
        />
      </Box>
      <Box>
        <Heading level="2" size="small" margin="none">
          <Localized id={root("info.title")} />
        </Heading>
        <Box align="center" pad="medium">
          <Localized id={root("info.prompt")} />
        </Box>
        <Box margin={{ vertical: "small" }}>
          <Form
            disableEnterToSubmit
            onReset={() => setInfo(initialInternal)}
            value={info}
            onSubmit={() => {
              onSubmit(file, removeNullOrUndefinedKey({
                abstract: info.abstract,
                authors: info.authors,
                codeLink: info.codeLink || undefined,
                cnKeywords: info.cnKeywords.length === 0 ? undefined : info.cnKeywords,
                enKeywords: info.enKeywords.length === 0 ? undefined : info.enKeywords,
                cnTitle: info.cnTitle || undefined,
                enTitle: info.enTitle || undefined,
              }) as any);
            }}
            validate="blur"
          >
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
              onChange={(e) => setInfo({ ...info, cnTitle: e.target.value })}
            />
            <FormField
              label={<Localized id={root("info.keywordsCn")} args={[50]} />}
              name="cnKeywords"
            >
              <TagInput
                disabled={disabled}
                name="cnKeywords"
                value={info.cnKeywords || []}
                maxLength={50}
                onAdd={(v) => setInfo({
                  ...info,
                  cnKeywords: info.cnKeywords.concat(v),
                })}
                onRemove={(val) => setInfo({
                  ...info,
                  cnKeywords: info.cnKeywords.filter((x) => x !== val),
                })}
                commaToSplit={true}
              />
            </FormField>
            <FormField
              label={<Localized id={root("info.articleTitleEn")} args={[100]} />}
              name="enTitle"
              value={info.enTitle}
              disabled={disabled}
              maxLength={100}
              onChange={(e) => setInfo({ ...info, enTitle: e.target.value })}
            />
            <FormField
              label={<Localized id={root("info.keywordsEn")} args={[50]} />}
              name="enKeywords"
            >
              <TagInput
                disabled={disabled}
                name="enKeywords"
                value={info.enKeywords || []}
                maxLength={50}
                onAdd={(v) => setInfo({
                  ...info,
                  enKeywords: info.enKeywords.concat(v),
                })}
                onRemove={(val) => setInfo({
                  ...info,
                  enKeywords: info.enKeywords.filter((x) => x !== val),
                })}
                commaToSplit={true}
              />
            </FormField>
            <FormField
              label={<Localized id={root("info.authors")} args={[50]} />}
              name="authors"
              required
            >
              <TagInput
                name="authors"
                value={info.authors}
                disabled={disabled}
                onAdd={(val) => setInfo({ ...info, authors: info.authors.concat(val) })}
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
                onChange={(e) => setInfo({ ...info, abstract: e.target.value })}
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
              validate={(value) => !value || codeLinkValidation(value)}
              name="codeLink"
              value={info.codeLink}
              disabled={disabled}
              maxLength={100}
              onChange={(e) => setInfo({ ...info, codeLink: e.target.value })}
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
                disabled={!submittable || disabled}
              />
            </Box>
          </Form>
        </Box>
      </Box>
    </Box>
  );
};
