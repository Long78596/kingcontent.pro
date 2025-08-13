import moment from 'moment';

export const destructCategories = (categories) => {
  const newData = categories.map((item, index) => {
    const { name, id, posts_count = 0, parent = null } = item;
    let parentOldId = 0;
    if (parent) {
      parentOldId = parent?.old_id || 0;
    }
    return {
      name,
      id,
      type: 'system',
      parent_id: parentOldId,
      keywords: [],
      total: posts_count || Math.floor(Math.random() * 10000) + 1000,
    };
  });
  return newData;
};

export const defaultSuggestList = [
  {
    name: 'Đang thịnh hành',
    type: 'trending',
    total: Math.floor(Math.random() * 10000) + 1000,
  },
  {
    name: 'Đối thủ',
    type: 'special',
    total: Math.floor(Math.random() * 10000) + 1000,
  },
  {
    name: 'Đã thích',
    type: 'saved',
    total: Math.floor(Math.random() * 10000) + 1000,
  },
  {
    name: 'Đã tạo',
    type: 'created',
    total: Math.floor(Math.random() * 10000) + 1000,
  },
  {
    name: 'Bán hàng',
    type: 'sale',
    total: Math.floor(Math.random() * 10000) + 1000,
  },
  {
    name: 'Feedback',
    type: 'feedback',
    keywords: ['feedback', 'phản hồi'],
    total: Math.floor(Math.random() * 10000) + 1000,
  },
  {
    name: 'Minigame',
    type: 'minigame',
    keywords: ['mini game', 'minigame'],
    total: Math.floor(Math.random() * 10000) + 1000,
  },
  {
    name: 'Giới thiệu công ty/chỗ làm việc',
    type: 'company',
    keywords: ['góc làm việc', 'khai trương', 'thành lập'],
    total: Math.floor(Math.random() * 10000) + 1000,
  },
];

export const destructScheduleContent = (payload) => {
  const {
    selectedScheduleContent = {},
    selectedSchedule,
    scheduleName,
    selectedDestinations,
    selectedDateTime,
    replaceContent,
    isReels = false,
    isAddSource = false,
    isAutoComment = false,
    listComments = [],
    isRandomCharactersComment = 0,
    isRandomEmojisComment = 0,
    scheduleContentId = 0,
    isRandomPresets = 0,
  } = payload;
  let groupIds = [];
  let threadsIds = [];
  let fanpageIds = [];
  let tiktokIds = [];
  selectedDestinations.map((item, idx) => {
    const { id, type } = item;
    switch (type) {
      case 'fanpage':
        fanpageIds.push(id);
        break;

      case 'group':
        groupIds.push(id);
        break;

      case 'threads':
        threadsIds.push(id);
        break;

      case 'tiktok':
        tiktokIds.push(id);
        break;

      default:
        break;
    }
  });
  let content_id = '';
  let auto_comments = [];
  if (isAutoComment && listComments.length > 0) {
    listComments.map((item, idx) => {
      const { id, message } = item;
      auto_comments.push(message);
    });
  }
  let {
    id = 0,
    cat_id = 0,
    post_id = '',
    ad_id = '',
    source_type = 'system',
    feed_username = '',
    images = [],
    videos = [],
    thumbnail = '',
    media_type = 'image',
    video_id,
    media_url = '',
  } = selectedScheduleContent;

  if (ad_id) {
    source_type = 'ads';
  }
  switch (source_type) {
    case 'ads':
      content_id = ad_id;
      break;

    case 'default':
    case 'event':
    case 'threads':
      content_id = id;
      break;

    case 'douyin':
      content_id = video_id;
      break;

    default:
      content_id = post_id;
      break;
  }
  const destructedData = {
    content_id,
    cat_id,
    date_publish: moment(selectedDateTime).format('YYYY-MM-DD HH:mm:ss'),
    group_ids: groupIds,
    fanpage_ids: fanpageIds,
    threads_ids: threadsIds,
    tiktok_ids: tiktokIds,
    source_type,
    replaced_post_text: replaceContent || '',
    before_content: '',
    after_content: '',
    is_reels: isReels,
    is_add_source: isAddSource,
    feed_name: feed_username,
    thumbnail,
    media_type:
      source_type === 'tiktok' || source_type === 'douyin'
        ? 'video'
        : media_type,
    schedule_id: selectedSchedule,
    schedule_name: scheduleName,
    is_random_emojies: 0,
    is_random_characters: 0,
    replacement: [],
    remove_all_hashtags: 0,
    images,
    videos,
    auto_comments,
    is_random_emojies_comment: isRandomCharactersComment,
    is_random_characters_comment: isRandomEmojisComment,
    is_random_presets: isRandomPresets,
    schedule_content_id: scheduleContentId,
    media_url,
  };
  return destructedData;
};

export const destructMultipleContents = (
  autoWaitingList,
  selectedSchedule,
  scheduleName,
  selectedDestinations,
  editingContents = []
) => {
  const {
    is_auto_comment = 0,
    comments = [],
    contents = [],
    source_type,
  } = autoWaitingList;

  let auto_comments = [];
  if (is_auto_comment && comments.length > 0) {
    comments.map((item) => {
      const { message } = item;
      auto_comments.push(message);
    });
  }

  // replace text/post_text from contents with editingContents
  let newContents = [];
  if (contents.length > 0) {
    newContents = contents.map((content) => {
      const { post_id = '', id = '', code = '', video_id = '' } = content;
      const editingContent = editingContents.find((item) => {
        switch (source_type) {
          case 'threads':
          case 'event':
            return item.id === id;

          case 'instagram':
            return item.id === code;

          case 'douyin':
            return item.id === video_id;

          default:
            return item.id === post_id;
        }
      });
      if (editingContent) {
        const { text } = editingContent;
        return {
          ...content,
          post_text: text,
          text,
        };
      }
      return content;
    });
  }

  const postingData = {
    ...autoWaitingList,
    contents: newContents,
    schedule_id: selectedSchedule,
    schedule_name: scheduleName,
    destinations: selectedDestinations,
    auto_comments,
  };
  return postingData;
};
