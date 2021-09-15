import { Anchor } from "grommet";
import React, {  } from "react";
import { getFullUrl } from "src/apis/fetch";
import { ArticleId, ScriptFormat } from "yaarxiv-api/api/article/models";

import * as getArticleScript from "yaarxiv-api/api/article/getScript";
import { useStore } from "simstate";
import { UserStore } from "src/stores/UserStore";

interface Props {
  articleId: ArticleId;
  revision: number;
  format: ScriptFormat;
}

// require children to have only one child and accepts onClick
export const DownloadPdfLink: React.FC<Props> = ({
  articleId, revision, format,
  children,
}) => {

  const userStore = useStore(UserStore);

  const token = userStore.user?.token;

  return (
    <Anchor
      href={getFullUrl(getArticleScript.endpoint.url, { articleId }, { revision, token })}
      download={`yaarxiv-${articleId}-rev-${revision}.${format}`}
    >
      {children}
    </Anchor>
  );

};
