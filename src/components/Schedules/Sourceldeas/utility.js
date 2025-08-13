// @ts-nocheck
import trendIcon from '../../../assets/images/icon/create-content/trending-topic.png';
import addUserIcon from '../../../assets/images/icon/schedules/add-user.png';
import megaPhoneIcon from '../../../assets/images/icon/schedules/megaphone.png';
import writingIcon from '../../../assets/images/icon/schedules/writing.png';
import heartIcon from '../../../assets/images/icon/schedules/heart.png';
import reactionIcon from '../../../assets/images/icon/schedules/reaction.png';
import partyIcon from '../../../assets/images/icon/schedules/party.png';
import InstagramIcon from '../../../assets/images/icon/schedules/instagram.png';
import tiktokIcon from '../../../assets/images/icon/schedules/tiktok.png';
import douyinIcon from '../../../assets/images/icon/schedules/douyin.png';
import threadsIcon from '../../../assets/images/icon/schedules/threads.png';
import chatGPTIcon from '../../../assets/images/icon/create-content/chat-gpt-icon.png';
import videoEditorIcon from '../../../assets/images/icon/video-editor.png';
import AIVideoIcon from '../../../assets/images/icon/main-menu/menu-icon-videogen-full.png';
import styled from 'styled-components';

export const DEFAULT = 'Nguồn cấp ý tưởng';
export const TREND = 'Đu trend';
export const SPECIAL = 'Theo dõi đặc biệt';
export const ADS = 'Đang chạy Ads';
export const CREATED = 'Content đã tạo';
export const LIKED = 'Content đã thích';
export const TIKTOK = 'TikTok';
export const INSTAGRAM = 'Instagram';
export const THREADS = 'Threads';
export const DOUYIN = 'Douyin';
export const SYSTEM = 'Content nuôi dưỡng';
export const EVENT = 'Sự kiện nổi bật';
export const CHATGPT = 'ChatGPT';
export const VIDEO_EDITOR = 'Video Editor';
export const VIDEOGEN_AI = 'Video AI';

export const IDEAS_ARR = [
  {
    title: TREND,
    icon: trendIcon,
    type: TREND,
    description:
      'Đây là những gì cộng đồng đang quan tâm, hãy lồng ghép và chỉnh sửa content của bạn theo các đề tài bên dưới!',
  },
  {
    title: SPECIAL,
    icon: addUserIcon,
    type: SPECIAL,
    description:
      'Đây là những content từ các Fanpage/Group/Profile trong danh sách theo dõi đặc biệt của bạn (Kingcontent luôn tự động cập nhật các bài viết mới nhất)',
  },
  {
    title: ADS,
    icon: megaPhoneIcon,
    type: ADS,
    description:
      'Các bài viết đang chạy Ads được đầu tư khá nghiêm túc về nội dung, hãy sử dụng nguồn cung cấp nội dung này để tham khảo',
  },

  {
    title: CREATED,
    icon: writingIcon,
    type: CREATED,
    description: 'Sử dụng lại content đã tạo từ trình soạn thảo lúc trước',
  },
  {
    title: LIKED,
    icon: heartIcon,
    type: LIKED,
    description: 'Danh sách những content mà bạn đã nhấn thích trong hệ thống',
  },
  {
    title: SYSTEM,
    icon: reactionIcon,
    type: SYSTEM,
    description: 'Những content chăm sóc trang, không bán hàng',
  },
  {
    title: EVENT,
    icon: partyIcon,
    type: EVENT,
    description:
      'Sáng tạo ra những content phù hợp với sự kiện sắp tới (Đăng thông báo, đăng bài câu tương tác, chương trình giảm giá...)',
  },
  {
    title: TIKTOK,
    icon: tiktokIcon,
    type: TIKTOK,
    description: 'Những video xu hướng từ tiktok',
  },
  {
    title: INSTAGRAM,
    icon: InstagramIcon,
    type: INSTAGRAM,
    description: 'Những bài viết mới nhất từ Instagram',
  },
  {
    title: DOUYIN,
    icon: douyinIcon,
    type: DOUYIN,
    description: 'Những bài viết mới nhất từ Douyin',
  },
  {
    title: THREADS,
    icon: threadsIcon,
    type: THREADS,
    description: 'Những bài viết mới nhất từ Threads',
  },
  {
    title: CHATGPT,
    icon: chatGPTIcon,
    type: CHATGPT,
    description: 'Nội dung được tạo bởi ChatGPT đã được lưu từ trình soạn thảo',
  },
  {
    title: VIDEO_EDITOR,
    icon: videoEditorIcon,
    type: VIDEO_EDITOR,
    description:
      'Những video đã được tạo từ Video Editor, bạn có thể sử dụng lại nội dung này',
  },
  {
    title: VIDEOGEN_AI,
    icon: AIVideoIcon,
    type: VIDEOGEN_AI,
    description: 'Những video tạo bởi AI',
  },
];

