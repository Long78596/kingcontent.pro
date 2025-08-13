import React from 'react';
// import proIcon from '../../assets/images/icon/create-content/protest.png';
// import disIcon from '../../assets/images/icon/create-content/discount.png';
// import speIcon from '../../assets/images/icon/create-content/speaking.png';
// import ideaIcon from '../../assets/images/icon/create-content/idea.png';
// import couponIcon from '../../assets/images/icon/create-content/coupon.png';
// import trendIcon from '../../assets/images/icon/create-content/trending-topic.png';
// import textIcon from '../../assets/images/icon/create-content/text-box.png';
// import trendingIcon from '../../assets/images/icon/create-content/trending.png';
// import smileyIcon from '../../assets/images/icon/create-content/smiley.png';
// import checkIcon from '../../assets/images/icon/create-content/check.png';
// import rateIcon from '../../assets/images/icon/create-content/rate.png';
// import imgIcon from '../../assets/images/icon/create-content/image.png';
// import upIcon from '../../assets/images/icon/create-content/cloud-computing.png';
// import colIcon from '../../assets/images/icon/create-content/column.png';
// import painIcon from '../../assets/images/icon/create-content/pain.png';
// import shieldIcon from '../../assets/images/icon/create-content/shield.png';
// import saveMoneyIcon from '../../assets/images/icon/create-content/save-money.png';
// import ratingIcon from '../../assets/images/icon/create-content/rating.png';
// import rankingIcon from '../../assets/images/icon/create-content/ranking.png';
// import reactionIcon from '../../assets/images/icon/create-content/reaction.png';
// import confettiIcon from '../../assets/images/icon/create-content/confetti.png';
// import chatGPTIcon from '../../assets/images/icon/create-content/chat-gpt-icon.png';
 import styled from 'styled-components';
 import LoadingApp from '../../components/LoadingApp';
// import chatIcon from '../../assets/images/icon/create-content/chat.png';
// import issueIcon from '../../assets/images/icon/create-content/conversation.png';
// import folderIcon from '../../assets/images/icon/create-content/empty-folder.png';
// import syncIcon from '../../assets/images/icon/create-content/sync.png';
 import downloadIcon from '../../assets/images/icon/create-content/download.png';
// import computerIcon from '../../assets/images/icon/create-content/computer.png';
// import presetsIcon from '../../assets/images/icon/create-content/presets.png';
// import regenerateIcon from '../../assets/images/icon/create-content/regenerate.png';
// import threadsIcon from '../../assets/images/icon/threads-grey-icon.png';
import { isArrayEmpty } from '../../configs';

export const DEFAULT = 'Công cụ hỗ trợ';
export const CONTENT = 'Tạo tiêu đề';
export const COMMIT = 'Tạo cam kết';
export const DISCOUNT = 'Mẫu câu khuyến mãi';
export const ACTION = 'Kêu gọi hành động';
export const IDEA = 'Ý tưởng';
export const COUPON = '7 trạng thái chốt sale';
export const CUSTOMER = 'Chân dung khách hàng';
export const TREND = 'Đu trend';
export const TEXT = 'Ý tưởng ngôn từ';
export const TRENDING = 'Xu hướng tìm kiếm';
export const EMOJI = 'Emoji';
export const CHECK = 'Check từ khoá VPCS';
export const DESIGNS = 'Ảnh gây chú ý';
export const UPLOAD = 'Tải lên ảnh/video';
export const SPECIAL = 'Theo dõi đặc biệt';
export const SAD = 'Khơi gợi nỗi đau';
export const SECURITY = 'Tạo sự trấn an';
export const SAVE = 'Tiết kiệm';
export const RARE = 'Tạo sự khan hiếm';
export const LIMITED = 'Tạo sự độc quyền';
export const HAPPY = 'Tạo sự mới mẻ';
export const EMOJI_SST = 'Khơi dậy cảm xúc';
export const CHAT_GPT = 'Chat GPT';
export const FEEDBACKS = 'Tạo Feedback ảo';
export const UPLOAD_TYPE_VIDEO = 'video';
export const UPLOAD_TYPE_IMAGE = 'image';
export const RECIPE = 'Viết theo công thức';
export const ADS = 'Mẫu quảng cáo';
export const CHAT_GPT_TOOLS_TEXT = 'Trí tuệ nhân tạo';
export const CHAT_GPT_TOOLS_TEXT_STEP_2 = 'Gợi ý theo chủ đề (mục con))';
export const FACEBOOK_PRESETS = 'Facebook Presets';
export const THREADS = 'THREADS';
export const REGENERATE = 'TẠO HÀNG LOẠT';

