const dateTimeFormatter = new Intl.DateTimeFormat('th-TH', {
  timeZone: 'Asia/Bangkok',
  day: 'numeric',
  month: 'numeric',
  year: 'numeric', 

});

const formatDateWithOffset = (dateString : string, hoursOffset = 0) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const adjustedDate = new Date(date.getTime() + (hoursOffset * 60 * 60 * 1000));
  return dateTimeFormatter.format(adjustedDate);
};


export default formatDateWithOffset