import {
  Anchor, Box, Button, FormField,
  Heading, Paragraph, TextArea,
} from "grommet";
import React, { useState } from "react";
import { LocalizedString } from "simstate-i18n";
import { FileUploader } from "src/components/FileUploader";
import { Form } from "src/components/form/Form";
import { TagInput } from "src/components/TagInput";
import { lang } from "src/i18n";
import {
  codeLinkValidation,
  ACCEPTABLE_CODE_SITES,
  getCodeLinkInfo,
} from "src/utils/validations/codeLink";
import { config } from "src/utils/config";
import { getServerStaticFileUrl } from "src/utils/staticFiles";

const root = lang.pages.upload;

export interface ArticleForm {
  title: string;
  authors: string[];
  keywords: string[];
  abstract: string;
  codeLink?: string;
}

interface Props {
  existingFileUrl: string | undefined;
  initial: ArticleForm;
  disabled: boolean;
  onSubmit: (file: File | undefined, form: ArticleForm) => void;
}

export const ArticleEditForm: React.FC<Props> = ({
  existingFileUrl,
  initial,
  disabled,
  onSubmit,
}) => {

  const [file, setFile] = useState<File | undefined>(undefined);
  const [info, setInfo] = useState(initial);

  const submittable =
    (existingFileUrl !== undefined || file !== undefined)
    && info.title !== ""
    && info.authors.length > 0
    && info.keywords.length > 0
    && (!info.codeLink || getCodeLinkInfo(info.codeLink) !== undefined)
    && info.abstract !== "";

  const pdfSizeLimit = config.pdfSizeLimit;

  return (
    <Box gap="large">
      <Box>
        <Heading level="2" size="small" margin="none">
          <LocalizedString id={root.pdf.title}/>
        </Heading>
        <Paragraph fill>
          <LocalizedString
            id={root.pdf.description}
            replacements={[pdfSizeLimit / 1024 / 1024]}
          />
        </Paragraph>
        { existingFileUrl
          ? (
            <Paragraph>
              <LocalizedString id={root.pdf.existing} replacements={[
                <Anchor
                  key="here"
                  href={getServerStaticFileUrl(existingFileUrl)}
                  download
                >
                  <LocalizedString id={root.pdf.here} />
                </Anchor>,
              ]}
              />
            </Paragraph>
          ) : undefined
        }
        <FileUploader
          options={{ accept: ".pdf", multiple: false, maxSize: pdfSizeLimit }}
          files={file ? [file] : []}
          onFileRemoved={() => setFile(undefined)}
          onFilesAccepted={(f) => setFile(f[0])}
        />
      </Box>
      <Box>
        <Heading level="2" size="small" margin="none">
          <LocalizedString id={root.info.title} />
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
              label={<LocalizedString id={root.info.articleTitle} replacements={[100]} />}
              name="title"
              value={info.title}
              disabled={disabled}
              maxLength={100}
              onChange={(e) => setInfo({ ...info, title: e.target.value })}
              required
            />

            <FormField
              label={<LocalizedString id={root.info.authors} replacements={[50]} />}
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
              label={<LocalizedString id={root.info.keywords} replacements={[50]} />}
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
              label={<LocalizedString id={root.info.abstract} replacements={[2000]} />}
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
                <LocalizedString
                  id={root.info.codeLink}
                  replacements={[Object.values(ACCEPTABLE_CODE_SITES).join(", ")]}
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
                label={<LocalizedString id={root.info.reset} />}
                disabled={disabled}
              />
              <Button
                type="submit"
                label={<LocalizedString id={root.info.upload} />}
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
