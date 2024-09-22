const API_URL =
  'https://o7hgv46qcf7swox3ygn53tayay0zzhgl.lambda-url.us-east-1.on.aws/';
const START_DATE = 1725148800000; //september 1st 2024 in timestamp form in miliseconds
const MS_PER_DAY = 86400000;

export const getImages = async () => {
  const day = _getDay();
  const images: any[] = await fetch(
    API_URL +
      '?' +
      new URLSearchParams({
        day: `${day}`,
      }).toString(),
  )
    .then((res) => res.json())
    .catch((error) => {
      console.error(error);
    });
  return _shuffle(images, day);
};

const _getDay = () => {
  const startDate = new Date(START_DATE).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  const msSinceStartDate = today - startDate;
  return msSinceStartDate / MS_PER_DAY;
};

function _shuffle(array: any[], seed: number) {
  var m = array.length,
    t,
    i;
  while (m) {
    i = Math.floor(_random(seed) * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    ++seed;
  }
  return array;
}

function _random(seed: number) {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
