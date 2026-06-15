export type PageUrlProps<
  TParams extends Record<string, string> = Record<string, string>,
  TSearch extends Record<string, string | undefined> = Record<string, string | undefined>,
> = {
  params: Promise<TParams>;
  searchParams: Promise<TSearch>;
};