export const TOOLS_ARR = [
  {
    title: CHAT_GPT_TOOLS_TEXT,
    // icon: computerIcon,
    type: CHAT_GPT_TOOLS_TEXT,
  },

  {
    title: IDEA,
    // icon: ideaIcon,
    type: IDEA,
  },
  {
    title: TREND,
    // icon: trendIcon,
    type: TREND,
  },

  {
    title: TRENDING,
    // icon: trendingIcon,
    type: TRENDING,
  },
  {
    title: EMOJI,
    // icon: smileyIcon,
    type: EMOJI,
  },
  {
    title: CHECK,
    // icon: checkIcon,
    type: CHECK,
  },
  {
    title: FEEDBACKS,
    // icon: rateIcon,
    type: FEEDBACKS,
  },
  {
    title: DESIGNS,
    // icon: imgIcon,
    type: DESIGNS,
  },
  {
    title: UPLOAD,
    // icon: upIcon,
    type: UPLOAD,
  },
  {
    title: SPECIAL,
    // icon: colIcon,
    type: SPECIAL,
  },
  {
    title: CHAT_GPT,
    // icon: chatGPTIcon,
    type: CHAT_GPT,
  },
  {
    title: FACEBOOK_PRESETS,
    // icon: presetsIcon,
    type: FACEBOOK_PRESETS,
  },
  {
    title: THREADS,
    // icon: threadsIcon,
    type: THREADS,
  },
  {
    title: REGENERATE,
    // icon: regenerateIcon,
    type: REGENERATE,
  },
];

export const SEVEN_SALE_SINGLE_CLOSING = [
  {
    title: SAD,
    // icon: painIcon,
    type: SAD,
  },
  {
    title: SECURITY,
    // icon: shieldIcon,
    type: SECURITY,
  },
  {
    title: SAVE,
    // icon: saveMoneyIcon,
    type: SAVE,
  },
  {
    title: RARE,
    // icon: ratingIcon,
    type: RARE,
  },
  {
    title: LIMITED,
    // icon: rankingIcon,
    type: LIMITED,
  },
  {
    title: EMOJI_SST,
    // icon: reactionIcon,
    type: EMOJI_SST,
  },
  {
    title: HAPPY,
    // icon: confettiIcon,
    type: HAPPY,
  },
];

