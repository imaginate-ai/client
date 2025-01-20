import { Choice } from '../types/Image.types';

export const getLastChoiceKeeper = (): Array<Choice> => {
  const storedLastChoiceKeeper = localStorage.getItem('last_choice_keeper');
  if (!storedLastChoiceKeeper) {
    return [];
  }
  return JSON.parse(storedLastChoiceKeeper);
};
