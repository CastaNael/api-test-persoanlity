export type Question = {
  id: string;
  text: string;
  options: { id: string; label: string; trait: string }[];
};
