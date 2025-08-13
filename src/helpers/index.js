// @ts-ignore
import ContentNoImage from '../assets/images/content-no-image.png';

export const replaceHighlight = function (content, find) {
  for (var i = 0; i < find.length; i++) {
    var regex = new RegExp(find[i], 'ig');
    content = content?.replace(regex, function (a, b) {
      const itemRand = Math.floor(Math.random() * 10000) + 1000;
      return (
        '<span className="highlight vpcs-keyword" data-target="item-' +
        itemRand +
        '" data-index="' +
        i +
        '" data-start="' +
        b +
        '"> ' +
        a +
        ' </span>'
      );
    });
  }
  return content;
};

export const getFanpageAvatar = (fanpage_id) => {
  // return `https://s3-hcm1-r1.longvan.net/fbapi/avatar_cover_uid/${fanpage_id}.jpg`;
  return `https://storage.googleapis.com/kingcontent_fb_cdn/fanpage_avatar/${fanpage_id}.jpg`;
};

export const breakWord = (texts) => {
  return texts ? texts
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
    .replace(/&nbsp;/gi, ' ') : '';
};

export const handleSelectSort = (value, key, index) => {
  switch (value) {
    case '1':
      return `&orders[${index}][sort]=${key}&orders[${index}][dir]=asc`;
    case '2':
      return `&orders[${index}][sort]=${key}&orders[${index}][dir]=desc`;
    default:
      break;
  }
};

export const convertInstagramLink = (url, isGcs = false) => {
  if (!url) return '';
  return `${process.env.API_URL}/media/bypass-cors?url=${encodeURIComponent(
    url
  )}&type=image`;
  // return `https://phosphor.ivanenko.workers.dev/?url=${encodeURIComponent(url)}`;
};

export const convertVideoLink = (url) => {
  if (!url) return '';
  const baseUrl = `${process.env.API_URL}/media/bypass-cors?type=video&url=`;
  return baseUrl + encodeURIComponent(url);
};

export const maskEmail = (email) => {
  const [localPart, domain] = email.split('@');
  if (localPart.length > 1) {
    const maskedLocalPart = `${localPart[0]}${'*'.repeat(
      localPart.length - 2
    )}${localPart[localPart.length - 1]}`;
    return `${maskedLocalPart}@${domain}`;
  }
  return email; // Return the email as is if it's too short to mask
};

export const getScheduleSourceLink = (scheduleContent) => {
  const { source_type = '', feed_name = '', content_id = '' } = scheduleContent;
  let destinationLink = '';
  switch (source_type) {
    case 'tiktok':
      destinationLink = `https://www.tiktok.com/@${feed_name}/video/${content_id}`;
      break;

    case 'douyin':
      destinationLink = `https://www.douyin.com/video/${content_id}`;
      break;

    case 'threads':
      destinationLink = `https://threads.net/@${feed_name}/post/${content_id}`;
      break;

    case 'instagram':
      destinationLink = `https://www.instagram.com/@${feed_name}/post/${content_id}`;
      break;

    case 'user':
      destinationLink = '#';
      break;

    default:
      destinationLink = `https://www.facebook.com/${content_id}`;
      break;
  }
  return destinationLink;
};

export const getNoImage = () => {
  return ContentNoImage;
};
