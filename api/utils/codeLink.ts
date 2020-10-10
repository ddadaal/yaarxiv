export const ACCEPTABLE_CODE_SITES = {
  "github.com": "GitHub",
  "gitlab.com": "GitLab",
  "gitee.com": "Gitee",
} as const;

interface CodeLink {
  hostname: string;
  siteName: typeof ACCEPTABLE_CODE_SITES[keyof typeof ACCEPTABLE_CODE_SITES];
  repo: string;
  url: string;
}

/**
 * Validate and extract info from code link.
 * Return undefined if the link is not valid.
 * @param link the code link
 */
export function getCodeLinkInfo(link: string): CodeLink | undefined {
  try {
    const url = new URL(link);
    // validate whether the siteName is accepted.
    const siteName = ACCEPTABLE_CODE_SITES[url.hostname];
    if (!siteName) { return undefined; }

    // validate whether the pathname is to a repo

    // IE's pathname does not start with /
    const repo = url.pathname.startsWith("/") ? url.pathname.substr(1) : url.pathname;

    // a repo's link should be link <user>/<reponame>
    const isRepoLink = repo.split("/").filter((x) => x.length > 0).length === 2;
    if (!isRepoLink) { return undefined; }

    return {
      hostname: url.hostname,
      siteName,
      repo,
      url: link,
    };
  } catch (e) {
    return undefined;
  }
}
