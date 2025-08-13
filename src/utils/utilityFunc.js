import { getDay } from 'date-fns/esm';
import Client from '../Client';
import moment from 'moment';

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function kFormatter(num) {
  return num > 999 ? (num / 1000).toFixed(1) + 'k' : num;
}

export function fancyTimeFormat(duration) {
  // Hours, minutes and seconds
  const hrs = ~~(duration / 3600);
  const mins = ~~((duration % 3600) / 60);
  const secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = '';

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '');
  ret += '' + secs;

  return ret;
}

export function randomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function randomRgbaColor(opacity) {
  const R = Math.floor(Math.random() * 256);
  const G = Math.floor(Math.random() * 256);
  const B = Math.floor(Math.random() * 256);
  let color = `rgba(${R}, ${G}, ${B}, ${opacity})`;
  return color;
}

export function convertWeekdayToString(date) {
  const newDate = new Date(date);
  const dayName = getDay(newDate);
  switch (dayName) {
    case 0:
      return 'Chủ nhật';
    case 1:
      return 'Thứ hai';
    case 2:
      return 'Thứ ba';
    case 3:
      return 'Thứ tư';
    case 4:
      return 'Thứ năm';
    case 5:
      return 'Thứ sáu';
    case 6:
      return 'Thứ bảy';
    default:
      break;
  }
}

export function destructContentsToParagraph(contents) {
  if (contents.length > 0) {
    const returnData = [...contents].reduce((acc, contentItem) => {
      const { content: post_text } = contentItem;
      const tripedHtml = post_text.replace(/<[^>]+>/g, '');
      const listPara = tripedHtml.split('.');
      if (listPara.length > 0) {
        listPara.map((item, index) => {
          acc.push({ paragraph: item, fullContent: tripedHtml });
        });
      }
      return acc;
    }, []);
    return returnData;
  } else {
    return [];
  }
}

export const convertBase64ToFiles = async (medias) => {
  const b64 = medias[0];
  await fetch(b64).then((res) => {
    return res.blob();
  });
  /*if(b64){
    let files = []
    if(Array.isArray(b64)){
      b64.forEach((item, index) => {
        fetch(item)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "File name",{ type: "image/png" })
            files.push(file)
          })
      })
    }else{
      await fetch(b64)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "File name",{ type: "image/png" })
          files.push(file)
        })
    }
  }*/
};

export function createEmptyContent() {
  const current = new Date();
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;
  const content = {
    content_type: 'Image',
    fb_post_id: '',
    likes: 0,
    shares: 0,
    comments: 0,
    content: 'Empty content',
    medias: '[]',
    post_timestamp: date,
    createdAt: date,
    updatedAt: date,
    category: null,
    fanpage: null,
    id: '',
  };
  return content;
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export const createShortContent = (content = '', length = 100) => {
  let shortContent = '';
  shortContent = content.replace(/<[^>]+>/g, '');
  if (shortContent.length > 100) {
    shortContent = shortContent.substr(0, length) + '...';
  }
  return shortContent;
};

export const getCurrentMonth = () => {
  const d = new Date();
  const month = d.getMonth();
  return month + 1;
};

export const getCurrentYear = () => {
  const d = new Date();
  const year = d.getFullYear();
  return year;
};

export function isObjEmpty(obj) {
  if (!obj) return true;
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
}
export const TYPE_GO_CHAT = 'gochat';
export const TYPE_GO_PAGE = 'gopage';
export const TYPE_GO_CONTENT = 'gocontent';
export const REDUX_NAME_CREATE_POST = 'createPost';
export const REDUX_NAME_CONTENT_USER_LIKED = 'contentUserLike';

export const getFacebookIdFromUrl = (url = '') => {
  if (!url) return null;
  const regex = /facebook\.com\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const whiteTheme = {
  'common.bi.image': '/friends.png',
  'common.bisize.width': '175px',
  'common.bisize.height': 'auto',
  // "common.backgroundImage": "./img/bg.png",
  'common.backgroundColor': '#fff',
  'common.border': '1px solid #c1c1c1',

  // header
  'header.backgroundImage': 'none',
  'header.backgroundColor': 'transparent',
  'header.border': '0px',

  // load button
  'loadButton.backgroundColor': '#fff',
  'loadButton.border': '1px solid #ddd',
  'loadButton.color': '#222',
  'loadButton.fontFamily': "'Noto Sans', sans-serif",
  'loadButton.fontSize': '12px',

  // download button
  'downloadButton.backgroundColor': '#fdba3b',
  'downloadButton.border': '1px solid #fdba3b',
  'downloadButton.color': '#fff',
  'downloadButton.fontFamily': "'Noto Sans', sans-serif",
  'downloadButton.fontSize': '12px',

  // main icons
  'menu.normalIcon.color': '#8a8a8a',
  'menu.activeIcon.color': '#555555',
  'menu.disabledIcon.color': '#434343',
  'menu.hoverIcon.color': '#e9e9e9',
  'menu.iconSize.width': '24px',
  'menu.iconSize.height': '24px',

  // submenu icons
  'submenu.normalIcon.color': '#8a8a8a',
  'submenu.activeIcon.color': '#555555',
  'submenu.iconSize.width': '32px',
  'submenu.iconSize.height': '32px',

  // submenu primary color
  'submenu.backgroundColor': 'transparent',
  'submenu.partition.color': '#e5e5e5',

  // submenu labels
  'submenu.normalLabel.color': '#858585',
  'submenu.normalLabel.fontWeight': 'normal',
  'submenu.activeLabel.color': '#000',
  'submenu.activeLabel.fontWeight': 'normal',

  // checkbox style
  'checkbox.border': '1px solid #ccc',
  'checkbox.backgroundColor': '#fff',

  // rango style
  'range.pointer.color': '#333',
  'range.bar.color': '#ccc',
  'range.subbar.color': '#606060',

  'range.disabledPointer.color': '#d3d3d3',
  'range.disabledBar.color': 'rgba(85,85,85,0.06)',
  'range.disabledSubbar.color': 'rgba(51,51,51,0.2)',

  'range.value.color': '#000',
  'range.value.fontWeight': 'normal',
  'range.value.fontSize': '11px',
  'range.value.border': '0',
  'range.value.backgroundColor': '#f5f5f5',
  'range.title.color': '#000',
  'range.title.fontWeight': 'lighter',

  // colorpicker style
  'colorpicker.button.border': '0px',
  'colorpicker.title.color': '#000',
  'header.display': 'none',
};

export const checkInCollection = (videos = [], post_id = '') => {
  // return collection_id when video is in collection videos
  const index = videos.findIndex((item) => item.video_id === post_id);
  if (index > -1) {
    return videos[index]?.collection_id;
  }
  return 0;
};

export const checkInInstagramCollection = (posts = [], id = '') => {
  // return collection_id when post is in collection instagram
  if (!posts || posts.length === 0) return 0;
  const index = posts.findIndex((item) => item.id === id);
  if (index > -1) {
    return posts[index]?.collection_id;
  }
  return 0;
};

export const getPathVideo = async (id) => {
  const res = await Client.get(`/get-video-link/${id}`);
  return res.data.data || '';
};

export const searchEventByDate = (date, scheduleEvents = []) => {
  const convertedDate = moment(date).format('MM-DD');
  const search = scheduleEvents.find(
    (event) => moment(event.event_date).format('MM-DD') === convertedDate
  );
  return search;
};

export const isDevMode = () => {
  return typeof process.env.API_URL === 'string' && process.env.API_URL.includes('v3.api');
};

