import 'isomorphic-unfetch';
import { DocumentContext } from 'next/document';

export const getCanonicalHost = async (
  vercelUrl: string,
  apiToken: string
): Promise<string> => {
  // fetch deployment info
  const res = await fetch(
    `https://api.vercel.com/v11/now/deployments/get?url=${vercelUrl}`,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    }
  );
  if (res.ok) {
    const deployInfo = await res.json();
    const [firstAlias] = deployInfo?.alias || [];
    if (firstAlias) return firstAlias;
  }
  // we couldn't find an alias, just use CURRENT_URL
  return vercelUrl;
};

export const getBaseUrl = (
  canonicalHost: string,
  useHttps?: boolean
): string => {
  const protocol = useHttps ? 'https://' : 'http://';
  return `${protocol}${canonicalHost}`;
};

export const redirectToCanonicalUrl = async (
  ctx: DocumentContext,
  vercelUrl: string,
  apiToken: string
): Promise<void> => {
  if (ctx.req) {
    // we are server-side
    const currentHost = ctx.req.headers.host;
    const canonicalHost = await getCanonicalHost(vercelUrl, apiToken);
    if (currentHost !== canonicalHost) {
      // we're not on the canonical url, redirect
      const destUrl = `${getBaseUrl(canonicalHost)}${ctx.req.url}`;
      // eslint-disable-next-line no-console
      console.warn(
        `Not at canonical url (${currentHost}), redirecting to ${destUrl}`
      );
      ctx.res.writeHead(302, {
        Location: destUrl,
      });
      ctx.res.end();
    }
  }
};
