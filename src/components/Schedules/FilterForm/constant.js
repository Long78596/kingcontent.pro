import {
  faLevelUpAlt,
  faLevelDownAlt,
  faRandom,
  faShareSquare,
  faThumbsUp,
  faComment,
} from '@fortawesome/free-solid-svg-icons';

const FreqShareList = [
  {
    name: 'Share Tăng dần',
    value: '1',
    icon: faLevelUpAlt,
  },
  {
    name: 'Share Giảm dần',
    value: '2',
    icon: faLevelDownAlt,
  },
];

const initShareSelect = {
  name: 'Chọn tần suất share ...',
  value: '',
  icon: faShareSquare,
};

const initListFanpages = {
  name: 'Toàn bộ fanpage',
  value: '',
};

const FreqLikeList = [
  {
    name: 'Like Tăng dần',
    value: '1',
    icon: faLevelUpAlt,
  },
  {
    name: 'Like Giảm dần',
    value: '2',
    icon: faLevelDownAlt,
  },
];

const initLikeSelect = {
  name: 'Chọn tần suất like ...',
  value: '',
  icon: faThumbsUp,
};

const FreqCommentList = [
  {
    name: 'Comment Tăng dần',
    value: '1',
    icon: faLevelUpAlt,
  },
  {
    name: 'Comment Giảm dần',
    value: '2',
    icon: faLevelDownAlt,
  },
];

const initCommentSelect = {
  name: 'Chọn tần suất comment ...',
  value: '',
  icon: faComment,
};

const initScheduleSelect = {
  name: 'Chọn loại lịch ...',
  value: '',
};

const ScheduleList = [
  {
    name: 'Tất cả',
    value: 0,
  },
  {
    name: 'Đã lên lịch',
    value: 1,
  },
  {
    name: 'Chưa lên lịch',
    value: 2,
  },
];

const initTimeStampSelect = {
  name: 'Thời gian cập nhật',
  value: '',
};

const TimeStampList = [
  {
    name: 'Mới nhất',
    value: '1',
    icon: faLevelUpAlt,
  },
  {
    name: 'Cũ nhất',
    value: '2',
    icon: faLevelDownAlt,
  },
];

const initHashtagSelect = {
  name: 'Chọn hashtag ...',
  value: '',
};

export {
  FreqShareList,
  initShareSelect,
  initListFanpages,
  FreqLikeList,
  initLikeSelect,
  FreqCommentList,
  initCommentSelect,
  initScheduleSelect,
  ScheduleList,
  initTimeStampSelect,
  TimeStampList,
  initHashtagSelect,
};
