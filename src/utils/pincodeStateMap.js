// Approximate India PIN to state mapping via numeric ranges (6-digit). Source: India Post allocations (compressed for client-side use).
// This covers primary allocations; Army/APS ranges are grouped under "Army". Use direct state field on rows when available for accuracy.

export const PINCODE_STATE_RANGES = [
  { start: 110000, end: 110099, state: "Delhi" },
  { start: 120000, end: 129999, state: "Haryana" },
  { start: 130000, end: 139999, state: "Haryana" },
  { start: 140000, end: 159999, state: "Punjab" },
  { start: 160000, end: 169999, state: "Chandigarh" },
  { start: 170000, end: 179999, state: "Himachal Pradesh" },
  { start: 180000, end: 199999, state: "Jammu & Kashmir" },
  { start: 200000, end: 209999, state: "Uttar Pradesh" },
  { start: 210000, end: 229999, state: "Uttar Pradesh" },
  { start: 230000, end: 249999, state: "Uttar Pradesh" },
  { start: 250000, end: 269999, state: "Uttarakhand" },
  { start: 270000, end: 289999, state: "Maharashtra" },
  { start: 300000, end: 309999, state: "Gujarat" },
  { start: 310000, end: 329999, state: "Gujarat" },
  { start: 330000, end: 339999, state: "Gujarat" },
  { start: 340000, end: 349999, state: "Rajasthan" },
  { start: 350000, end: 369999, state: "Gujarat" },
  { start: 370000, end: 389999, state: "Gujarat" },
  { start: 390000, end: 399999, state: "Gujarat" },
  { start: 400000, end: 449999, state: "Maharashtra" },
  { start: 450000, end: 489999, state: "Madhya Pradesh" },
  { start: 490000, end: 499999, state: "Chhattisgarh" },
  { start: 500000, end: 509999, state: "Telangana" },
  { start: 510000, end: 519999, state: "Telangana" },
  { start: 520000, end: 529999, state: "Andhra Pradesh" },
  { start: 530000, end: 549999, state: "Andhra Pradesh" },
  { start: 550000, end: 559999, state: "Andhra Pradesh" },
  { start: 560000, end: 599999, state: "Karnataka" },
  { start: 600000, end: 629999, state: "Tamil Nadu" },
  { start: 630000, end: 669999, state: "Tamil Nadu" },
  { start: 670000, end: 699999, state: "Kerala" },
  { start: 700000, end: 749999, state: "West Bengal" },
  { start: 750000, end: 769999, state: "Odisha" },
  { start: 770000, end: 789999, state: "Odisha" },
  { start: 790000, end: 799999, state: "Assam" },
  { start: 800000, end: 809999, state: "Bihar" },
  { start: 810000, end: 819999, state: "Bihar" },
  { start: 820000, end: 829999, state: "Jharkhand" },
  { start: 830000, end: 839999, state: "Jharkhand" },
  { start: 840000, end: 849999, state: "Bihar" },
  { start: 850000, end: 859999, state: "Jharkhand" },
  { start: 860000, end: 869999, state: "Jharkhand" },
  { start: 870000, end: 879999, state: "Bihar" },
  { start: 880000, end: 889999, state: "Sikkim" },
  { start: 900000, end: 909999, state: "Army" },
  { start: 910000, end: 919999, state: "Army" },
  { start: 920000, end: 929999, state: "Army" },
  { start: 930000, end: 939999, state: "Army" },
  { start: 940000, end: 949999, state: "Army" },
  { start: 950000, end: 959999, state: "Army" },
  { start: 960000, end: 969999, state: "Army" },
  { start: 970000, end: 979999, state: "Army" },
  { start: 980000, end: 989999, state: "Army" },
  { start: 990000, end: 999999, state: "Army" }
];

export function findStateFromPincode(pinRaw) {
  const pin = String(pinRaw || "").trim();
  if (pin.length < 6) return null;
  const num = Number(pin.slice(0, 6));
  if (Number.isNaN(num)) return null;
  const match = PINCODE_STATE_RANGES.find(r => num >= r.start && num <= r.end);
  return match ? match.state : null;
}
