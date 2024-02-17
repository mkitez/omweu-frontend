export const formatDate = (date: Date, lang: string, timeZone: string) => {
  const [weekday, comma, ...rest] = new Intl.DateTimeFormat(lang, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    timeZone,
  }).formatToParts(date);
  return [rest.map((v) => v.value).join(''), comma.value, weekday.value].join(
    ''
  );
};
