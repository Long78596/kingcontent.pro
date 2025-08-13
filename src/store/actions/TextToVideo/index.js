export const textToVideoActions = {
    SET_IS_LOADING_GENERATE_SCRIPT: "SET_IS_LOADING_GENERATE_SCRIPT",
    SET_SCRIPT: "SET_SCRIPT",
    SET_ACTIVE_TAB: "SET_ACTIVE_TAB",
    SET_LOADING_PENDING: "SET_LOADING_PENDING",
    SET_LOADING_COMPLETED: "SET_LOADING_COMPLETED",
    SET_VIDEOS_PENDING: "SET_VIDEOS_PENDING",
    SET_VIDEOS_COMPLETED: "SET_VIDEOS_COMPLETED",
    SET_COMPLETED_CURRENT_PAGE: "SET_COMPLETED_CURRENT_PAGE",
    SET_COMPLETED_TOTAL_PAGE: "SET_COMPLETED_TOTAL_PAGE",
    SET_COMPLETED_TOTAL_COUNT: "SET_COMPLETED_TOTAL_COUNT",

    // Thêm các action type cho các trường mới
    SET_PROMPT: "SET_PROMPT",
    SET_SCRIPT_LANGUAGE_CODE: "SET_SCRIPT_LANGUAGE_CODE",
    SET_SCRIPT_LENGTH: "SET_SCRIPT_LENGTH",
    SET_SCRIPT_STYLE: "SET_SCRIPT_STYLE",
    SET_GENERATE_MODE: "SET_GENERATE_MODE",
    SET_VIDEO_STYLE: "SET_VIDEO_STYLE",
    SET_TITLE: "SET_TITLE",
    SET_CLIP_PACE: "SET_CLIP_PACE",
    SET_SCREEN_RATIO: "SET_SCREEN_RATIO",
    SET_VOICE_NAME: "SET_VOICE_NAME",
    SET_VOICE_LANGUAGE: "SET_VOICE_LANGUAGE",
    SET_MUSIC_TITLE: "SET_MUSIC_TITLE",
    SET_MUSIC_CATE: "SET_MUSIC_CATE",
    SET_IS_CAPTION_VISIBLE: "SET_IS_CAPTION_VISIBLE",
    SET_FONT_NAME: "SET_FONT_NAME",
    SET_FONT_SIZE: "SET_FONT_SIZE",
    SET_FONT_BOLD: "SET_FONT_BOLD",
    SET_FONT_COLOR: "SET_FONT_COLOR",
    SET_VERTICAL_ALIGNMENT: "SET_VERTICAL_ALIGNMENT",
    SET_HORIZONTAL_ALIGNMENT: "SET_HORIZONTAL_ALIGNMENT",
    SET_STROKE_WEIGHT: "SET_STROKE_WEIGHT",
    SET_STROKE_COLOR: "SET_STROKE_COLOR",
    SET_CAPTION_BACKGROUND_COLOR: "SET_CAPTION_BACKGROUND_COLOR",
    SET_CAPTION_BACKGROUND_OPACITY: "SET_CAPTION_BACKGROUND_OPACITY",
    SET_CAPTION_BACKGROUND_CORNER: "SET_CAPTION_BACKGROUND_CORNER",
    SET_LOGO_FILE: "SET_LOGO_FILE",
    SET_AUDIO_FILE: "SET_AUDIO_FILE",
    SET_LOGO_POSITION: "SET_LOGO_POSITION",
    SET_OUTTRO_FILE: "SET_OUTTRO_FILE",
    SET_OUTTRO_DURATION: "SET_OUTTRO_DURATION",
};

