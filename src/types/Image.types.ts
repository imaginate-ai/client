export type Image = {
  data: string;
  date: string;
  filename: string;
  real: boolean;
  status: 'verified';
  theme: string;
  url: string;
};

export type Choice = {
  isCorrect: boolean;
  image: Image;
};