export const IDEAS_AUTO_ARR = [
  {
    title: SPECIAL,
    icon: addUserIcon,
    type: SPECIAL,
    description:
      'Đây là những content từ các Fanpage/Group/Profile trong danh sách theo dõi đặc biệt của bạn (Kingcontent luôn tự động cập nhật các bài viết mới nhất)',
  },
  {
    title: CREATED,
    icon: writingIcon,
    type: CREATED,
    description: 'Sử dụng lại content đã tạo từ trình soạn thảo lúc trước',
  },
  {
    title: LIKED,
    icon: heartIcon,
    type: LIKED,
    description: 'Danh sách những content mà bạn đã nhấn thích trong hệ thống',
  },
  {
    title: SYSTEM,
    icon: reactionIcon,
    type: SYSTEM,
    description: 'Những content chăm sóc trang, không bán hàng',
  },
  // {
  //   title: EVENT,
  // //   icon: partyIcon,
  //   type: EVENT,
  //   description:
  //     'Sáng tạo ra những content phù hợp với sự kiện sắp tới (Đăng thông báo, đăng bài câu tương tác, chương trình giảm giá...)',
  // },
  {
    title: TIKTOK,
    icon: tiktokIcon,
    type: TIKTOK,
    description: 'Những video xu hướng từ tiktok',
  },
  {
    title: INSTAGRAM,
    icon: InstagramIcon,
    type: INSTAGRAM,
    description: 'Những bài viết mới nhất từ Instagram',
  },
  {
    title: DOUYIN,
    icon: douyinIcon,
    type: DOUYIN,
    description: 'Những bài viết mới nhất từ Douyin',
  },
  {
    title: THREADS,
    icon: threadsIcon,
    type: THREADS,
    description: 'Những bài viết mới nhất từ Threads',
  },
  {
    title: CHATGPT,
    icon: chatGPTIcon,
    type: CHATGPT,
    description: 'Nội dung được tạo bởi ChatGPT đã được lưu từ trình soạn thảo',
  },
  {
    title: VIDEOGEN_AI,
    icon: AIVideoIcon,
    type: VIDEOGEN_AI,
    description: 'Những video tạo bởi AI',
  },
  {
    title: VIDEO_EDITOR,
    icon: videoEditorIcon,
    type: VIDEO_EDITOR,
    description:
      'Những video đã được tạo từ Video Editor, bạn có thể sử dụng lại nội dung này',
  },
];

export const ContentDataStyled = styled.div`
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar {
    width: 10px;
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #000000;
    border: 2px solid #555555;
  }
`;

const prepareOrders = (
  likesOrder = '',
  commentsOrder = '',
  sharesOrder = '',
  timeStampOrder = ''
) => {
  let orders = [];
  if (likesOrder) {
    orders.push({
      sort: 'likes',
      dir: parseInt(likesOrder) === 1 ? 'asc' : 'desc',
    });
  }
  if (commentsOrder) {
    orders.push({
      sort: 'comments',
      dir: parseInt(commentsOrder) === 1 ? 'asc' : 'desc',
    });
  }
  if (sharesOrder) {
    orders.push({
      sort: 'shares',
      dir: parseInt(sharesOrder) === 1 ? 'asc' : 'desc',
    });
  }
  if (timeStampOrder) {
    orders.push({
      sort: 'post_timestamp',
      dir: parseInt(timeStampOrder) === 1 ? 'desc' : 'asc',
    });
  }
  return orders;
};

export const destructSearchData = (data) => {
  const {
    keyword = '',
    likesOrder = '',
    commentsOrder = '',
    sharesOrder = '',
    feed_id = '',
    schedule = '',
    timeStampOrder = '',
    hashtag = '',
    kindOfContent = '',
  } = data;
  let query = '';
  let prefix = '';
  if (keyword) {
    prefix = query !== '' ? '&' : '';
    query += `${prefix}keyword=${keyword}`;
  }
  if (feed_id) {
    prefix = query !== '' ? '&' : '';
    query += `${prefix}feed_id=${feed_id}`;
  }
  const orders = prepareOrders(
    likesOrder,
    commentsOrder,
    sharesOrder,
    timeStampOrder
  );
  if (orders.length > 0) {
    orders.map((item, idx) => {
      const { sort, dir } = item;
      prefix = query !== '' ? '&' : '';
      query += `${prefix}orders[${idx}][sort]=${sort}&orders[${idx}][dir]=${dir}&`;
    });
  }
  if (schedule) {
    prefix = query !== '' ? '&' : '';
    query += `${prefix}scheduled_type=${schedule}`;
  }
  if (hashtag) {
    prefix = query !== '' ? '&' : '';
    query += `${prefix}hashtag=${hashtag}`;
  }
  if (kindOfContent) {
    prefix = query !== '' ? '&' : '';
    query += `${prefix}media_type=${kindOfContent}`;
  }
  return query;
};
