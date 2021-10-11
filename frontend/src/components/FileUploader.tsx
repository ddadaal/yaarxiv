/* eslint-disable max-len */
import { Box, Paragraph, Text, Anchor } from "grommet";
import React, { useCallback } from "react";
import { DropzoneOptions, FileRejection, useDropzone } from "react-dropzone";
import { Localized, useI18n } from "src/i18n";
import { prefix } from "src/i18n";
import { Trash } from "grommet-icons";
import { toast } from "react-toastify";

const root = prefix("components.fileUploader.");

interface Props {
  options?: DropzoneOptions;
  files: File[];
  onFileRemoved?: (file: File) => void;
  onFilesAccepted?: (files: File[]) => void;
}

const RemoveFileLink: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const i18n = useI18n();

  return (
    <Anchor onClick={onClick} title={i18n.translate(root("removeFileLinkTitle")) as string}>
      <Trash size="16px" />
    </Anchor>
  );

};

export const FileUploader: React.FC<Props> = ({ options, files, onFileRemoved, onFilesAccepted }) => {

  const onRejected = useCallback((rej: FileRejection[]) => {
    rej.forEach(({ errors, file }) => {
      errors.forEach((e) => {
        toast.error(
          <Text>
            {file.name}: {" "}
            <Localized id={root[e.code]} />
          </Text>,
        );
      });
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    ...options,
    onDrop: onFilesAccepted,
    onDropRejected: onRejected,
  });

  return (
    <Box gap="small">
      <Box {...getRootProps()} border={{ style: "dotted" }} align="center">
        <input {...getInputProps()} />
        <Paragraph><Localized id={root("zoneLabel")} /></Paragraph>
      </Box>
      {files.map((val, i) => (
        <Box direction="row" key={i} gap="small">
          <Text>{val.name}</Text>
          <RemoveFileLink onClick={() => {
            onFileRemoved?.(val);
          }}
          />
        </Box>
      ))}
    </Box>
  );
};
