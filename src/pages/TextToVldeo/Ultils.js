
// import style1 from "../../assets/images/art_styles/anime.png";
// import style2 from "../../assets/images/art_styles/aztec.png";
// import style3 from "../../assets/images/art_styles/chinese_donghua.png";
// import style4 from "../../assets/images/art_styles/chinese_ink_painting.png";
// import style5 from "../../assets/images/art_styles/cyberpunk.png";
// import style6 from "../../assets/images/art_styles/disney_pixar.png";
// import style7 from "../../assets/images/art_styles/dreamworks.png";
// import style8 from "../../assets/images/art_styles/geometric_style.png";
// import style9 from "../../assets/images/art_styles/ghibli.png";
// import style10 from "../../assets/images/art_styles/illumination.png";
// import style11 from "../../assets/images/art_styles/low_poly.png";
// import style12 from "../../assets/images/art_styles/pencil_drawing.png";
// import style13 from "../../assets/images/art_styles/pixel_art.png";
// import style14 from "../../assets/images/art_styles/sketch.png";
// import style15 from "../../assets/images/art_styles/steampunk.png";
// import style16 from "../../assets/images/art_styles/synthwave.png";
// import style17 from "../../assets/images/art_styles/watercolor.png";
// import style18 from "../../assets/images/art_styles/realperson.png";

// import VideoGen_Generative_Thumbnail from '../../assets/images/videogen_generative_thumbnail.png';
// import VideoGen_IStock_Thumbnail from '../../assets/images/videogen_istock_thumbnail.png';
import { OK } from "../../configs";
import { TextToVideoService } from "../../services/TextToVideo";
import { setCompletedTotalCount, setCompletedTotalPage, setLoadingCompleted, setLoadingPending, setVideosCompleted, setVideosPending } from "../../store/actions/TextToVideo";

export const TABS = {
    GENERATE: "GENERATE",
    PENDING: "PENDING",
    COMPLETED: "COMPLETED"
}

export const SCREEN_RATIO = {
    SQUARE: {
        value: 0,
        name: "Vuông",
    },
    LANDSCAPE: {
        value: 1,
        name: "Ngang",
    },
    PORTRAIT: {
        value: 2,
        name: "Dọc",
    }
};

export const CLIP_PACE = {
    FAST: {
        value: 1,
        name: "Nhanh",
    },
    MEDIUM: {
        value: 2,
        name: "Vừa",
    },
    SLOW: {
        value: 3,
        name: "Chậm",
    },
    VERYSLOW: {
        value: 4,
        name: "Rất chậm",
    }
};
export const FONT_SIZE = {
    TINY: {
        value: 1,
        name: "Rất nhỏ",
    },
    SMALL: {
        value: 2,
        name: "Nhỏ",
    },
    MEDIUM: {
        value: 3,
        name: "Vừa",
    },
    LARGE: {
        value: 4,
        name: "Lớn",
    },
    VERYLARGE: {
        value: 5,
        name: "Rất lớn",
    },
}
export const VERTICAL_ALIGNMENT = {
    TOP: {
        value: 1,
        name: "TOP",
    },
    CENTER: {
        value: 2,
        name: "CENTER",
    },
    BOT: {
        value: 3,
        name: "BOT",
    }
}
export const HORIZONTAL_ALIGNMENT = {
    LEFT: {
        value: 1,
        name: "LEFT",
    },
    CENTER: {
        value: 2,
        name: "CENTER",
    },
    RIGHT: {
        value: 3,
        name: "RIGHT",
    }
}
export const MODE = {
    STANDARDSTOCK: {
        name: "Thư viện iStock",
        value: 0,
        // icon: VideoGen_IStock_Thumbnail
    },
    GENERATIVE: {
        name: "Ảnh hoạt hình AI",
        value: 1,
        // icon: VideoGen_Generative_Thumbnail
    },
    // ISTOCK: {
    //   name: "Thư viện iStock",
    //   value: 2,
    // //   icon: VideoGen_IStock_Thumbnail
    // }
}

