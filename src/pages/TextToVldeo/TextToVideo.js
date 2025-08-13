import React, { useState, useEffect } from "react";
import { TextToVideoService } from "../../services/TextToVideo";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import ContentDetail from "../../components/CategoriesContent/ContentDetail";
import { setActiveTab } from "../../store/actions/TextToVideo";
import { OK } from "../../configs";
import TabCreateVideo from "./TabCreateVideo";
import TabPending from "./TabPending";
import TabCompleted, { ParentType } from "./TabCompleted";
import { fetchCompletedVideos, fetchPendingVideos, TABS } from "./Ultils";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import auth from "../../utils/auth";
import VideoGenError from '../../assets/images/videogen-error.jpg'

export default function TextToVideo() {
  const dispatch = useDispatch();
  // Web states
  const [autoFetchIntervalId, setAutoFetchIntervalId] = useState(null);
  const [isMaintenance, setIsMaintenance] = useState(false);
  // Data from API
  const [dataVoices, setDataVoices] = useState([]);
  const [dataFonts, setDataFonts] = useState([]);
  const [dataLanguages, setDataLanguages] = useState([]);
  const [dataMusics, setDataMusics] = useState([]);
  const [dataMusicCates, setDataMusicCates] = useState([]);
  const [importFonts, setImportFonts] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  const history = useHistory();

  const activeTab = useSelector((state) => state.textToVideo.activeTab);

  const contentDetailToShow = useSelector(
    (state) => state.contents.contentDetailToShow
  );
  const textToVideoState = useSelector(
    (state) => state.textToVideo
  );


  const fetchPendingCompletedVideos = () => {
    fetchPendingVideos(dispatch, false);
    fetchCompletedVideos(dispatch, textToVideoState.completedCurrentPage, false);
  }

  const fetchVoices = async () => {
    try {
      const response = await TextToVideoService.getVoices();
      if (response.status === OK) {
        const voices = response.data.data;
        let vn_voices = voices.filter(x => x.language == 'vi-VN' || x.language == '🇻🇳 Vietnamese');
        let other_voices = voices.filter(x => !vn_voices.includes(x));
        let other_voices_sorted = other_voices.sort((a, b) => a.language.localeCompare(b.language));
        setDataVoices([...vn_voices, ...other_voices_sorted]);
      }
    } catch (error) {
      console.error("Error fetching voices:", error);
    }
  }

  const fetchFonts = async () => {
    try {
      const response = await TextToVideoService.getFonts();
      if (response.status === OK) {
        const fonts = response.data.data;
        setDataFonts(fonts);
        setImportFonts(`https://fonts.googleapis.com/css2?${fonts.map((item) => `family=${item}:wght@400;700`).join("&")}&display=swap`)
      }
    } catch (error) {
      console.error("Error fetching fonts:", error);
    }
  }

  const fetchLanguages = async () => {
    try {
      const response = await TextToVideoService.getLanguages();
      if (response.status === OK) {
        const languages = response.data.data;
        setDataLanguages(languages);
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  }

  const fetchMusics = async () => {
    try {
      const response = await TextToVideoService.getMusics();
      if (response.status === OK) {
        const musics = response.data.data;
        setDataMusics(musics);
        let cates = [];
        musics.forEach((item, index) => {
          if (cates.filter(x => x.cate == item.cate).length == 0)
            cates.push({ cate: item.cate, cate_vi: item.cate_vi });
        })
        setDataMusicCates(cates);
      }
    } catch (error) {
      console.error("Error fetching musics:", error);
    }
  }

  useEffect(() => {
    if (autoFetchIntervalId) clearInterval(autoFetchIntervalId);
    const isAutoFetch = false || textToVideoState.videosPending.length > 0;
    if (isAutoFetch) {
      let id = setInterval(fetchPendingCompletedVideos, 20000);
      setAutoFetchIntervalId(id)
    }
    return () => {
      if (autoFetchIntervalId) clearInterval(autoFetchIntervalId);
    };
  }, [textToVideoState.videosPending]);
  
  useEffect(() => {
    if(!isCheckingPermission) {
      if (hasPermission) {
        const initialData = async () => {
          try {
            await fetchVoices();
            await fetchFonts();
            await fetchLanguages();
            await fetchMusics();
          } catch (error) {
            console.error("Error fetching initial data:", error);
            toast.error("Lỗi khi tải dữ liệu, vui lòng thử lại sau.");
          }
        }
        initialData();
        fetchPendingVideos(dispatch, true);
        fetchCompletedVideos(dispatch, textToVideoState.completedCurrentPage, true);
      } else {
        history.push("/chua-kich-hoat-vip3");
      }
    }
  }, [hasPermission, isCheckingPermission]);
  
  useEffect(() => {
    setHasPermission(auth.isHasVip3());
    setIsCheckingPermission(false);
  
    return () => {
      setHasPermission(false);
    };
  }, []);

  if (isMaintenance) {
    return (
      <div className="min-h-screen flex justify-center bg-gray-100 p-4">
        <div className="max-w-3xl bg-white rounded-lg shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ Thông báo bảo trì</h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Sever tạo video AI tại nước ngoài đang gặp sự cố, không trả được tín hiệu. Chúng tôi đang gấp rút liên hệ để tìm hiểu lí do và khắc phục. Rất mong nhận được sự thông cảm và kiên nhẫn từ các sếp! Chúng tôi sẽ thông báo ngay khi đối tác nước ngoài phản hồi. Xin trân trọng cảm ơn!
          </p>
          <img src={VideoGenError} alt="Video Gen Error" className="w-full mx-auto mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-gray-900">
      {/* Horizontal Navbar */}

      <div className="p-4 flex justify-center sticky top-16 z-50 shadow-md rounded-md bg-white">
        <ul className="flex w-full gap-3">
          <li className={`flex-1 text-center shadow-md text-lg font-bold py-2 px-4 rounded-md cursor-pointer ${activeTab === TABS.GENERATE ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`} onClick={() => dispatch(setActiveTab(TABS.GENERATE))}>
            🎥 Tạo Video
          </li>
          <li className={`flex-1 text-center shadow-md py-2 px-4 rounded-md cursor-pointer ${activeTab === TABS.PENDING ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`} onClick={() => dispatch(setActiveTab(TABS.PENDING))}>
            <span className="text-lg font-bold">
              ⏳ Đang Chờ
            </span>
            <span className="text-base font-base ml-1">
              ({textToVideoState.videosPending?.length})
            </span>
          </li>
          <li className={`flex-1 text-center shadow-md py-2 px-4 rounded-md cursor-pointer ${activeTab === TABS.COMPLETED ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`} onClick={() => dispatch(setActiveTab(TABS.COMPLETED))}>
            <span className="text-lg font-bold">
              ✅ Hoàn Tất
            </span>
            <span className="text-base font-base ml-1">
              ({textToVideoState.completedTotalCount})
            </span>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={`my-2 ${textToVideoState.activeTab === TABS.GENERATE ? "bg-white rounded-m p-4" : "bg-transparent"}`}>
        {textToVideoState.activeTab === TABS.GENERATE ?
          <TabCreateVideo
            handleFetchPendingCompletedVideos={fetchPendingCompletedVideos}
            dataVoices={dataVoices}
            dataFonts={dataFonts}
            dataLanguages={dataLanguages}
            dataMusics={dataMusics}
            dataMusicCates={dataMusicCates}
            importFonts={importFonts}
          />
          : textToVideoState.activeTab === TABS.PENDING ?
            <TabPending />
            : textToVideoState.activeTab === TABS.COMPLETED ?
              <TabCompleted parent={ParentType.TextToVideo} />
              : null}
      </div>
      
      {contentDetailToShow && <ContentDetail />}
    </div>
  );
}
