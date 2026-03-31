export const ARTEMIS_PRICING = {
  creationFeeCents: 4900,
  firstMonthCents: 2900,
  minimumBucketTopupCents: 2000,
} as const;

export function calculateArtemisCheckoutTotal(initialBucketTopupCents: number) {
  const bucketTopup = Math.max(
    initialBucketTopupCents,
    ARTEMIS_PRICING.minimumBucketTopupCents,
  );

  return {
    creationFeeCents: ARTEMIS_PRICING.creationFeeCents,
    firstMonthCents: ARTEMIS_PRICING.firstMonthCents,
    initialBucketTopupCents: bucketTopup,
    totalCents:
      ARTEMIS_PRICING.creationFeeCents +
      ARTEMIS_PRICING.firstMonthCents +
      bucketTopup,
  };
}
