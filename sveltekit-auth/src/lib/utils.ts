export function transformSearchParams(searchParams: URLSearchParams): {
  [key: string]: string | string[] | undefined;
} {
  const params = {};
  for (const [key, value] of searchParams.entries()) {
    Object.assign(params, { [key]: value });
  }

  return params;
}
