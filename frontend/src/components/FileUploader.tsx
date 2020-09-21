/* eslint-disable max-len */
import { Box, Paragraph, Text, Anchor } from "grommet";
import React, { useCallback } from "react";
import { DropzoneOptions, FileRejection, useDropzone } from "react-dropzone";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { Clear } from "grommet-icons";
import { toast } from "react-toastify";
const root = lang.components.fileUploader;

interface Props {
  options?: DropzoneOptions;
  files: File[];
  onFileRemoved?: (file: File) => void;
  onFilesAccepted?: (files: File[]) => void;
}

export const FileUploader: React.FC<Props> = ({ options, files, onFileRemoved, onFilesAccepted }) => {

  const onRejected = useCallback((rej: FileRejection[]) => {
    rej.forEach(({ errors, file }) => {
      errors.forEach((e) => {
        toast.error(
          <Text>
            {file.name}: {" "}
            <LocalizedString id={root[e.code]} />
          </Text>
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
        <Paragraph><LocalizedString id={root.zoneLabel} /></Paragraph>
      </Box>
      {files.map((val, i) => (
        <Box direction="row" key={i} justify="between">
          <Text>{val.name}</Text>
          <Anchor onClick={() => {
            onFileRemoved?.(val);
          }}
          >
            <Clear size="small" />
          </Anchor>
        </Box>
      ))}
    </Box>
  );
};