export const CHAT_GPT_TOOLS = [
  {
    title: COMMIT,
    // icon: proIcon,
    type: COMMIT,
  },
  {
    title: DISCOUNT,
    // icon: disIcon,
    type: DISCOUNT,
  },

  {
    title: ACTION,
    // icon: speIcon,
    type: ACTION,
  },
  {
    title: COUPON,
    // icon: couponIcon,
    type: COUPON,
  },
  {
    title: TEXT,
    // icon: textIcon,
    type: TEXT,
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

export const renderTools = (loading, array, screen) => {
  return (
    <div className="p-2 overflow-y-scroll overflow-x-hidden max-h-screen">
      {array.length === 0 && !loading ? (
        <div className="flex justify-center">
          <span className="font-bold">Không có dữ liệu hiển thị</span>
        </div>
      ) : loading ? (
        <LoadingApp />
      ) : (
        screen
      )}
    </div>
  );
};

export const getObject_create_post = (
  category,
  content,
  medias = [],
  media_url = '',
  user,
  label_id,
  plan_id,
  noteText,
  hashVideoOrImage
) => {
  const obj = {
    cat_id: category,
    post_text: content,
    medias: !isArrayEmpty(medias) ? medias : null,
    media_url: media_url,
    media_type: hashVideoOrImage,
    user: user,
    label_id,
    plan_id,
    note: noteText,
  };
  return obj;
};
export const getObject_question = (question) => {
  return {
    question: question,
    previous_data: [],
  };
};
export const CHAT = 'CHAT';
export const ISUE = 'ISUE';
export const BANK = 'BANK';
export const PEDDING = 'PEDDING';
export const DOWNLOAD = 'DOWNLOAD';
export const _TAB = [
  {
    title: 'Nhập nội dung',
    // icon: chatIcon,
    type: CHAT,
  },
  {
    title: 'Gợi ý chủ đề',
    // icon: issueIcon,
    type: ISUE,
  },
  {
    title: 'Ngân hàng câu hỏi',
    // icon: folderIcon,
    type: BANK,
  },
  {
    title: 'Đang xử lý',
    // icon: syncIcon,
    type: PEDDING,
  },
  {
    title: 'Kết quả đã lưu',
    icon: downloadIcon,
    type: DOWNLOAD,
  },
];

export const _TAB_CHAT_GPT_PROMT = [
  {
    title: 'Ngân hàng câu hỏi',
    // icon: folderIcon,
    type: BANK,
  },
  {
    title: 'Nhập nội dung',
    // icon: chatIcon,
    type: CHAT,
  },
  {
    title: 'Đang xử lý',
    // icon: syncIcon,
    type: PEDDING,
  },
  {
    title: 'Kết quả đã lưu',
    // icon: downloadIcon,
    type: DOWNLOAD,
  },
];

export const style = {
  control: (base) => ({
    ...base,
    border: '2px solid #1e88e5',
    ':hover': {
      border: '2px solid #1e88e5',
    },
    'input:focus': {
      boxShadow: 'none',
    },
  }),
};
export const _input_style =
  'rounded-lg shadow-md border-gray-300 focus:border-blue-300 w-full h-12';
export const _dashed_border =
  'w-full h-2 border-gray-100 border-b-2 border-dashed mb-2';
export const _text_title = 'uppercase font-bold mb-2 font-italic';
export const _button_styled =
  'bg-blue-500 text-white p-3 hover:bg-gray-400 w-full rounded-md shadow-md';

export const getBodyCreatePlan = (data, tagsSelect = null, userTags = null) => {
  const { name, hashtag, color, thumbnail, productName = '' } = data;
  const convertedTags = tagsSelect
    ? Array.from(tagsSelect).map((item) => {
        return {
          id: item.id,
          name: item.name,
        };
      })
    : [];
  return {
    name: name,
    hashtag: hashtag,
    color: color !== null ? color.replace('RGBA', 'rgba') : null,
    thumbnail: thumbnail,
    tags: convertedTags,
    user_tags: userTags,
    product_name: productName,
  };
};
export const lineGadientReg = /linear-gradient\([^)]+\)/;
export const isVideo = (obj) => {
  return obj.type === 'video';
};
export const hasVideo = (array) => {
  return array.filter((_elt) => _elt.type === UPLOAD_TYPE_VIDEO).length;
};
export const isImage = (obj) => {
  return obj.type === 'image';
};
export const hasImage = (array) => {
  return array.some(isVideo);
};

// =================TOOL CHỈNH ẢNH ===============
export const TEXT_TOOL = 'TEXT';
export const TEMPLATE = 'TEMPLATE';
export const ICON = 'ICON';
export const SIZE = 'SIZE';
export const DRAW = 'DRAW';
export const LAYER = 'LAYER';
export const IMAGE = 'IMAGE';
export const CLIP_PATH = 'CLIP_PATH';

export const base64ToFile = (base64Data, filename, mimeType) => {
  // Split the base64 data to remove the metadata part (e.g., 'data:image/jpeg;base64,')
  const base64WithoutMetadata = base64Data.split(',')[1];

  // Convert the base64 data to binary data
  const binaryData = atob(base64WithoutMetadata);

  // Create an array to hold the binary data
  const dataArray = new Uint8Array(binaryData.length);

  // Populate the array with the binary data
  for (let i = 0; i < binaryData.length; i++) {
    dataArray[i] = binaryData.charCodeAt(i);
  }

  // Create a Blob from the binary data
  const blob = new Blob([dataArray], { type: mimeType });

  // Create a File from the Blob
  return new File([blob], filename);
};

export const isBase64Image = (base64String) => {
  // Remove the data URI prefix if present
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

  try {
    // Create a new Image object
    const img = new Image();

    // Set the source to the base64 string
    img.src = 'data:image/jpeg;base64,' + base64Data;

    // Check if the image is valid
    return img.width > 0 && img.height > 0;
  } catch (error) {
    // An error occurred, likely due to invalid base64 string
    return false;
  }
};

export const svgPathString = (pathData) => {
  return pathData
    .map(function (segment) {
      return segment[0] + segment.slice(1).join(' ');
    })
    .join('');
};

export const useOutsideClick = (callback) => {
  const ref = React.useRef();

  React.useEffect(() => {
    const handleClick = (event) => {
      callback();
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return ref;
};
export const urlToBase64 = async (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const base64String = canvas.toDataURL('image/png');
      resolve(base64String);
    };

    img.onerror = function () {
      reject(new Error('Error loading image from URL'));
    };

    img.crossOrigin = 'anonymous';
    img.src = url;
  });
};

export const convertUrlsToBase64 = async (urls) => {
  const base64Objects = [];

  for (const url of urls) {
    try {
      const base64String = await urlToBase64(url);
      base64Objects.push({ url, data_url: base64String });
    } catch (error) {
      // Error converting image to Base64
    }
  }

  return base64Objects;
};

// Safe SVG encoding helper
export const safeSvgEncode = (svgString) => {
  try {
    // Replace all problematic characters
    const cleanSvg = svgString
      .replace(/\n/g, '')
      .replace(/\r/g, '')
      .replace(/\t/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    return encodeURIComponent(cleanSvg);
  } catch (error) {
    // Return a simple fallback SVG
    const fallbackSvg = '<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="white" stroke="black"/></svg>';
    try {
      return encodeURIComponent(fallbackSvg);
    } catch (fallbackError) {
      return '';
    }
  }
};
export const customIconRotation = 
  '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">' +
  '<g filter="url(#filter0_d)">' +
  '<circle cx="9" cy="9" r="5" fill="white"/>' +
  '<circle cx="9" cy="9" r="4.75" stroke="black" stroke-opacity="0.3" stroke-width="0.5"/>' +
  '</g>' +
  '<path d="M10.8047 11.1242L9.49934 11.1242L9.49934 9.81885" stroke="black" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>' +
  '<path d="M6.94856 6.72607L8.25391 6.72607L8.25391 8.03142" stroke="black" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>' +
  '<path d="M9.69517 6.92267C10.007 7.03301 10.2858 7.22054 10.5055 7.46776C10.7252 7.71497 10.8787 8.01382 10.9517 8.33642C11.0247 8.65902 11.0148 8.99485 10.9229 9.31258C10.831 9.63031 10.6601 9.91958 10.4262 10.1534L9.49701 11.0421M8.25792 6.72607L7.30937 7.73554C7.07543 7.96936 6.90454 8.25863 6.81264 8.57636C6.72073 8.89408 6.71081 9.22992 6.78381 9.55251C6.8568 9.87511 7.01032 10.174 7.23005 10.4212C7.44978 10.6684 7.72855 10.8559 8.04036 10.9663" stroke="black" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>' +
  '<defs>' +
  '<filter id="filter0_d" x="0" y="0" width="18" height="18" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">' +
  '<feFlood flood-opacity="0" result="BackgroundImageFix"/>' +
  '<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>' +
  '<feOffset/>' +
  '<feGaussianBlur stdDeviation="2"/>' +
  '<feColorMatrix type="matrix" values="0 0 0 0 0.137674 0 0 0 0 0.190937 0 0 0 0 0.270833 0 0 0 0.15 0"/>' +
  '<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>' +
  '<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>' +
  '</filter>' +
  '</defs>' +
  '</svg>';
export const ImgCursorRotation = (transform) => {
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24">' +
    '<defs>' +
    '<filter id="a" width="266.7%" height="156.2%" x="-75%" y="-21.9%" filterUnits="objectBoundingBox">' +
    '<feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"/>' +
    '<feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="1"/>' +
    '<feColorMatrix in="shadowBlurOuter1" result="shadowMatrixOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>' +
    '<feMerge>' +
    '<feMergeNode in="shadowMatrixOuter1"/>' +
    '<feMergeNode in="SourceGraphic"/>' +
    '</feMerge>' +
    '</filter>' +
    '<path id="b" d="M1.67 12.67a7.7 7.7 0 0 0 0-9.34L0 5V0h5L3.24 1.76a9.9 9.9 0 0 1 0 12.48L5 16H0v-5l1.67 1.67z"/>' +
    '</defs>' +
    '<g fill="none" fill-rule="evenodd">' +
    '<path d="M0 24V0h24v24z"/>' +
    '<g fill-rule="nonzero" filter="url(#a)" transform="' + transform + '">' +
    '<use fill="#000" fill-rule="evenodd" xlink:href="#b"/>' +
    '<path stroke="#FFF" d="M1.6 11.9a7.21 7.21 0 0 0 0-7.8L-0.5 6.2V-0.5h6.7L3.9 1.8a10.4 10.4 0 0 1 0 12.4l2.3 2.3H-0.5V9.8l2.1 2.1z"/>' +
    '</g>' +
    '</g>' +
    '</svg>'
  );
};

export const hasEmoji = (text) => {
  // Regular expression to match emoji characters
  const emojiRegex =
    /[\uD800-\uDBFF][\uDC00-\uDFFF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;

  // Test if the text contains any emoji characters
  return emojiRegex.test(text);
};

export const getTitle = (title) => {
  switch (title) {
    case CONTENT:
      return CONTENT;

    case COMMIT:
      return COMMIT;

    case DISCOUNT:
      return DISCOUNT;

    case ACTION:
      return ACTION;

    case IDEA:
      return IDEA;

    case COUPON:
      return COUPON;

    case CUSTOMER:
      return CUSTOMER;

    case TREND:
      return TREND;

    case TEXT:
      return TEXT;

    case TRENDING:
      return TRENDING;

    case EMOJI:
      return EMOJI;

    case CHECK:
      return CHECK;

    case FEEDBACKS:
      return FEEDBACKS;

    case DESIGNS:
      return DESIGNS;

    case UPLOAD:
      return UPLOAD;

    case SPECIAL:
      return SPECIAL;

    case CHAT_GPT:
      return CHAT_GPT;

    case CHAT_GPT_TOOLS_TEXT:
      return CHAT_GPT_TOOLS_TEXT;

    case CHAT_GPT_TOOLS_TEXT_STEP_2:
      return CHAT_GPT_TOOLS_TEXT;

    case FACEBOOK_PRESETS:
      return 'Màu nền Facebook';

    case THREADS:
      return 'THREADS';
    
    case REGENERATE:
      return REGENERATE;

    default:
      return DEFAULT;
  }
};
