import { Anchor } from "grommet";
import React from "react";
import { getFullUrl } from "src/apis/fetch";
import { ArticleId, ScriptFormat } from "yaarxiv-api/api/article/models";

import * as getArticleScript from "yaarxiv-api/api/article/getScript";
import { api } from "src/apis";

interface Props {
  articleId: ArticleId;
  revision: number;
  format: ScriptFormat;
}

// require children to have only one child and accepts onClick
export const DownloadScriptLink: React.FC<Props> = ({
  articleId, revision, format,
  children,
}) => {

  const onClick = async () => {
    const resp = await api.article.getArticleScriptDownloadToken({ path: { articleId } });

    const anchor = document.createElement("a");
    anchor.href = getFullUrl(
      getArticleScript.endpoint.url, { articleId }, { revision, token: resp.token });
    anchor.download = `yaarxiv-${articleId}-rev-${revision}.${format}`;
    anchor.target = "_blank";

    anchor.click();
  };

  return (
    <Anchor
      onClick={onClick}
      // eslint-disable-next-line max-len
      // href={getFullUrl(getArticleScript.endpoint.url, { articleId }, { revision, token })}
      // download={`yaarxiv-${articleId}-rev-${revision}.${format}`}
    >
      {children}
    </Anchor>
  );

};
