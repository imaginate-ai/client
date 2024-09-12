const API_URL = 'https://kjssqls0ue.execute-api.us-east-1.amazonaws.com/call';
const START_DATE = 1725148800000; //september 1st 2024 in timestamp form in miliseconds
const MS_PER_DAY = 86400000;

export const getImages = async () => {
  const day = _getDay();
  const images: any[] = await fetch(
    API_URL + '?' +
      new URLSearchParams({
        day: `${day}`,
      }).toString(),
  ).then((res) => res.json()).catch((error)=>{
    console.error(error)
  });
  return images;
};

const _getDay = () => {
  const startDate = new Date(START_DATE).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  const msSinceStartDate = today - startDate;
  return msSinceStartDate / MS_PER_DAY;
};
