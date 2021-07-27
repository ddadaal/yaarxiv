import {
  Anchor, Box, Button, FormField,
  Heading, Paragraph, TextArea,
} from "grommet";
import React, { useState } from "react";
import { Localized, prefix } from "src/i18n";
import { FileUploader } from "src/components/FileUploader";
import { Form } from "src/components/form/Form";
import { TagInput } from "src/components/TagInput";
import {
  codeLinkValidation,
  ACCEPTABLE_CODE_SITES,
  getCodeLinkInfo,
} from "src/utils/validations/codeLink";
import { ArticleId } from "yaarxiv-api/api/article/models";
import { DownloadPdfLink } from "./DownloadPdfLink";
import { PDF_SIZE_LIMIT_MB } from "yaarxiv-api/api/article/uploadPDF";

const root = prefix("pages.upload.");

export interface ArticleForm {
  title: string;
  authors: string[];
  keywords: string[];
  abstract: string;
  codeLink?: string;
}

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

  const [file, setFile] = useState<File | undefined>(undefined);
  const [info, setInfo] = useState(initial);

  const submittable =
    (articleId !== undefined || file !== undefined)
    && info.title !== ""
    && info.authors.length > 0
    && info.keywords.length > 0
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
        <Box margin={{ vertical: "small" }}>
          <Form
            onKeyPress={(e) => {
              if (e.key === "Enter") { e.preventDefault(); }
            }}
            onReset={() => setInfo(initial)}
            value={info}
            onSubmit={() => {
              // if code link is "", make it undefined.
              if (!info.codeLink) {
                info.codeLink = undefined;
              }
              onSubmit(file, info);
            }}
            validate="blur"
          >
            <FormField
              label={<Localized id={root("info.articleTitle")} args={[100]} />}
              name="title"
              value={info.title}
              disabled={disabled}
              maxLength={100}
              onChange={(e) => setInfo({ ...info, title: e.target.value })}
              required
            />

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
              label={<Localized id={root("info.keywords")} args={[50]} />}
              name="keywords"
              required
            >
              <TagInput
                disabled={disabled}
                name="keywords"
                value={info.keywords}
                maxLength={50}
                onAdd={(val) => setInfo({ ...info, keywords: info.keywords.concat(val) })}
                onRemove={(val) => setInfo({
                  ...info,
                  keywords: info.keywords.filter((x) => x !== val),
                })}
                commaToSplit={true}
              />
            </FormField>
            <FormField
              label={<Localized id={root("info.abstract")} args={[2000]} />}
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
