import { useState, useEffect, useRef, useMemo } from "react";
import React from 'react';
import Select from 'react-select';
import { TextToVideoService } from "../../services/TextToVideo";
import { confirmAlert } from "react-confirm-alert";
// import loadingIcon from '../../assets/images/loading/loading.gif';
import new_icon from '../../assets/images/icon/new_tag.png';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  setPrompt, setScriptLanguageCode, setScriptLength, setScriptStyle,
  setGenerateMode, setVideoStyle, setTitle, setScript, setClipPace, setScreenRatio,
  setVoiceName, setVoiceLanguage, setMusicTitle, setMusicCate, setIsCaptionVisible,
  setFontName, setFontSize, setFontBold, setFontColor, setVerticalAlignment, setHorizontalAlignment,
  setStrokeWeight, setStrokeColor, setCaptionBackgroundColor, setCaptionBackgroundOpacity, setCaptionBackgroundCorner,
  setLogoFile, setAudioFile, setLogoPosition, setOuttroFile, setOuttroDuration, setIsLoadingGenerateScript
} from "../../store/actions/TextToVideo";
import { setActiveTab } from "../../store/actions/TextToVideo";
import { MODE, STYLES, CLIP_PACE, SCREEN_RATIO, VERTICAL_ALIGNMENT, HORIZONTAL_ALIGNMENT, TABS, FONT_SIZE, LOGO_POSITION } from "./Ultils";
import { Helmet } from "react-helmet";
import { FiPlay, FiPause } from "react-icons/fi";



