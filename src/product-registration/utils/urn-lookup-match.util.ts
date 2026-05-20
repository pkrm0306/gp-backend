/** Mongo `$expr` match for URN lookups (ignores trailing slashes / whitespace). */
export function urnLookupMatchExpr(): Record<string, unknown> {
  return {
    $eq: [
      {
        $rtrim: {
          input: { $trim: { input: { $toString: '$urnNo' } } },
          chars: '/',
        },
      },
      {
        $rtrim: {
          input: { $trim: { input: { $toString: '$$urnNo' } } },
          chars: '/',
        },
      },
    ],
  };
}
