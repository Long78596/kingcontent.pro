export const OLD_TO_NEW = 'OLD_TO_NEW'
export const NEW_TO_OLD = 'NEW_TO_OLD'
export const ASCENDING = 'ASCENDING'
export const DECREASE = 'DECREASE'
export const ASCENDING_LIKE = 'ASCENDING_LIKE'
export const DECREASE_LIKE = 'DECREASE_LIKE'
export const DEFAULT = 'DEFAULT'
export const CATEGORY_SORT = [
  {
    value: DEFAULT,
    title: 'Danh mục content',
  },
];
export const FANPAGE_SORT = [
  {
    value: DEFAULT,
    label: 'Sắp xếp fanpage',
  },
  {
    value: NEW_TO_OLD,
    label: 'Mới -> cũ',
  },
  {
    value: OLD_TO_NEW,
    label: 'Cũ -> mới',
  },
];
export const AMOUNT_SORT = [
  {
    value: DEFAULT,
    label: 'Số lượng content',
  },
  {
    value: ASCENDING,
    label: 'Tăng dần',
  },
  {
    value: DECREASE,
    label: 'Giảm dần',
  },
];
export const SAVED_SORT = [
  {
    value: DEFAULT,
    label: 'Số lượt thích',
  },
  {
    value: ASCENDING_LIKE,
    label: 'Tăng dần',
  },
  {
    value: DECREASE_LIKE,
    label: 'Giảm dần',
  },
];
