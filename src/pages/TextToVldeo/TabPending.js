import { useState, useEffect } from "react";
import React from 'react';
import { TextToVideoService } from "../../services/TextToVideo";
// import loadingIcon from '../../assets/images/loading/loading.gif';
import LoadingApp from "../../components/LoadingApp";
import { OK } from "../../configs";
import { fetchPendingVideos } from "./Ultils";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { now } from "moment";


const TabPending = ({ }) => {
    const dispatch = useDispatch();
    const { isLoadingPending, videosPending } = useSelector((state) => state.textToVideo);

    // Initial data
    useEffect(() => {
        fetchPendingVideos(dispatch, true);
    }, []);

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
                        fetchPendingVideos(dispatch, true);
                    },
                },
            ],
            overlayClassName: 'large-confirmation',
        });
    }

    return (
        <div>
            <div className="space-y-4">
                {(!isLoadingPending && videosPending.length == 0) &&
                    <div className="w-full flex items-center">
                        <span className="w-full text-center text-base italic font-bold text-gray-800">Chưa có video nào!</span>
                    </div>
                }
                {isLoadingPending ? <LoadingApp />
                    : videosPending.map((item, index) => (
                        <div key={index} className="flex items-center bg-white shadow-md p-4 rounded-md w-full relative">
                            {/* Ảnh hoặc trạng thái tải */}
                            <div className="w-24 h-24 min-w-24 min-h-24 bg-gray-300 flex items-center justify-center">
                                {/* { *<img src={loadingIcon} className="max-w-8" alt="Loading" /> *} */}
                            </div>

                            {/* Thông tin video */}
                            <div className="ml-4 w-full">
                                <h3 className="font-bold text-sm line-clamp-2">#{item.id} - {item.setting.script}</h3>
                                <p className="text-xs italic text-gray-600">{new Date(item.created_at).toLocaleString()}</p>

                                {/* Thanh tiến trình */}
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>

                                {/* Trạng thái */}
                                {item.reason && (
                                    <p className="text-base text-yellow-500 mt-2">Trạng thái: {item.reason}</p>
                                )}
                            </div>

                            {/* Nút xóa hiển thị khi hover */}
                            <div className="w-24 text-center items-center">
                                <button
                                    className="px-3 py-3 bg-red-500 text-base text-white rounded-md hover:bg-red-700"
                                    onClick={() => handleDeleteVideo(item.id)}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
export default TabPending;