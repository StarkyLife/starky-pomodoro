export const getMillisecondsForSeconds = (seconds: number) => 1000 * seconds;
export const getMillisecondsForMinutes = (minutes: number) => 1000 * 60 * minutes;

export const getSecondsForMinutes = (minutes: number) => minutes * 60;

export const getTimeText = (seconds: number) => {
  const minutes = Math.floor(seconds / 60).toString();
  const secondsInMinute = (seconds % 60).toString();

  return {
    minutes: minutes.length === 1 ? `0${minutes}` : minutes,
    seconds: secondsInMinute.length === 1 ? `0${secondsInMinute}` : secondsInMinute,
  };
};