const TabCreateVideo = ({ handleFetchPendingCompletedVideos, dataVoices, dataFonts, dataLanguages, dataMusics, dataMusicCates, importFonts }) => {
  const dispatch = useDispatch();

  // Web state
  const [isLoadingGenerateVideo, setIsLoadingGenrateVideo] = useState(false);
  const [previewWidth, setpreviewWidth] = useState(150);
  const [previewHeight, setpreviewHeight] = useState(150);
  const [previewClassName, setPreviewClassName] = useState("");
  const [previewStyle, setPreviewStyle] = useState({});
  const [previewBackgroundStyle, setPreviewBackgroundStyle] = useState({});
  const [previewBackgroundImage, setPreviewBackgroundImage] = useState(null);
  const [titleWordCount, setTitleWordCount] = useState(0);
  const [scriptWordCount, setScripWordCount] = useState(0);
  const [audioUrlPlay, setAudioUrlPlay] = useState(null);
  const [voiceAudioUrl, setVoiceAudioUrl] = useState(null);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const voiceAudioRef = useRef(null);

  const textToVideoState = useSelector((state) => state.textToVideo);

  const {
    isLoadingGenerateScript,
    prompt,
    scriptLanguageCode,
    scriptLength,
    scriptStyle,
    generateMode,
    videoStyle,
    title,
    script,
    clipPace,
    screenRatio,
    voiceName,
    voiceLanguage,
    musicTitle,
    musicCate,
    isCaptionVisible,
    fontName,
    fontSize,
    fontBold,
    fontColor,
    verticalAlignment,
    horizontalAlignment,
    strokeWeight,
    strokeColor,
    captionBackgroundColor,
    captionBackgroundOpacity,
    captionBackgroundCorner,
    logoFile,
    audioFile,
    logoPosition,
    outtroFile,
    outtroDuration,
  } = textToVideoState;

  const handlePromptToScript = async (replaceScriptConfirmed) => {
    if (!prompt) {
      toast.error("Vui lòng nhập ý tưởng");
      return;
    }
    if (script && !replaceScriptConfirmed) {
      confirmAlert({
        title: 'Bạn sẽ mất lời thoại bên dưới',
        message: 'Lời thoại mới sẽ được tự động thay vào ô nhập lời thoại bên dưới, bạn có muốn tiếp tục không ?',
        buttons: [
          {
            label: 'Có, tiếp tục',
            color: 'green',
            onClick: () => handlePromptToScript(true),
          },
          {
            label: 'HUỶ',
            onClick: () => { },
          },
        ],
        overlayClassName: 'large-confirmation',
      });
    }
    else {
      dispatch(setIsLoadingGenerateScript(true));
      try {
        var res = await TextToVideoService.PromptToScript(prompt, scriptStyle, scriptLength, scriptLanguageCode);
        var new_script = res.data.data.answer;
        dispatch(setScript(new_script));
      }
      finally {
        dispatch(setIsLoadingGenerateScript(false));
      }
    }
  }
  const handleScriptToVideo = async () => {
    if (!script) {
      toast.error("Vui lòng nhập lời thoại");
      return;
    }
    if (scriptWordCount > 1000) {
      toast.error("Hệ thống chỉ nhận kịch bản tối đa 1,000 từ.");
      return;
    }
    setIsLoadingGenrateVideo(true);
    try {

      const settings = {
        "prompt": prompt,
        "style": scriptStyle,
        "clip_source": generateMode,
        "clip_style": videoStyle,
        "title": title,
        "script": script,
        "clip_pace": clipPace,
        "screen_ratio": screenRatio,
        "voice": {
          "name": voiceName,
          "language": voiceLanguage,
          "volume": 100,
        },
        "music": {
          "name": musicTitle,
          "cate": musicCate,
          "volume": 100,
        },
        "caption_visible": isCaptionVisible,
        "font": {
          "name": fontName,
          "size": fontSize,
          "bold": fontBold,
          "color": fontColor,
        },
        "align": {
          "vertical": verticalAlignment,
          "horizontal": horizontalAlignment,
        },
        "stroke": {
          "weight": strokeWeight,
          "color": strokeColor
        },
        "background": {
          "color": captionBackgroundColor,
          "opacity": captionBackgroundOpacity,
          "corner": captionBackgroundCorner
        },
        "logo_position": logoPosition,
        "outtro_duration": outtroDuration,
      };
      const formData = new FormData();
      formData.append("settings", JSON.stringify(settings))
      formData.append("logo", logoFile);
      formData.append("audio", audioFile);
      formData.append("outtro", outtroFile);
      const onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentCompleted);
      };
      var res = await TextToVideoService.RequestGenerateVideo(formData, onUploadProgress);
      if (res.data.success) {
        dispatch(setActiveTab(TABS.PENDING));
        handleFetchPendingCompletedVideos(true);
      }
      else {
        toast.error(res.data.message);
      }
    }
    finally {
      setIsLoadingGenrateVideo(false);
    }
  }
  const handleUploadOuttroFile = async e => {
    if (e.target.files.length <= 0)
      return;

    // Nếu là video thì kiểm tra duration
    const file = e.target.files[0];
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Video bạn chọn có dung lượng quá lớn, vui lòng chọn video khác dưới 50MB.");
      return;
    }
    if (file.type.startsWith("video")) {
      const url = URL.createObjectURL(file);
      const tempVideo = document.createElement("video");
      let duration = 0;
      try {
        tempVideo.preload = "metadata";
        tempVideo.src = url;
        tempVideo.load();
        while (tempVideo.readyState < 1)
          await new Promise(resolve => setTimeout(resolve, 100));
        duration = tempVideo.duration;
      }
      finally {
        URL.revokeObjectURL(url);
        tempVideo.remove();
      }

      // console.log("Video duration: ", duration);
      // if (duration > 3) {
      //   toast.error(`Video bạn chọn có thời lượng ${duration.toFixed(2)} giây, vượt quá giới hạn 3 giây.`);
      // }
      // else {
      dispatch(setOuttroDuration(duration));
      dispatch(setOuttroFile(file));
      // }
    }
    // Nếu là hình ảnh thì chấp nhận luôn
    else if (file.type.startsWith("image")) {
      dispatch(setOuttroDuration(5));
      dispatch(setOuttroFile(file));
    }
  }

  useEffect(() => {
    handleVoiceChange(voiceName);
  }, [dataVoices])

  /* Xem trước style caption */
  useEffect(() => {
    setPreviewClassName(`${"text-" + (["xs", "sm", "base", "lg", "xl"])[fontSize - 1]} ${fontBold ? "font-bold " : ""}`);
    setPreviewStyle({
      color: "#" + fontColor,
      fontFamily: fontName,
      WebkitTextStroke: `${strokeWeight * 0.1}px #${strokeColor}`, // Viền chữ: 2px màu đen
    });
  }, [fontName, fontSize, fontBold, fontColor, strokeColor, strokeWeight]);

  /* Xem trước style background */
  useEffect(() => {
    function hexToRgba(hex, opacity) {
      // Loại bỏ ký tự # nếu có
      hex = hex.replace(/^#/, "");

      // Trường hợp mã hex ngắn (3 ký tự) -> Chuyển sang dạng đầy đủ (6 ký tự)
      if (hex.length === 3) {
        hex = hex.split("").map((char) => char + char).join("");
      }

      // Chuyển đổi từng cặp ký tự thành giá trị RGB
      let r = parseInt(hex.substring(0, 2), 16);
      let g = parseInt(hex.substring(2, 4), 16);
      let b = parseInt(hex.substring(4, 6), 16);

      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    setPreviewBackgroundStyle({
      borderRadius: ((captionBackgroundCorner - 1) * 25) + "%",
      backgroundColor: hexToRgba(captionBackgroundColor, (captionBackgroundOpacity - 1) / 4),
    })
  }, [captionBackgroundColor, captionBackgroundCorner, captionBackgroundOpacity]);

  /* Xem trước screen ratio */
  useEffect(() => {
    var base = 16;
    if (screenRatio == SCREEN_RATIO.LANDSCAPE.value) {
      setpreviewHeight(9 * base);
      setpreviewWidth(16 * base);
    } else if (screenRatio == SCREEN_RATIO.PORTRAIT.value) {
      setpreviewHeight(16 * base);
      setpreviewWidth(9 * base);
    }
    else {
      setpreviewHeight(Math.floor((16 + 9) * base / 2));
      setpreviewWidth(Math.floor((16 + 9)) * base / 2);
    }
  }, [screenRatio]);

  /* Đổi hình ảnh nền trên vùng xem trước khi đổi chế độ định dạng video */
  useEffect(() => {
    setPreviewBackgroundImage(Object.values(MODE).filter(x => x.value == generateMode)[0].icon)
  }, [generateMode]);

  /* Tính số từ của script và title */
  useEffect(() => {
    setScripWordCount((script).split(/\s+/).filter(x => x != '').length);
  }, [script]);
  useEffect(() => {
    setTitleWordCount((title).split(/\s+/).filter(x => x != '').length);
  }, [title]);

  // Chọn nguồn phát cho trình phát audio
  useEffect(() => {
    let audio_url;
    if (audioFile) {
      audio_url = URL.createObjectURL(audioFile);
    }
    else if (musicTitle) {
      audio_url = dataMusics.filter((music) => music.title == musicTitle)[0]?.url;
    }
    else {
      audio_url = null;
    }
    setAudioUrlPlay(audio_url);
    return () => {
      if (audio_url) {
        URL.revokeObjectURL(audio_url);
      }
    };
  }, [musicCate, musicTitle, audioFile])

  // Reload trình phát audio khi dữ liệu audio thay đổi
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [audioUrlPlay]);

  const outtroFileURL = useMemo(() => {
    return outtroFile ? URL.createObjectURL(outtroFile) : null;
  }, [outtroFile]);

  // Xử lý khi chọn voice mới
  const handleVoiceChange = (selectedName) => {
    dispatch(setVoiceName(selectedName));
    const selectedVoice = dataVoices.find(x => x.name === selectedName);
    dispatch(setVoiceLanguage(selectedVoice?.language));
    // Clear object url cũ nếu có
    if (voiceAudioUrl) {
      URL.revokeObjectURL(voiceAudioUrl);
      setVoiceAudioUrl(null);
    }
    // Nếu có audio_url thì tạo object url mới
    if (selectedVoice?.audio_url) {
      setVoiceAudioUrl(selectedVoice.audio_url); // audio_url là link trực tiếp, không cần createObjectURL
    }
    setIsVoicePlaying(false);
  };

  // Play/Stop voice audio
  const handlePlayVoiceAudio = () => {
    if (!voiceAudioRef.current) return;
    if (isVoicePlaying) {
      voiceAudioRef.current.pause();
      setIsVoicePlaying(false);
    } else {
      voiceAudioRef.current.play();
      setIsVoicePlaying(true);
    }
  };

  // Khi audio kết thúc thì reset trạng thái
  useEffect(() => {
    if (!voiceAudioRef.current) return;
    const handleEnded = () => setIsVoicePlaying(false);
    voiceAudioRef.current.addEventListener("ended", handleEnded);
    return () => {
      if (voiceAudioRef?.current)
        voiceAudioRef.current.removeEventListener("ended", handleEnded);
    };
  }, [voiceAudioUrl]);

  // Khi đổi voice thì stop audio
  useEffect(() => {
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
      setIsVoicePlaying(false);
    }
  }, [voiceAudioUrl]);

  return (
    <div>
      <Helmet>
        <link href={importFonts} rel="stylesheet" />
      </Helmet>
      <div className="rounded-lg p-2 mb-4" style={{ background: "#FF9B9B" }}>
        <span className="text-xl font-bold">Vui lòng hạn chế tạo kịch bản về một nhân vật cụ thể, sản phẩm cụ thể hay bối cảnh cụ thể có thật nào đó, vì AI có thể làm sai lệch hình ảnh với thực tế!</span>
      </div>
      {/* Bước 1 - Ý tưởng viết lời thoại */}
      <div className="flex gap-4 items-center">
        <div className="w-2/3">
          <span className="text-2xl font-semibold mb-4">Bước 1 : Tạo lời thoại từ ý tưởng</span>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-12 gap-3">
        <div className="flex flex-col col-span-4 justify-end">
          <span className="text-base font-semibold">Ý tưởng</span>
          <input
            className="h-10 mt-2 border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ý tưởng..."
            type="text"
            onChange={(e) => dispatch(setPrompt(e.target.value))}
            value={prompt}
          ></input>
        </div>
        <div className="flex flex-col col-span-2 justify-end">
          <span className="text-base font-semibold">Ngôn ngữ lời thoại</span>
          <select className="h-10 mt-2 border rounded-md p-2 text-small"
            value={scriptLanguageCode}
            onChange={(e) => dispatch(setScriptLanguageCode(e.target.value))}>
            {dataLanguages.map((item) => {
              return <option value={item.code}>{`${item.language} (${item.code})`}</option>;
            })}
          </select>
        </div>
        <div className="flex flex-col col-span-2 justify-end">
          <span className="text-base font-semibold">Thời lượng</span>
          <select className="h-10 mt-2 border rounded-md p-2 text-small" onChange={(e) => dispatch(setScriptLength(Math.round(Number(e.target.value))))} value={scriptLength}>
            <option value="50">ngắn hơn 30 giây</option>
            <option value="100">30 - 60 giây</option>
            <option value="150">60 - 90 giây</option>
          </select>
        </div>
        <div className="flex flex-col col-span-2 justify-end">
          <span className="text-base font-semibold">Phong cách lời thoại</span>
          <select className="h-10 mt-2 border rounded-md p-2 text-small" onChange={(e) => dispatch(setScriptStyle(e.target.value))} value={scriptStyle}>
            <option value="Kịch tính">Kịch tính</option>
            <option value="Buồn/Cảm động">Buồn/Cảm động</option>
            <option value="Hài hước">Hài hước</option>
            <option value="Bí ẩn/Rùng rợn">Bí ẩn/Rùng rợn</option>
            <option value="Tức giận/Bức xúc">Tức giận/Bức xúc</option>
            <option value="Sốc/Bất ngờ">Sốc/Bất ngờ</option>
            <option value="Gây tranh cãi">Gây tranh cãi</option>
          </select>
        </div>
        {/* CLICK : Prompt to Script */}
        <div className="flex flex-col col-span-2 justify-end">
          <span className="text-base font-semibold"></span>
          {isLoadingGenerateScript
            ?
            <div className="py-1 px-1 rounded-md bg-blue-500 text-white flex flex-col items-center">
              {/* <img className="h-10 w-16" src={loadingIcon} /> */}
            </div>
            :
            <button className="h-10 text-center text-lg font-bold py-2 px-4 rounded-md cursor-pointer mx-2 bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg transition duration-100" onClick={() => handlePromptToScript()}>
              Tạo lời thoại
            </button>
          }
        </div>
      </div>

      {/* Bước 2 - Tạo video từ script */}
      <div className="mt-6 flex gap-4 items-center w-full">
        {/* Cột 1 */}
        <div className="flex-1 pr-4">
          {/* Dòng 1 */}
          <div className="flex justify-between items-center">
            <div className="w-2/4">
              <span className="text-2xl font-semibold mb-4">Bước 2 : Tạo video từ lời thoại</span>
            </div>
          </div>
          {/* Dòng 2 */}
          <div className="mt-3">
            <div className="mt-3 flex gap-4 items-center h-12">
              {/* Tiêu đề */}
              <input
                className="w-1/2 border rounded-md p-3 h-full focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Tiêu đề..."
                type="text"
                onChange={(e) => dispatch(setTitle(e.target.value))}
                value={title}
              ></input>
              <div className="w-1/4 text-left">
                <span className={`text-base font-semibold mb-4 ${titleWordCount > 130 && 'text-red-500'}`}>{titleWordCount > 130 && 'Hệ thống chỉ nhận tiêu đề tối đa 130 từ. Độ dài hiện tại : '} {titleWordCount}/130</span>
              </div>
              <div className="w-1/4 text-right">
                <span className={`text-base font-semibold mb-4 ${scriptWordCount > 1000 && 'text-red-500'}`}>{scriptWordCount > 1000 && 'Hệ thống chỉ nhận kịch bản tối đa 1,000 từ. Độ dài hiện tại : '} {scriptWordCount}/1000</span>
              </div>
            </div>
            {/* Lời thoại */}
            <div className="mt-3 flex gap-4 items-center h-48 relative">
              <textarea
                className="w-full border rounded-md p-3 h-full focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Nội dung kịch bản..."
                onChange={(e) => dispatch(setScript(e.target.value))}
                value={script}
                disabled={isLoadingGenerateScript}
              ></textarea>
              {isLoadingGenerateScript && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-md z-10">
                  {/* <img src={loadingIcon} alt="loading" className="h-24" /> */}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Cột 2 */}
        <div className="flex-shrink-0 w-auto flex flex-col justify-start">
          {/* Dòng 1 */}
          <div className="text-center mb-4">
            <span className="text-base font-semibold">Tỉ lệ và bố cục</span>
          </div>
          {/* Dòng 2 */}
          <div className="w-full h-64 flex items-center">
            {/* Xem trước */}
            <div className="flex items-center justify-center border border-gray-500">
              <div className={`border border-gray-500 flex ${horizontalAlignment == HORIZONTAL_ALIGNMENT.LEFT.value ? "justify-start"
                : horizontalAlignment == HORIZONTAL_ALIGNMENT.CENTER.value ? "justify-center"
                  : horizontalAlignment == HORIZONTAL_ALIGNMENT.RIGHT.value ? "justify-end" : ""}
                ${verticalAlignment == VERTICAL_ALIGNMENT.TOP.value ? "items-start"
                  : verticalAlignment == VERTICAL_ALIGNMENT.CENTER.value ? "items-center"
                    : verticalAlignment == VERTICAL_ALIGNMENT.BOT.value ? "items-end" : ""}`}
                style={{
                  width: previewWidth + "px",
                  height: previewHeight + "px",
                  backgroundImage: `url(${previewBackgroundImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div
                  className="p-0.5"
                  style={previewBackgroundStyle}
                >
                  <span
                    className={previewClassName}
                    style={previewStyle}
                  >Phụ đề</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="mt-6 flex flex-col gap-4 p-5 rounded-md">
        <div className="mt-1 grid grid-cols-5 gap-5 flex flex-col">
          {/* Cột 1 */}
          {/* Cài đặt khác */}
          <div className="flex flex-col gap-6 col-span-2">
            {/* Dòng 1 */}
            {/* Định dạng video - Giọng đọc */}
            <div className="flex gap-4">
              {/* Định dạng video */}
              <div className="w-1/3">
                <span className="text-base font-semibold">Định dạng video</span>
                <div className="flex items-center gap-4">
                  <select
                    className="w-64 border rounded-md p-2"
                    onChange={(e) => dispatch(setGenerateMode(Number(e.target.value)))}
                    value={generateMode}
                  >
                    {Object.values(MODE).map((option) => (
                      <option key={option.name} value={option.value}>{option.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Giọng đọc */}
              <div className="w-2/3">
                <span className="text-base font-semibold">Giọng đọc</span>
                <div className="flex gap-2 items-center w-full">
                  <Select className="w-full"
                    options={dataVoices.map((item) => ({
                      value: item.name,
                      label: item.name,
                      data: item
                    }))}
                    value={dataVoices.find(v => v.name === voiceName) ? {
                      value: voiceName,
                      label: voiceName,
                      data: dataVoices.find(v => v.name === voiceName)
                    } : null}
                    onChange={option => handleVoiceChange(option.value)}
                    formatOptionLabel={option => (
                      <div className="flex items-center hover:bg-gray-300 rounded p-2">
                        <span className="font-semibold">
                          {option.data.language_code === 'vi-VN' ? 'Tiếng Việt' : `(${option.data.language})`}
                        </span>
                        <span className="">: {option.data.gender === "MALE" ? "Nam" : "Nữ"}</span>
                        <span className="font-normal">- {option.data.name}</span>
                        {option.data.is_new === true && <img src={new_icon} alt="icon" className="inline-block ml-1 w-8 h-4" />}
                      </div>
                    )}
                    styles={{
                      control: (base) => ({ ...base, minHeight: 40, fontSize: 14 }),
                      option: (base, state) => ({ ...base, fontSize: 14, backgroundColor: state.isSelected ? '#e0e7ff' : '#fff', color: '#222' }),
                      singleValue: (base) => ({ ...base, fontSize: 14 })
                    }}
                    placeholder="Chọn giọng đọc..."
                    isSearchable={false}
                  />
                  {voiceAudioUrl &&
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded bg-white border border-gray-300 shadow"
                      onClick={handlePlayVoiceAudio}
                      type="button"
                      title={isVoicePlaying ? "Dừng" : "Nghe thử"}
                    >
                      {isVoicePlaying ? (
                        <FiPause className="w-8 h-8 text-red-500" />
                      ) : (
                        <FiPlay className="w-8 h-8 text-green-500" />
                      )}
                    </button>
                  }
                  <audio
                    ref={voiceAudioRef}
                    src={voiceAudioUrl}
                    style={{ display: "none" }}
                    onEnded={() => setIsVoicePlaying(false)}
                  />
                </div>
              </div>
            </div>

            {/* Dòng 2 */}
            {/* Tốc độ chuyển cảnh - Tỷ lệ khung hình */}
            <div className="flex gap-4">

              {/* Tốc độ chuyển cảnh */}
              <div className="w-1/2">
                <span className="text-base font-semibold">Tốc độ chuyển cảnh</span>
                <div className="flex gap-4 items-center">
                  <select
                    className="w-64 border rounded-md p-2 text-small"
                    onChange={(e) => dispatch(setClipPace(Number(e.target.value)))}
                    value={clipPace}
                  >
                    {Object.values(CLIP_PACE).map((option) => (
                      <option key={option.value} value={option.value}>{option.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tỷ lệ khung hình */}
              <div className="w-1/2">
                <span className="text-base font-semibold">Tỉ lệ khung hình</span>
                <div className="flex items-center gap-4">
                  <select
                    className="w-64 border rounded-md p-2"
                    onChange={(e) => dispatch(setScreenRatio(Number(e.target.value)))}
                    value={screenRatio}
                  >
                    {Object.values(SCREEN_RATIO).map((option) => (
                      <option key={option.value} value={option.value}>{option.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Dòng 3 */}
            {/* Hiển thị phụ đề */}
            <div className="flex gap-4">
              <div className="flex items-end w-64">
                <div className="w-full border rounded-md p-2 flex items-center">
                  <input type="checkbox" className="form-checkbox w-6 h-6 rounded-md mr-3" onChange={(e) => dispatch(setIsCaptionVisible(Boolean(e.target.checked)))} checked={isCaptionVisible} />
                  <label className="text-gray-700 text-base font-bold mb-1">Hiển thị phụ đề</label>
                </div>
              </div>
            </div>

            {/* Dòng 4 */}
            {/* Vị trí phụ đề - Viền phụ đề */}
            {isCaptionVisible === true &&
              <div className="flex gap-4">
                {/* Vị trí phụ đề */}
                <div>
                  {/* <label className="block text-gray-700 font-medium mb-1 text-base">Vị trí phụ đề</label> */}
                  <span className="text-base font-semibold">Vị trí phụ đề</span>
                  <div className="flex items-center gap-4">
                    {/* Vertical Alignment */}
                    <select
                      className="pr-8 border rounded-md p-2"
                      onChange={(e) => dispatch(setVerticalAlignment(Number(e.target.value)))}
                      value={verticalAlignment}
                    >
                      <option value={VERTICAL_ALIGNMENT.TOP.value}>Dọc : Trên</option>
                      <option value={VERTICAL_ALIGNMENT.CENTER.value}>Dọc : Giữa</option>
                      <option value={VERTICAL_ALIGNMENT.BOT.value}>Dọc : Dưới</option>
                    </select>

                    {/* Horizontal Alignment */}
                    <select
                      className="pr-8 border rounded-md p-2"
                      onChange={(e) => dispatch(setHorizontalAlignment(Number(e.target.value)))}
                      value={horizontalAlignment}
                    >
                      <option value={HORIZONTAL_ALIGNMENT.LEFT.value}>Ngang : Trái</option>
                      <option value={HORIZONTAL_ALIGNMENT.CENTER.value}>Ngang : Giữa</option>
                      <option value={HORIZONTAL_ALIGNMENT.RIGHT.value}>Ngang : Phải</option>
                    </select>
                  </div>
                </div>

                {/* Viền phụ đề */}
                <div>
                  <span className="text-base font-semibold">Viền chữ phụ đề</span>
                  <div className="flex gap-4 items-center">
                    <span className="text-gray-700 text-base mb-1">Độ dày</span>
                    <select className="w-12 border rounded-md p-2 text-small pl-1" onChange={(e) => dispatch(setStrokeWeight(Number(e.target.value)))} value={strokeWeight}>
                      {Array.from({ length: 9 }, (_, i) => i).map((size) => {
                        return <option key={size} value={size}>{size}</option>;
                      })}
                    </select>
                    {/* <input type="range" min='0' max='8' step='1' className="w-16 border rounded-md p-2" onChange={(e) => dispatch(setStrokeWeight(Number(e.target.value)))} value={strokeWeight} /> */}
                    <span className="text-gray-700 text-base mb-1">Màu</span>
                    <input type="color" className="w-10 h-10 border rounded-md pl-1" onChange={(e) => dispatch(setStrokeColor(e.target.value.replace("#", "")))} value={"#" + strokeColor} />
                  </div>
                </div>
              </div>
            }


            {/* Dòng 5 */}
            {/* Font phụ đề */}
            {isCaptionVisible === true &&
              <div>
                <span className="text-base font-semibold">Font chữ phụ đề</span>
                <div className="flex gap-4 items-center">
                  <select className="w-32 border rounded-md p-2 text-small" onChange={(e) => dispatch(setFontName(e.target.value))} value={fontName}>
                    {dataFonts.map((item) => {
                      return <option key={item} style={{ fontFamily: item }} value={item}>{item}</option>;
                    })}
                  </select>

                  <select className="w-24 border rounded-md p-2 text-small" onChange={(e) => dispatch(setFontSize(Number(e.target.value)))} value={fontSize} >
                    {Object.values(FONT_SIZE).map((option) => (
                      <option key={option.value} value={option.value}>{option.name}</option>
                    ))}
                  </select>
                  <div className="w-32 border rounded-md p-2 flex items-center">
                    <input type="checkbox" className="form-checkbox mr-3 w-6 h-6 rounded-md" onChange={(e) => dispatch(setFontBold(Boolean(e.target.checked)))} checked={fontBold} />
                    <span className="text-gray-700 text-base font-bold mb-1">In đậm</span>
                  </div>
                  <span className="w-8 text-gray-700 text-base mb-1">Màu</span>
                  <input type="color" className="w-10 h-10 border rounded-md" onChange={(e) => dispatch(setFontColor(e.target.value.replace("#", "")))} value={"#" + fontColor} />
                </div>
              </div>
            }


            {/* Dòng 6 */}
            {/* Background phụ đề */}
            {isCaptionVisible === true &&
              <div className="col-span-3">
                <span className="text-base font-semibold">Background phụ đề</span>
                <div className="flex gap-4 items-center">
                  <span className="w-8 text-gray-700 text-base mb-1">Màu</span>
                  <input type="color" className="w-10 h-10 border rounded-md" onChange={(e) => dispatch(setCaptionBackgroundColor(e.target.value.replace("#", "")))} value={"#" + captionBackgroundColor} />
                  <span className="text-gray-700 text-base mb-1">Độ đậm</span>
                  <select className="w-20 border rounded-md p-2 text-small pl-1" onChange={(e) => dispatch(setCaptionBackgroundOpacity(Number(e.target.value)))} value={captionBackgroundOpacity}>
                    {Array.from({ length: 5 }, (_, i) => (i + 1)).map((value) => {
                      return <option key={value} value={value}>{(value - 1) * 25}%</option>;
                    })}
                  </select>
                  <span className="text-gray-700 text-base mb-1">Bo tròn</span>
                  <select className="w-20 border rounded-md p-2 text-small pl-1" onChange={(e) => dispatch(setCaptionBackgroundCorner(Number(e.target.value)))} value={captionBackgroundCorner}>
                    {Array.from({ length: 5 }, (_, i) => (i + 1)).map((value) => {
                      return <option key={value} value={value}>{(value - 1) * 25}%</option>;
                    })}
                  </select>
                </div>
              </div>
            }

            {/* Dòng 7 */}
            {/* Upload Logo - Vị trí Logo */}
            <div className="flex gap-4">
              {/* Upload Logo */}
              <div className="col-span-3">
                <span className="text-base font-semibold">Upload Logo</span>
                {/* Input file ẩn */}
                <input type="file"
                  accept="image/*"
                  className="hidden"
                  id="upload-logo"
                  onChange={async (e) => {
                    if (e.target.files.length > 0) {
                      dispatch(setLogoFile(e.target.files[0]))
                    }
                  }}
                />
                <div
                  className="relative w-32 h-24 flex items-center rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-200"
                  onClick={() => { if (logoFile != null) dispatch(setLogoFile(null)); else document.getElementById('upload-logo').click() }}
                >
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden">
                    {logoFile ?
                      <img
                        src={URL.createObjectURL(logoFile)}
                        className="w-32 h-24 object-cover"
                      />
                      : <div className="absolute inset-0 bg-gray-400 hover:bg-gray-800 bg-opacity-50 flex items-center justify-center text-black font-bold text-lg rounded-lg">
                        Thêm logo
                      </div>
                    }
                  </div>
                  {/* Hiệu ứng hover */}
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-gray-800 bg-opacity-50 flex items-center justify-center text-white font-bold text-lg rounded-lg">
                    {logoFile ? ("Gỡ logo") : ("Thêm logo")}
                  </div>
                </div>
              </div>
              {/* Vị trí Logo */}
              <div>
                {/* <label className="block text-gray-700 font-medium mb-1 text-base">Vị trí phụ đề</label> */}
                <span className="text-base font-semibold">Vị trí Logo</span>
                <div className="flex items-center gap-4">
                  {/* Vertical Alignment */}
                  <select
                    className="pr-8 border rounded-md p-2"
                    onChange={(e) => dispatch(setLogoPosition(Number(e.target.value)))}
                    value={logoPosition}
                  >
                    {Object.values(LOGO_POSITION).map((option) => {
                      return <option value={option.value}>{option.name}</option>
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>


          {/* Cột 2 */}
          {/* Chọn nhạc */}
          <div className="flex flex-col col-span-2">
            {/* Title */}
            <div className="flex">
              <span className="text-base font-semibold">Chọn nhạc nền - </span>
              {audioFile ?
                (<div className="ml-3 flex">
                  <h3 className="font-semibold text-base text-green-700">{audioFile.name}</h3>
                  <p className="ml-3 text-base text-gray-500">file upload</p>
                </div>)
                : musicTitle ?
                  (<div className="ml-3 flex">
                    <h3 className="font-semibold text-base">{musicTitle}</h3>
                    <p className="ml-3 text-base text-gray-500">{musicCate}</p>
                  </div>)
                  : (<h3 className="ml-3 font-semibold text-base">Chưa chọn</h3>)
              }
            </div>

            {/* Audio player */}
            {audioUrlPlay && (
              <div className="mt-3 flex items-center max-w-lg">
                <audio ref={audioRef} controls className="w-3/4 h-8 ml-3 mr-3">
                  <source src={audioUrlPlay} type="audio/mpeg" />
                  Trình duyệt của bạn không hỗ trợ audio.
                </audio>

                <button
                  className="w-24 h-full text-center text-base font-bold py-2 px-3 rounded-md cursor-pointer mx-2 bg-red-500 text-white hover:bg-red-600 hover:shadow-lg transition duration-100"
                  onClick={() => { dispatch(setMusicTitle(null)); dispatch(setMusicCate(null)); dispatch(setAudioFile(null)); }}
                >
                  Xoá
                </button>
              </div>
            )}
            {/* Chọn danh mục nhạc */}
            <div className="mt-3 flex items-center max-w-lg">
              {/* Danh mục nhạc */}
              <span className="w-3/12 text-gray-700 text-base text-center mb-1">Danh mục :</span>

              <select className="w-4/12 border rounded-md text-small ml-3 mr-3" onChange={(e) => dispatch(setMusicCate(e.target.value))} value={musicCate} >
                <option value="">Tất cả</option>
                {dataMusicCates.map((cate) => (
                  <option value={cate.cate}>{cate.cate_vi}</option>
                ))}
              </select>

              {/* Nút upload file nhạc */}
              <button
                className="w-5/12 h-full text-center text-base font-bold py-2 px-3 rounded-md cursor-pointer mx-2 bg-green-500 text-white hover:bg-green-600 hover:shadow-lg transition duration-100"
                onClick={() => document.getElementById('upload-audio').click()}
              >
                Upload nhạc nền/MP3
                <input type="file" accept="audio/*" className="hidden" id="upload-audio"
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      dispatch(setAudioFile(e.target.files[0]));
                    }
                  }}
                />
              </button>
            </div>

            {/* Danh sách nhạc */}
            <div className="mt-3 w-full max-w-lg bg-white shadow-lg rounded-lg p-4 max-h-96 overflow-y-auto">
              {(!musicCate ? dataMusics : dataMusics.filter((music) => music.cate == musicCate)).map((music) => (
                <div className="p-2 w-full flex items-center">
                  <img
                    src={music.thumbnail}
                    alt={music.title}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className="">
                    <div className="ml-3 flex">
                      <h3 className="font-semibold text-base">{music.title}</h3>
                      <p className="ml-3 text-base text-gray-500">{music.cate}</p>
                    </div>
                    <audio controls className="ml-3 mr-3 h-8">
                      <source src={music.url} type="audio/mpeg" />
                      Trình duyệt của bạn không hỗ trợ audio.
                    </audio>
                  </div>
                  <button
                    className="w-24 h-full text-center text-base font-bold py-2 px-3 rounded-md cursor-pointer mx-2 bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg transition duration-100"
                    onClick={() => { dispatch(setMusicTitle(music.title)); dispatch(setMusicCate(music.cate)); dispatch(setAudioFile(null)); }}
                  >
                    Chọn
                  </button>
                </div>
              ))}
            </div>

            {/* Upload video hoặc ảnh dưới 50MB */}
            <div className="mt-6 w-full max-w-lg flex flex-col">
              <span className="text-base font-semibold">Upload clip quảng cáo của bạn cuối video (tối đa 50MB)</span>
              {outtroFile && (
                <div className="mt-3 flex items-center">
                  <span className="w-3/4 text-base text-green-700 font-semibold pr-1">{outtroFile.name} - {outtroDuration?.toFixed(1)}s - {(outtroFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                  <button
                    className="w-1/4 px-3 py-2 bg-red-500 text-white rounded text-base font-semibold hover:bg-red-600 transition duration-200"
                    onClick={e => { e.stopPropagation(); dispatch(setOuttroFile(null)); }}
                  >Xoá</button>
                </div>
              )}
              <input
                type="file"
                accept="video/*,image/*"
                className="hidden"
                id="upload-outtro"
                onChange={(e) => { handleUploadOuttroFile(e) }}
              />
              <div
                className="mt-3 w-fit h-full flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-200 mt-2 border border-dashed border-gray-400"
                onClick={() => document.getElementById('upload-outtro').click()}
              >
                {outtroFile ?
                  (outtroFile.type.startsWith("video") ? (
                    <video
                      id="outtro-video"
                      src={outtroFileURL}
                      controls
                      style={{ maxHeight: "16rem", maxWidth: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    <img
                      src={outtroFileURL}
                      alt={outtroFile.name}
                      style={{ maxHeight: "16rem", maxWidth: "100%", objectFit: "contain" }}
                    />
                  ))
                  : (
                    <span className="text-gray-500 text-sm w-full text-center p-3">Nhấn để chọn file video hoặc ảnh</span>
                  )}
              </div>
            </div>
          </div>


          {/* Cột 3 */}
          {/* Chọn phong cách video */}
          <div className="flex flex-col col-span-1">
            {generateMode == MODE.STANDARDSTOCK.value
              ?
              <span className="text-base font-bold text-red-500 italic">
                Phong cách video chỉ khả dụng với Định dạng video: Ảnh hoạt hình AI<br />
                Vui lòng chọn lại để sử dụng!
              </span>
              :
              <span className="text-base font-semibold text-black">
                Phong cách Video - {!videoStyle ? "Chưa chọn" : videoStyle}
              </span>
            }
            {/* Danh sách Phong cách */}
            <div
              style={{ maxHeight: "500px" }}
              className={`mt-3 w-full bg-white shadow-lg rounded-lg overflow-y-auto relative ${generateMode === MODE.STANDARDSTOCK.value ? "opacity-50 pointer-events-none cursor-not-allowed" : ""}`}
            >
              {Object.values(STYLES).map((style) => (
                <div className="p-2">
                  <div
                    className={`relative w-full flex items-center rounded-lg cursor-pointer transition-all duration-200 ${videoStyle === style.prompt ? "border-4 border-double border-green-500" : "hover:bg-gray-200"
                      }`}
                    onClick={() => generateMode !== MODE.STANDARDSTOCK.value && dispatch(setVideoStyle(videoStyle === style.prompt ? null : style.prompt))}
                  >
                    {/* Ảnh phong cách */}
                    <div className="relative w-full h-24 rounded-lg overflow-hidden">
                      <img
                        src={style.picture}
                        alt={style.name}
                        className="w-full h-24 object-cover"
                      />
                    </div>
                    {/* Tên phong cách */}
                    <div className={`absolute bottom-1 left-1 ${videoStyle == style.prompt ? "bg-green-500" : "bg-black bg-opacity-50"} text-white text-sm px-2 py-1 rounded`}>
                      {style.name}
                    </div>
                    {/* Hiệu ứng hover */}
                    <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-gray-800 bg-opacity-50 flex items-center justify-center text-white font-bold text-lg rounded-lg">
                      {videoStyle === style.prompt ? ("Bỏ chọn") : ("Click để chọn")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* CLICK : Script to Video */}
        <div className="mt-6 flex justify-between items-center">
          {isLoadingGenerateVideo
            ?
            <div className="w-full h-full flex flex-col items-center py-1 px-1 rounded-md mx-2 bg-blue-500 text-white">
              {progress != 100
                ?
                <span className="mt-2 text-lg font-bold">
                  Đang tải dữ liệu lên... {progress}%
                </span>
                :
                <div className="flex items-center">
                  <span className="text-lg font-bold">
                    Đang xử lý...
                  </span>
                  {/* <img className="max-h-16" src={loadingIcon} alt="Loading icon"></img> */}
                </div>
              }

            </div>
            : <button
              className="w-full h-full text-center text-lg font-bold py-4 rounded-md cursor-pointer mx-2 bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg transition duration-100"
              onClick={() => handleScriptToVideo()}
            >
              Tạo video
            </button>
          }
        </div>
      </div>
    </div>
  );
}
export default TabCreateVideo;