export const VIDEO_STATUS = {
  UPLOADED: 'uploaded',
  INIT: 'init',
  PENDING: 'pending',
  DOWNLOADING: 'downloading',
  EXTRACTING_AUDIO: 'extracting_audio',
  UPLOADING_AUDIO: 'uploading_audio',
  TRANSCRIBING_AUDIO: 'transcribing_audio',
  FINISHED: 'finished',
  EDITED: 'edited',
  FAILED: 'failed',
  CANCELED: 'canceled',
};

export const VIDEO_STATUS_TEXT = {
  UPLOADED: 'Đã tải lên',
  INIT: 'Đang dịch...',
  PENDING: 'Đang chờ xử lý...',
  DOWNLOADING: 'Đang tải video...',
  EXTRACTING_AUDIO: 'Đang tách âm thanh...',
  UPLOADING_AUDIO: 'Đang tải âm thanh...',
  TRANSCRIBING_AUDIO: 'Đang chuyển văn bản...',
  FINISHED: 'Đã hoàn thành chuyển đổi',
  EDITED: 'Đã chỉnh sửa',
  RENDERED: 'Đã xuất video',
  COMPLETED: 'Hoàn thành',
  DRAFT: 'Bản nháp',
};

// Backup of the original convertStatusToText function
export const convertStatusToTextBackup = (status, isRendered = false) => {
  if (isRendered) {
    return VIDEO_STATUS_TEXT.RENDERED;
  }
  switch (status) {
    case VIDEO_STATUS.UPLOADED:
      return VIDEO_STATUS_TEXT.UPLOADED;
    case VIDEO_STATUS.INIT:
      return VIDEO_STATUS_TEXT.INIT;
    case VIDEO_STATUS.PENDING:
      return VIDEO_STATUS_TEXT.PENDING;
    case VIDEO_STATUS.DOWNLOADING:
      return VIDEO_STATUS_TEXT.DOWNLOADING;
    case VIDEO_STATUS.EXTRACTING_AUDIO:
      return VIDEO_STATUS_TEXT.EXTRACTING_AUDIO;
    case VIDEO_STATUS.UPLOADING_AUDIO:
      return VIDEO_STATUS_TEXT.UPLOADING_AUDIO;
    case VIDEO_STATUS.TRANSCRIBING_AUDIO:
      return VIDEO_STATUS_TEXT.TRANSCRIBING_AUDIO;
    case VIDEO_STATUS.FINISHED:
      return VIDEO_STATUS_TEXT.FINISHED;
    case VIDEO_STATUS.EDITED:
      return VIDEO_STATUS_TEXT.EDITED;
    default:
      return VIDEO_STATUS_TEXT.INIT;
  }
};

// New function with only DRAFT and COMPLETED
export const convertStatusToText = (isCompleted = false) => {
  if (isCompleted) {
    return VIDEO_STATUS_TEXT.COMPLETED;
  }
  return VIDEO_STATUS_TEXT.DRAFT;
};

// Backup of the original getStatusBadgeStyle function
export const getStatusBadgeStyleBackup = (status) => {
  switch (status) {
    case VIDEO_STATUS.FINISHED:
      return "bg-green-100 text-green-700";
    case VIDEO_STATUS.EDITED:
      return "bg-blue-100 text-blue-700";
    case VIDEO_STATUS.UPLOADED:
      return "bg-purple-100 text-purple-700";
    case VIDEO_STATUS.PENDING:
      return "bg-yellow-100 text-yellow-700";
    case VIDEO_STATUS.INIT:
      return "bg-yellow-200 text-yellow-800";
    case VIDEO_STATUS.DOWNLOADING:
      return "bg-orange-100 text-orange-700";
    case VIDEO_STATUS.EXTRACTING_AUDIO:
      return "bg-teal-100 text-teal-700";
    case VIDEO_STATUS.UPLOADING_AUDIO:
      return "bg-indigo-100 text-indigo-700";
    case VIDEO_STATUS.TRANSCRIBING_AUDIO:
      return "bg-pink-100 text-pink-700";
    case VIDEO_STATUS.FAILED:
      return "bg-red-100 text-red-700";
    case VIDEO_STATUS.CANCELED:
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// New function with only DRAFT and COMPLETED
export const getStatusBadgeStyle = (isCompleted) => {
  if (isCompleted) {
    return "bg-green-500 text-white";
  }
  return "bg-red-500 text-white";
};