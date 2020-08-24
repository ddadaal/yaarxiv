import { Box, Button, Form, FormField, Heading, Paragraph, TextArea } from "grommet";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { LocalizedString } from "simstate-i18n";
import { getApi } from "src/apis";
import { articleApis } from "src/apis/article";
import { FileUploader } from "src/components/FileUploader";
import { TagInput } from "src/components/TagInput";
import { useNotification } from "src/components/useNotification";
import { lang } from "src/i18n";

const root = lang.pages.upload;

const initialState ={
  title: "",
  authors: [] as string[],
  keywords: [] as string[],
  abstract: "",
};

const api = getApi(articleApis);

export const UploadPage: React.FC = (props) => {

  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [info, setInfo] = useState(initialState);

  const [submitting, setSubmitting] = useState(false);

  const notification = useNotification();

  const submit = async () => {
    try {

      setSubmitting(true);
      // 1. upload the PDF and get the token

      const formData = new FormData();
      formData.set("file", file!);

      const pdfResp = await api.uploadPDF(
        { body: formData }, { bodyStringify: false });

      // 2. upload the rest information
      const resp = await api.uploadArticle({
        body: {
          pdfToken: pdfResp.token,
          ...info,
        },
      });

      // 3. Route to complete page
      router.push({ pathname: "/upload/complete", query: { articleId: resp.id } });
    } catch (e) {
      notification.addNotification({
        level: "error",
        message: "Some network error is detected. Please retry.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const submittable = file !== null
  && info.title !== ""
  && info.authors.length > 0
  && info.keywords.length > 0
  && info.abstract !== "";

  return (
    <Box gap="large">
      <Box pad="small">
        <Heading level="2" size="small" margin="none">
          <LocalizedString id={root.pdf.title}/>
        </Heading>
        <Paragraph fill>
          <LocalizedString id={root.pdf.description} />
        </Paragraph>
        <FileUploader
          options={{ accept: ".pdf", multiple: false }}
          files={file ? [file] : []}
          onFileRemoved={() => setFile(null)}
          onFilesAccepted={(f) => setFile(f[0])}
        />
      </Box>
      <Box>
        <Heading level="2" size="small" margin="none">
          <LocalizedString id={root.info.title} />
        </Heading>
        <Box margin={{ vertical: "small" }}>
          <Form
            onReset={() => setInfo(initialState)}
            value={info}
            onSubmit={submit}
          >
            <FormField
              label={<LocalizedString id={root.info.articleTitle} />}
              name="title"
              value={info.title}
              disabled={submitting}
              onChange={(e) => setInfo({ ...info, title: e.target.value })}
            />
            <FormField label={<LocalizedString id={root.info.authors} />} name="authors">
              <TagInput
                name="authors"
                value={info.authors}
                disabled={submitting}
                onAdd={(val) => setInfo({ ...info, authors: [...info.authors, val]})}
                onRemove={(val) => setInfo({
                  ...info,
                  authors: info.authors.filter((x) => x !== val),
                })}
              />
            </FormField>
            <FormField
              label={<LocalizedString id={root.info.keywords} />}
              name="keywords"
            >
              <TagInput
                disabled={submitting}
                name="keywords"
                value={info.keywords}
                onAdd={(val) => setInfo({ ...info, keywords: [...info.keywords, val]})}
                onRemove={(val) => setInfo({
                  ...info,
                  keywords: info.keywords.filter((x) => x !== val),
                })}
              />
            </FormField>
            <FormField
              label={<LocalizedString id={root.info.abstract} />}
              htmlFor="text-area"
              component={TextArea}
              value={info.abstract}
              disabled={submitting}
              onChange={(e) => setInfo({ ...info, abstract: e.target.value })}
            />
            <Box direction="row" justify="between" margin={{ top: "medium" }}>
              <Button
                type="reset"
                label={<LocalizedString id={root.info.reset} />}
                disabled={submitting}
              />
              <Button
                type="submit"
                label={<LocalizedString id={root.info.upload} />}
                primary
                disabled={!submittable || submitting}
              />
            </Box>
          </Form>
        </Box>
      </Box>
    </Box>
  );
};

export default UploadPage;
