const START_DATE = new Date(2024, 8, 1).setHours(0, 0, 0, 0); //september 1st 2024 in timestamp form in miliseconds of local timezone
const MS_PER_DAY = 86400000;

export const getToday = (): number => {
  const today = new Date().setHours(0, 0, 0, 0);
  return calculateDayFromTimestamp(today);
};

export const getDayLastPlayed = (): number => {
  const dateLastPlayed = getDateLastPlayed();
  if (!dateLastPlayed) return -1;
  const timestampLastPlayed: number = dateLastPlayed.setHours(0, 0, 0, 0);
  return calculateDayFromTimestamp(timestampLastPlayed);
};

export const getDateLastPlayed = (): Date | null => {
  const storedTimestampLastPlayed = Number(
    localStorage.getItem('day_last_played'),
  );
  return new Date(storedTimestampLastPlayed);
};

const calculateDayFromTimestamp = (timestamp: number): number => {
  const msSinceStartDate = timestamp - START_DATE;
  return Math.floor(msSinceStartDate / MS_PER_DAY);
};
