import { Choice } from '../types/Image.types';

export const generateScoreText = (choices: Choice[], day: number): string => {
  return buildHeader(day) + '\n' + buildEmoji(choices);
};

export const generateScoreHTML = (choices: Choice[], day: number) => {
  return (
    <div>
      <p>{buildHeader(day)}</p>
      <p>{buildEmoji(choices)}</p>
    </div>
  );
};

const buildHeader = (day: number) => {
  return 'Imaginate #' + day;
};

const buildEmoji = (choices: Choice[]) => {
  let emojiScoreText = choices
    .map((choice) => (choice.isCorrect ? '🟩' : '🟥'))
    .join('');
  if (choices.every((choice) => choice.isCorrect)) {
    emojiScoreText += '✨';
  }
  return emojiScoreText;
};
