export const formatDate = (date: Date, lang: string) => {
  const [weekday, comma, ...rest] = new Intl.DateTimeFormat(lang, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }).formatToParts(date);
  return [rest.map((v) => v.value).join(''), comma.value, weekday.value].join(
    ''
  );
};
