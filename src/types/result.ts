export interface SummaryItem {
  trait: string;
  score: number;
  description: string;
}

export interface TestResult {
  traits: Record<string, number>;
  summary: SummaryItem[];
}