// Action creators cho các trường mới
export const setPrompt = (prompt) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_PROMPT, payload: prompt });
};
export const setScriptLanguageCode = (code) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_SCRIPT_LANGUAGE_CODE, payload: code });
};
export const setScriptLength = (length) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_SCRIPT_LENGTH, payload: length });
};
export const setScriptStyle = (style) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_SCRIPT_STYLE, payload: style });
};
export const setGenerateMode = (mode) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_GENERATE_MODE, payload: mode });
};
export const setVideoStyle = (style) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_VIDEO_STYLE, payload: style });
};
export const setTitle = (title) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_TITLE, payload: title });
};
export const setClipPace = (pace) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_CLIP_PACE, payload: pace });
};
export const setScreenRatio = (ratio) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_SCREEN_RATIO, payload: ratio });
};
export const setVoiceName = (name) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_VOICE_NAME, payload: name });
};
export const setVoiceLanguage = (lang) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_VOICE_LANGUAGE, payload: lang });
};
export const setMusicTitle = (title) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_MUSIC_TITLE, payload: title });
};
export const setMusicCate = (cate) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_MUSIC_CATE, payload: cate });
};
export const setIsCaptionVisible = (visible) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_IS_CAPTION_VISIBLE, payload: visible });
};
export const setFontName = (name) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_FONT_NAME, payload: name });
};
export const setFontSize = (size) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_FONT_SIZE, payload: size });
};
export const setFontBold = (bold) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_FONT_BOLD, payload: bold });
};
export const setFontColor = (color) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_FONT_COLOR, payload: color });
};
export const setVerticalAlignment = (align) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_VERTICAL_ALIGNMENT, payload: align });
};
export const setHorizontalAlignment = (align) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_HORIZONTAL_ALIGNMENT, payload: align });
};
export const setStrokeWeight = (weight) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_STROKE_WEIGHT, payload: weight });
};
export const setStrokeColor = (color) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_STROKE_COLOR, payload: color });
};
export const setCaptionBackgroundColor = (color) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_CAPTION_BACKGROUND_COLOR, payload: color });
};
export const setCaptionBackgroundOpacity = (opacity) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_CAPTION_BACKGROUND_OPACITY, payload: opacity });
};
export const setCaptionBackgroundCorner = (corner) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_CAPTION_BACKGROUND_CORNER, payload: corner });
};
export const setLogoFile = (file) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_LOGO_FILE, payload: file });
};
export const setAudioFile = (file) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_AUDIO_FILE, payload: file });
};
export const setLogoPosition = (pos) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_LOGO_POSITION, payload: pos });
};
export const setOuttroFile = (file) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_OUTTRO_FILE, payload: file });
};
export const setOuttroDuration = (duration) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_OUTTRO_DURATION, payload: duration });
};
export const setIsLoadingGenerateScript = (isLoading) => (dispatch) => {
    dispatch({ type: textToVideoActions.SET_IS_LOADING_GENERATE_SCRIPT, payload: isLoading });
};
export const setScript = (script) => (dispatch) => {
  dispatch({ type: textToVideoActions.SET_SCRIPT, payload: script ?? "" });
};
export const setActiveTab = (activeTab) => (dispatch) => {
  dispatch({ type: textToVideoActions.SET_ACTIVE_TAB, payload: activeTab });
}
export const setLoadingPending = (isLoading) => (dispatch) => {
  dispatch({ type: textToVideoActions.SET_LOADING_PENDING, payload: isLoading });
}
export const setLoadingCompleted = (isLoading) => (dispatch) => {
  dispatch({ type: textToVideoActions.SET_LOADING_COMPLETED, payload: isLoading });
}
export const setVideosPending = (videos) => (dispatch) => {
  dispatch({ type: textToVideoActions.SET_VIDEOS_PENDING, payload: videos });
}
export const setVideosCompleted = (videos) => (dispatch) => {
  dispatch({ type: textToVideoActions.SET_VIDEOS_COMPLETED, payload: videos });
}
export const setCompletedCurrentPage = (page) => (dispatch) => {
  dispatch({ type: textToVideoActions.SET_COMPLETED_CURRENT_PAGE, payload: page });
}
export const setCompletedTotalPage = (totalPage) => (dispatch) => {
  dispatch({ type: textToVideoActions.SET_COMPLETED_TOTAL_PAGE, payload: totalPage });
}
export const setCompletedTotalCount = (totalCount) => (dispatch) => {
  dispatch({ type: textToVideoActions.SET_COMPLETED_TOTAL_COUNT, payload: totalCount });
}