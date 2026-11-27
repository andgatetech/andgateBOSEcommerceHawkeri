export function normalizeBdPhone(value: string): string {
  return value.replace(/[০-৯]/g, (digit) => String("০১২৩৪৫৬৭৮৯".indexOf(digit)))
    .replace(/[\s()-]/g, "").replace(/^(?:\+?88)(01)/, "$1");
}
