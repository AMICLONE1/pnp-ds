export const DISCOMS_BY_STATE: Record<string, string[]> = {
  Maharashtra: ["MSEDCL", "Tata Power", "Adani Electricity"],
  Karnataka: ["BESCOM", "MESCOM", "HESCOM", "GESCOM", "CESCOM"],
  "Tamil Nadu": ["TANGEDCO"],
  Gujarat: ["GUVNL", "DGVCL", "MGVCL", "PGVCL", "UGVCL"],
  Rajasthan: ["RVPN", "JVVNL", "AVVNL", "JVVNL"],
  Delhi: ["BSES", "Tata Power DDL", "NDPL"],
  "Uttar Pradesh": ["UPPCL"],
  "West Bengal": ["WBSEDCL"],
  Punjab: ["PSPCL"],
  Haryana: ["DHBVN", "UHBVN"],
};

export const STATES = Object.keys(DISCOMS_BY_STATE);

