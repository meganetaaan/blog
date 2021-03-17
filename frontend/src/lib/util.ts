export function getStrapiMedia(url: string | null | undefined, isClientSide = false): string {
  if (url == null) {
    return "";
  }

  // Return the full URL if the media is hosted on an external provider
  if (url.startsWith("http") || url.startsWith("//")) {
    return url;
  }

  if (isClientSide) {
    return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${url}`;
  }
  // Otherwise prepend the URL path with the Strapi URL
  return `${process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://backend:1337'}${url}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(Date.parse(dateStr));
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
}
