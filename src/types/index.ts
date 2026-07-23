export type MovieWithStats = {
  id: string;
  tmdbId: number;
  title: string;
  originalTitle: string;
  year: number | null;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  director: string | null;
  cast: string[];
  genres: string[];
  runtime: number | null;
  trailerKey: string | null;
  averageScore: number;
  ratingsCount: number;
  myRating: RatingDTO | null;
};

export type RatingDTO = {
  id: string;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
};
