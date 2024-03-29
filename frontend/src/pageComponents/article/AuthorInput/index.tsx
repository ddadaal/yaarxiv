import React, { useState } from "react";

import { Anchor, Box } from "grommet";
import { Author } from "yaarxiv-api/api/article/models";
import { Tag } from "src/components/TagInput/Tag";
import { Add } from "grommet-icons";
import { AuthorInfoModal } from "src/pageComponents/article/AuthorInput/AuthorInfoModal";
import { Localized } from "react-typed-i18n";
import { prefix } from "src/i18n";

interface Props {
  value: Author[];
  onAdd: (author: Author) => void;
  onRemove: (author: Author) => void;
  disabled?: boolean;
}

const root = prefix("pages.upload.");

export const AuthorInput: React.FC<Props> = ({
  value = [],
  onAdd,
  onRemove,
  disabled = false,
}) => {

  const [show, setShow] = useState(false);

  return (
    <Box
      direction="row"
      align="center"
      pad={{ vertical: "xsmall" }}
      wrap
    >
      {
        value.map((v, index) => (
          <Tag
            disabled={disabled}
            key={`${v}${index + 0}`}
            onRemove={() => onRemove(v)}
          >
            {v.name} ({v.affiliation}) {v.correspondingAuthor ? "*" : undefined}
          </Tag>
        ))
      }
      {
        disabled ? undefined: (
          <>
            <Anchor onClick={() => setShow(true)} icon={<Add />} label={
              <Localized id={root("info.authors.add")} />
            }
            />
            <AuthorInfoModal
              open={show}
              onCancel={() => setShow(false)}
              onSubmit={(a) => {
                onAdd(a);
                setShow(false);
              }}
            />
          </>
        )
      }
    </Box>
  );
};
