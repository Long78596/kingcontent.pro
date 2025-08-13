import moment from 'moment';
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';

export const formatDate = (date, format) => {
  if (date) {
    const dateFormat = format ? format : DATE_FORMAT;
    return moment(new Date(date)).format(dateFormat);
  } else {
    return '';
  }
};

export const formatUnixDate = (date, format) => {
  if (date) {
    const dateFormat = format ? format : DATE_TIME_FORMAT;
    return moment.unix(date).utc(true).format(dateFormat);
  } else {
    return '';
  }
};

export const CalendarLocaleVn = {
  sunday: 'CN',
  monday: 'T.Hai ',
  tuesday: 'T.Ba',
  wednesday: 'T.Tư',
  thursday: 'T.Năm',
  friday: 'T.Sáu',
  saturday: 'T.Bảy',
  ok: 'Xác nhận',
  today: 'Hôm nay',
  yesterday: 'Hôm qua',
  hours: 'giờ',
  minutes: 'phút',
  seconds: 'giây',
};
