export const formatDate = (date: Date, lang: string, timeZone?: string) => {
  const [weekday, comma, ...rest] = new Intl.DateTimeFormat(lang, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    timeZone,
  }).formatToParts(date);
  if (lang === 'ru') {
    weekday.value = weekday.value.toLowerCase()
  }
  return [rest.map((v) => v.value).join(''), comma.value, weekday.value].join(
    ''
  );
};
