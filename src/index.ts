import 'isomorphic-unfetch';
import { DocumentContext } from 'next/document';

export const getCanonicalHost = async (
  vercelUrl: string,
  apiToken: string
): Promise<string> => {
  if (!apiToken) throw new Error('No Vercel API token provided!');

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
    // eslint-disable-next-line no-console
    console.info('deployment info', deployInfo);
    const [firstAlias] = deployInfo?.alias || [];
    if (firstAlias) return firstAlias;
  } else {
    // eslint-disable-next-line no-console
    console.warn(
      `Problem fetching deployment info for url ${vercelUrl}: ` +
        `API returned HTTP ${res.status} ${res.statusText}`
    );
  }

  // we couldn't find an alias, just use the given Vercel URL
  return vercelUrl;
};

export const getBaseUrl = (
  canonicalHost: string,
  useHttps?: boolean
): string => {
  const protocol = useHttps ? 'https://' : 'http://';
  return `${protocol}${canonicalHost}`;
};

export const getCanonicalUrl = async (
  baseUrl: string,
  apiToken: string,
  useHttps?: boolean
): Promise<string> => {
  const canonicalHost = await getCanonicalHost(baseUrl, apiToken);
  return getBaseUrl(canonicalHost, useHttps);
};

export const redirectToCanonicalUrl = async (
  ctx: DocumentContext,
  vercelUrl?: string,
  apiToken?: string,
  useHttps?: boolean
): Promise<void> => {
  // only attempt to redirect to canonical URL if we have
  // a Vercel URL, a Vercel API token and we're server-side
  if (vercelUrl && apiToken && ctx.req) {
    const currentHost = ctx.req.headers.host;
    const canonicalHost = await getCanonicalHost(vercelUrl, apiToken);
    if (currentHost !== canonicalHost) {
      // we're not on the canonical url, redirect
      const destUrl = `${getBaseUrl(canonicalHost, useHttps)}${ctx.req.url}`;
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
