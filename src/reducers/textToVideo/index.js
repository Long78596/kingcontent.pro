// import { CLIP_PACE, HORIZONTAL_ALIGNMENT, MODE, SCREEN_RATIO, STYLES, TABS, VERTICAL_ALIGNMENT } from "../../pages/TextToVideo/Ultils";
import { CLIP_PACE, HORIZONTAL_ALIGNMENT, MODE, SCREEN_RATIO, STYLES, TABS, VERTICAL_ALIGNMENT } from "../../pages/TextToVldeo/Ultils";
 import { textToVideoActions } from "../../store/actions/TextToVideo";


const initialState = {
    activeTab: TABS.GENERATE,
    isLoadingGenerateScript: false,
    // Prompt settings
    prompt: "",
    scriptLanguageCode: "vi",
    scriptLength: 50,
    scriptStyle: "Kịch tính",
    // Video settings
    generateMode: MODE.GENERATIVE.value,
    videoStyle: STYLES.ANIME.name,
    title: "",
    script: "",
    clipPace: CLIP_PACE.MEDIUM.value,
    screenRatio: SCREEN_RATIO.PORTRAIT.value,
    voiceName: "Linh",
    voiceLanguage: "vi-VN",
    musicTitle: "",
    musicCate: null,
    isCaptionVisible: true,
    fontName: "Verdana",
    fontSize: 3,
    fontBold: true,
    fontColor: "000000",
    verticalAlignment: VERTICAL_ALIGNMENT.BOT.value,
    horizontalAlignment: HORIZONTAL_ALIGNMENT.CENTER.value,
    strokeWeight: 2,
    strokeColor: "000000",
    captionBackgroundColor: "ffff00",
    captionBackgroundOpacity: 5,
    captionBackgroundCorner: 1,
    logoFile: null,
    audioFile: null,
    logoPosition: 1,
    outtroFile: null,
    outtroDuration: null,
    // Web states
    isLoadingPending: false,
    isLoadingCompleted: false,
    videosPending: [],
    videosCompleted: [],
    completedCurrentPage: 1,
    completedTotalPage: 1,
    completedTotalCount: 0,
}

const textToVideo = (state = initialState, { type, payload }) => {
    switch (type) {
        case textToVideoActions.SET_SCRIPT: return { ...state, script: payload };
        case textToVideoActions.SET_ACTIVE_TAB: return { ...state, activeTab: payload };
        case textToVideoActions.SET_LOADING_PENDING: return { ...state, isLoadingPending: payload };
        case textToVideoActions.SET_LOADING_COMPLETED: return { ...state, isLoadingCompleted: payload };
        case textToVideoActions.SET_VIDEOS_PENDING: return { ...state, videosPending: payload };
        case textToVideoActions.SET_VIDEOS_COMPLETED: return { ...state, videosCompleted: payload };
        case textToVideoActions.SET_COMPLETED_CURRENT_PAGE: return { ...state, completedCurrentPage: payload };
        case textToVideoActions.SET_COMPLETED_TOTAL_PAGE: return { ...state, completedTotalPage: payload };
        case textToVideoActions.SET_COMPLETED_TOTAL_COUNT: return { ...state, completedTotalCount: payload };

        // Các trường mới
        case textToVideoActions.SET_PROMPT: return { ...state, prompt: payload };
        case textToVideoActions.SET_SCRIPT_LANGUAGE_CODE: return { ...state, scriptLanguageCode: payload };
        case textToVideoActions.SET_SCRIPT_LENGTH: return { ...state, scriptLength: payload };
        case textToVideoActions.SET_SCRIPT_STYLE: return { ...state, scriptStyle: payload };
        case textToVideoActions.SET_GENERATE_MODE: return { ...state, generateMode: payload };
        case textToVideoActions.SET_VIDEO_STYLE: return { ...state, videoStyle: payload };
        case textToVideoActions.SET_TITLE: return { ...state, title: payload };
        case textToVideoActions.SET_CLIP_PACE: return { ...state, clipPace: payload };
        case textToVideoActions.SET_SCREEN_RATIO: return { ...state, screenRatio: payload };
        case textToVideoActions.SET_VOICE_NAME: return { ...state, voiceName: payload };
        case textToVideoActions.SET_VOICE_LANGUAGE: return { ...state, voiceLanguage: payload };
        case textToVideoActions.SET_MUSIC_TITLE: return { ...state, musicTitle: payload };
        case textToVideoActions.SET_MUSIC_CATE: return { ...state, musicCate: payload };
        case textToVideoActions.SET_IS_CAPTION_VISIBLE: return { ...state, isCaptionVisible: payload };
        case textToVideoActions.SET_FONT_NAME: return { ...state, fontName: payload };
        case textToVideoActions.SET_FONT_SIZE: return { ...state, fontSize: payload };
        case textToVideoActions.SET_FONT_BOLD: return { ...state, fontBold: payload };
        case textToVideoActions.SET_FONT_COLOR: return { ...state, fontColor: payload };
        case textToVideoActions.SET_VERTICAL_ALIGNMENT: return { ...state, verticalAlignment: payload };
        case textToVideoActions.SET_HORIZONTAL_ALIGNMENT: return { ...state, horizontalAlignment: payload };
        case textToVideoActions.SET_STROKE_WEIGHT: return { ...state, strokeWeight: payload };
        case textToVideoActions.SET_STROKE_COLOR: return { ...state, strokeColor: payload };
        case textToVideoActions.SET_CAPTION_BACKGROUND_COLOR: return { ...state, captionBackgroundColor: payload };
        case textToVideoActions.SET_CAPTION_BACKGROUND_OPACITY: return { ...state, captionBackgroundOpacity: payload };
        case textToVideoActions.SET_CAPTION_BACKGROUND_CORNER: return { ...state, captionBackgroundCorner: payload };
        case textToVideoActions.SET_LOGO_FILE: return { ...state, logoFile: payload };
        case textToVideoActions.SET_AUDIO_FILE: return { ...state, audioFile: payload };
        case textToVideoActions.SET_LOGO_POSITION: return { ...state, logoPosition: payload };
        case textToVideoActions.SET_OUTTRO_FILE: return { ...state, outtroFile: payload };
        case textToVideoActions.SET_OUTTRO_DURATION: return { ...state, outtroDuration: payload };
        case textToVideoActions.SET_IS_LOADING_GENERATE_SCRIPT: return { ...state, isLoadingGenerateScript: payload };

        default: return { ...state };
    }
}
export default textToVideo;