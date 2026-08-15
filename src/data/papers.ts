// Past ICSE Computer Applications papers.
// pdfUrl is "#" for every entry since the actual PDF files haven't been added yet (per APP_PLAN.md).
// To activate a real paper later: drop the PDF into /public/papers/ and update pdfUrl to match,
// e.g. pdfUrl: "/papers/icse-2023.pdf"
//
// Year list verified against KnowledgeBoat's solved-papers index (2026-08-15).
// 2020 and 2021 are deliberately EXCLUDED - no standard papers exist for those years
// (COVID-era disruption to the board exam format). 2022 used a special two-semester
// format that year, noted below.

export type Paper = {
  id: string;
  year: number;
  difficulty: "Easy" | "Medium" | "Hard";
  pdfUrl: string;
  note?: string; // optional callout for anything unusual about that year's paper
};

export const PAPERS: Paper[] = [
  { id: "icse-2026", year: 2026, difficulty: "Medium", pdfUrl: "#" },
  { id: "icse-2025", year: 2025, difficulty: "Medium", pdfUrl: "#" },
  { id: "icse-2024", year: 2024, difficulty: "Medium", pdfUrl: "#" },
  { id: "icse-2023", year: 2023, difficulty: "Medium", pdfUrl: "#" },
  {
    id: "icse-2022",
    year: 2022,
    difficulty: "Hard",
    pdfUrl: "#",
    note: "This year used a special two-semester exam format, not the standard single paper.",
  },
  { id: "icse-2019", year: 2019, difficulty: "Easy", pdfUrl: "#" },
  { id: "icse-2018", year: 2018, difficulty: "Medium", pdfUrl: "#" },
];