export const STYLES = {
    REALPERSON: {
        name: "Người thật",
		prompt: "Yêu cầu phong cách giống người thật 100%",
        // picture: style18,
    },
    ANIME: {
        name: "Hoạt hình Nhật Bản (Anime)",
		prompt: "Hoạt hình Nhật Bản (Anime)",
        // picture: style1,
    },
    AZTEC: {
        name: "Aztec",
		prompt: "Aztec",
        // picture: style2,
    },
    CHINESE_DONGHUA: {
        name: "Hoạt hình Trung Quốc (Donghua)",
		prompt: "Hoạt hình Trung Quốc (Donghua)",
        // picture: style3,
    },
    CHINESE_INK_PAINTING: {
        name: "Tranh thuỷ mặc",
		prompt: "Tranh thuỷ mặc",
        // picture: style4,
    },
    CYBERPUNK: {
        name: "Cyberpunk",
		prompt: "Cyberpunk",
        // picture: style5,
    },
    DISNEY_PIXAR: {
        name: "Hoạt hình Disney/Pixar",
		prompt: "Hoạt hình Disney/Pixar",
        // picture: style6,
    },
    DREAMWORKS: {
        name: "Hoạt hình DreamWorks",
		prompt: "Hoạt hình DreamWorks",
        // picture: style7,
    },
    GEOMETRIC_STYLE: {
        name: "Hình học (Geometric Style)",
		prompt: "Hình học (Geometric Style)",
        // picture: style8,
    },
    GHIBLI: {
        name: "Hoạt hình Ghibli",
		prompt: "Hoạt hình Ghibli",
        // picture: style9,
    },
    ILLUMINATION: {
        name: "Hoạt hình Illumination",
		prompt: "Hoạt hình Illumination",
        // picture: style10,
    },
    LOW_POLY: {
        name: "Low Poly",
		prompt: "Low Poly",
        // picture: style11,
    },
    PENCIL_DRAWING: {
        name: "Vẽ chì",
		prompt: "Vẽ chì",
        // picture: style12,
    },
    PIXEL_ART: {
        name: "Nghệ thuật Pixel",
		prompt: "Nghệ thuật Pixel",
        // picture: style13,
    },
    SKETCH: {
        name: "Phác thảo",
		prompt: "Phác thảo",
        // picture: style14,
    },
    STEAMPUNK: {
        name: "Steampunk",
		prompt: "Steampunk",
        // picture: style15,
    },
    SYNTHWAVE: {
        name: "Synthwave",
		prompt: "Synthwave",
        // picture: style16,
    },
    WATERCOLOR: {
        name: "Tranh màu nước",
		prompt: "Tranh màu nước",
        // picture: style17,
    },
};

export const LOGO_POSITION = {
    TOP_LEFT: {
        value: 1,
        name: "Trên - Trái",
    },
    TOP_RIGHT: {
        value: 2,
        name: "Trên - Phải",
    },
    BOT_LEFT: {
        value: 3,
        name: "Dưới - Trái",
    },
    BOT_RIGHT: {
        value: 4,
        name: "Dưới - Phải",
    }
}


export const parseVideoToPost = (video) => {
    var parsed = {
        post_id: video.id,
        post_text: video.setting.script,
        thumbnail: video.thumbnail_url,
        user_id: video.user_id,
        media_url: video.video_url,
        media_type: "video",
        source_type: "video_ai",
        content_id: video.id,
        videos: [
            video.video_url
        ],
        is_reels: (video.setting.screen_ratio == 2 && video.duration < 90 && video.duration > 0),
    }
    return parsed;
}

export const fetchCompletedVideos = async (dispatch, page, isLoadingEffect) => {
    if (isLoadingEffect) {
        dispatch(setLoadingCompleted(true));
    }
    try {
        const res_completed = await TextToVideoService.getCompletedVideos(page);
        if (res_completed.status == OK) {
            dispatch(setVideosCompleted(res_completed.data.data.data));
            dispatch(setCompletedTotalPage(res_completed.data.data.last_page));
            dispatch(setCompletedTotalCount(res_completed.data.data.total));
        }
    }
    finally {
        if (isLoadingEffect) {
            dispatch(setLoadingCompleted(false));
        }
    }
}


export const fetchPendingVideos = async (dispatch, isLoadingEffect) => {
    if (isLoadingEffect) {
        dispatch(setLoadingPending(true));
    }
    try {
        const res_pending = await TextToVideoService.getPendingVideos();
        if (res_pending.status == OK) {
            dispatch(setVideosPending(res_pending.data.data));
        }
    }
    finally {
        if (isLoadingEffect) {
            dispatch(setLoadingPending(false));
        }
    }
}
