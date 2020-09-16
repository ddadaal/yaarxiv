/* eslint-disable max-len */
import { Box, Paragraph, Text, Anchor } from "grommet";
import React from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { Clear } from "grommet-icons";

const root = lang.components.fileUploader;

interface Props {
  options?: DropzoneOptions;
  files: File[];
  onFileRemoved?: (file: File) => void;
  onFilesAccepted?: (files: File[]) => void;
}

export const FileUploader: React.FC<Props> = ({ options, files, onFileRemoved, onFilesAccepted }) => {
  const { getRootProps, getInputProps } = useDropzone({ ...options, onDrop: onFilesAccepted });

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
