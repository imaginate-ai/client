import { Choice } from '../types/Image.types';

export const generateScoreText = (choices: Choice[], day: number): string => {
  const header = buildHeader(day);
  const emojiText = buildEmoji(choices);
  return header + '\n' + emojiText;
};

export const generateScoreHTML = (choices: Choice[], day: number) => {
  const lines: string[] = [];
  lines.push(buildHeader(day));
  lines.push(buildEmoji(choices));
  const result = lines.map((line) => <p>{line}</p>);
  return <div>{result}</div>;
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
