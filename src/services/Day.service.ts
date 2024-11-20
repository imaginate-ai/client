const START_DATE = new Date(2024, 8, 1).setHours(0, 0, 0, 0); //september 1st 2024 in timestamp form in miliseconds of local timezone
const MS_PER_DAY = 86400000;

export const calculateDay = () => {
  const today = new Date().setHours(0, 0, 0, 0);
  const msSinceStartDate = today - START_DATE;
  return Math.floor(msSinceStartDate / MS_PER_DAY);
};
