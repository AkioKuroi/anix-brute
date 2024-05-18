import StatusCategory from "./status";

export default interface Release {
  "@id": number;
  id: number;
  poster: string;
  image: string;
  year: string;
  genres: string;
  country: string;
  director: string;
  author: string;
  translators: string | null;
  studio: string;
  description: string;
  note: string | null;
  related: null;
  category: StatusCategory;
  rating: number;
  grade: number;
  status: StatusCategory;
  duration: number;
  season: number;
}
