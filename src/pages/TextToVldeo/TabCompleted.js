import { useEffect } from "react";
import React from 'react';
import { TextToVideoService } from "../../services/TextToVideo";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import LoadingApp from "../../components/LoadingApp";
import { useDispatch, useSelector } from "react-redux";
import { setContentDetailToShow } from "../../store/actions/Contents/contentActions";
import { setCurrentDateTime, setIsShowFinalStep, setScheduleWaitingList, setSelectedScheduleContent, setShowSourceIdeasPopup } from "../../store/actions/Schedules";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { setCompletedCurrentPage } from "../../store/actions/TextToVideo";


import RemoveIcon from "../../assets/images/icon/remove-icon.png";
import DownloadIcon from "../../assets/images/icon/download-icon-round.png";
import { FiCalendar, FiEye } from "react-icons/fi";
import { fetchCompletedVideos, parseVideoToPost } from "./Ultils";
import addIcons from '../../assets/images/icon/create-content/add.png';
import { now } from "lodash";

export const ParentType = {
    TextToVideo: "TextToVideo",
    SourceIdeas: "SourceIdeas",
    SourceIdeasAuto: "SourceIdeasAuto",
}

const TabCompleted = ({ parent, handleAddToWaitingList = null }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { isLoadingCompleted, videosCompleted, videosPending, completedCurrentPage, completedTotalPage, completedTotalCount } = useSelector((state) => state.textToVideo);
    const { autoWaitingList } = useSelector((state) => state.schedules);

    const handleZoomVideo = (item) => {
        dispatch(
            setContentDetailToShow({
                post_text: item.setting.script,
                medias: [''],
                isCreatedContent: true,
                media_url: item.video_url,
                media_type: "video",
                user_screenname: "_",
                videogen_settings: item.setting,
            })
        );
    }
    const handleScheduleVideo = (video) => {
        dispatch(
            setSelectedScheduleContent(parseVideoToPost(video))
        );
        dispatch(setCurrentDateTime());
        dispatch(setIsShowFinalStep(true));
        dispatch(setShowSourceIdeasPopup(false));
        history.push('/lich-dang-bai');
    }
    const handleDownloadVideo = (videoUrl, fileName) => {
        const link = document.createElement("a");
        link.href = videoUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const handleScheduleSelectAll = () => {
        dispatch(
            setScheduleWaitingList({
                ...autoWaitingList,
                // contents: dataCompletedVideos.map((video, index) => {
                //     return parseVideoToPost(video)
                // }),
                contents: videosCompleted.map((video) => parseVideoToPost(video)),

                source_type: 'video_ai',
            })
        );
    };
    const handleScheduleUnSelectAll = () => {
        dispatch(
            setScheduleWaitingList({
                ...autoWaitingList,
                contents: [],
                source_type: 'video_ai',
            })
        );
    };


    const handleDeleteVideo = async (id) => {
        confirmAlert({
            title: `Bạn có chắc chắn muốn xóa video này? #${id}`,
            message: 'Video đã xóa sẽ không thể khôi phục!',
            buttons: [
                {
                    label: 'Huỷ',
                    color: 'green',
                    onClick: () => { },
                },
                {
                    label: 'Xoá',
                    color: 'red',
                    onClick: async () => {
                        await TextToVideoService.deleteVideos(id);
                        toast.success("Xoá thành công");
                        fetchCompletedVideos(dispatch, completedCurrentPage, true);
                    },
                },
            ],
            overlayClassName: 'large-confirmation',
        });
    }


    useEffect(() => {
        fetchCompletedVideos(dispatch, completedCurrentPage, true);
        console.log(videosCompleted)
    }, [])

    /* Fetch dữ liệu khi paging COMPLETED*/
    useEffect(() => {
        fetchCompletedVideos(dispatch, completedCurrentPage, true);
    }, [completedCurrentPage]);
    return (
        <div>
            {/* Chọn tất cả và bỏ chọn cho lên lịch tự động */}
            {parent === ParentType.SourceIdeasAuto &&
                <div className="flex gap-2 items-center mb-2 z-10 bg-white py-2 sticky border-b top-0">
                    <div className="actions">
                        <button
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-3 text-blue-600 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 font-bold mr-1"
                            onClick={() => handleScheduleSelectAll()}
                        >
                            Chọn toàn bộ
                        </button>
                        <button
                            className="border-2 border-gray-200 bg-gray-100 hover:bg-blue-50 py-3 px-4 text-gray-500 rounded-md"
                            onClick={() => handleScheduleUnSelectAll()}
                        >
                            Bỏ chọn
                        </button>
                    </div>
                    <div className="summary mb-2 ml-auto text-base">
                        <span>Số bài viết đã chọn: </span>
                        <span className="font-bold">
                            {autoWaitingList?.contents?.length || 0}
                        </span>
                    </div>
                </div>
            }
            {/* Tạm thời không xoá */}
            {/* <div className="w-full flex items-center">
                <span className="w-full text-center text-base italic font-bold text-red-500">Vui lòng TẢI VIDEO về máy của bạn, video sẽ tự động xóa sau khi tạo 10 ngày</span>
            </div> */}

            {(!isLoadingCompleted && videosCompleted.length == 0) &&
                <div className="mt-6 w-full flex items-center">
                    <span className="w-full text-center text-base italic font-bold text-gray-800">Chưa có video nào!</span>
                </div>
            }
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {isLoadingCompleted && <LoadingApp className="flex-col h-32 items-center" />}
                {!isLoadingCompleted && videosCompleted.map((item, index) => {
                    const isSelected = autoWaitingList.contents.filter(
                        x => x.source_type == 'video_ai'
                            && x.videos[0] == item.video_url
                    ).length > 0;
                    return (
                        <div key={index} className={`bg-white shadow-md p-2 rounded-md relative group h-72 flex flex-col ${isSelected ? "border-green-700 border-4 bg-green-500" : "bg-gray-100"}`}>
                            <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                                <img alt="" className="w-full h-full object-contain" src={item.thumbnail_url} />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md" >
                                    <ul className="actions flex flex-col gap-4">
                                        <li>
                                            <button className="gap-2 p-2 flex items-center cursor-pointer text-base font-medium text-white bg-black bg-opacity-0 hover:bg-opacity-100 transition-all duration-200 ease-linear rounded-md"
                                                onClick={() => handleZoomVideo(item)}>
                                                <FiEye className="text-white text-2xl" />
                                                <span className="text-xs">Xem</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button className="gap-2 p-2 flex items-center cursor-pointer text-base font-medium text-white bg-black bg-opacity-0 hover:bg-opacity-100 transition-all duration-200 ease-linear rounded-md"
                                                onClick={() => handleScheduleVideo(item)}>
                                                <FiCalendar className="text-white text-2xl" />
                                                <span className="text-xs">Lên lịch</span>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <div className="absolute left-2 top-2 bg-gray-700 bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                    {item.duration}s
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-sm line-clamp-3">#{item.id} - {item.setting.script}</h3>
                                <div className="w-full flex justify-between">
                                    <p className="absolute left-2 bottom-2 text-xs italic text-gray-600">
                                        {new Date(item.created_at).toLocaleString()}
                                    </p>
                                    {/* Tạm thời không xoá */}
                                    {/* Thời gian còn lại */}
                                    {/* <p className="text-xs font-bold italic text-red-500">
                                        {`Còn lại ${Math.max(0, Math.ceil((new Date(item.created_at).getTime() + 10 * 24 * 60 * 60 * 1000 - Date.now()) / (24 * 60 * 60 * 1000)))} ngày`}
                                    </p> */}
                                </div>
                            </div>
                            <div className="absolute right-3 top-3 flex gap-1 items-center">
                                {parent === ParentType.SourceIdeas &&
                                    <button className={`px-1 py-1 rounded-lg hover:bg-white`}
                                        onClick={() => handleScheduleVideo(item)}>
                                        <img src={addIcons} alt="Add" className="w-8 h-8 inline-block" />
                                    </button>
                                }
                                {parent === ParentType.SourceIdeasAuto &&
                                    <button className={`px-2 py-1 text-base text-white rounded-md hover:bg-gray-500 ${isSelected ? "bg-yellow-400" : "bg-green-500"}`}
                                        onClick={() => handleAddToWaitingList('video_ai', parseVideoToPost(item))}>
                                        {isSelected ? "Huỷ" : "Chọn"}
                                    </button>
                                }
                                {parent === ParentType.TextToVideo &&
                                    <button className="" onClick={() => handleDownloadVideo(item.video_url, `${item.file_id}.mp4`)}>
                                        <img src={DownloadIcon} alt="Download" className="w-8 h-8" />
                                    </button>
                                }
                                {parent === ParentType.TextToVideo &&
                                    <button onClick={(e) => handleDeleteVideo(item.id)}>
                                        <img src={RemoveIcon} alt="Remove" className="w-8 h-8" />
                                    </button>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
                <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    disabled={completedCurrentPage === 1}
                    onClick={() => dispatch(setCompletedCurrentPage(completedCurrentPage - 1))}
                >
                    Trước
                </button>
                <span className="px-4 py-2 text-gray-700">
                    Trang {completedCurrentPage} / {completedTotalPage}
                </span>
                <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    disabled={completedCurrentPage >= completedTotalPage}
                    onClick={() => dispatch(setCompletedCurrentPage(completedCurrentPage + 1))}
                >
                    Tiếp
                </button>
            </div>
        </div>

    );
}
export default TabCompleted;