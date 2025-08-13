export const applyOrder = (orderType, orderDir, data) => {
  switch (orderType) {
    case 'created':
      return data.sort((a, b) => {
        return orderDir === 1
          ? new Date(b.created) - new Date(a.created)
          : new Date(a.created) - new Date(b.created);
      });

    case 'likes':
      return data.sort((a, b) => {
        return orderDir === 1
          ? parseInt(b.likes) - parseInt(a.likes)
          : parseInt(a.likes) - parseInt(b.likes);
      });

    case 'comments':
      return data.sort((a, b) => {
        return orderDir === 1
          ? parseInt(b.comments) - parseInt(a.comments)
          : parseInt(a.comments) - parseInt(b.comments);
      });

    default:
      return data;
  }
};

export const sortTypes = [
  { value: '', label: 'Loại sắp xếp' },
  { value: 'created', label: 'Thời gian cập nhật' },
  { value: 'likes', label: 'Lượt thích' },
  { value: 'comments', label: 'Lượt bình luận' },
];

export const sortDirs = [
  { value: 0, label: 'Mặc định' },
  { value: 1, label: 'Giảm dần' },
  { value: 2, label: 'Tăng dần' },
];

export const listDefaultHashTag = ['meohay', 'meovat', 'xuhuong', 'tinhot'];
