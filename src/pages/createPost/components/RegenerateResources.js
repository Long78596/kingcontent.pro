import React, { Fragment, useEffect, useState } from 'react';
import MenuIconFavorite from '../../../assets/images/icon/main-menu/menu-icon-favorite.png';
import TiktokLogoIcon from '../../../assets/images/tiktok_logo.png';
import Tiktok from '../../../components/Schedules/Tiktok';
import Special from './special';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { KEY_LABEL_SELECT } from '../../../reducers/createContent';
import { CreateContent } from '../../../services/createContent';
import { actionChangeSelectedIndexsSpecial, actionUpdateStep1, actionUpdateStep2 } from '../../../store/actions/createContent';
import { OK } from '../../../configs';
import { FiArrowLeftCircle } from 'react-icons/fi';
import { confirmAlert } from 'react-confirm-alert';
import { setScheduleWaitingList } from '../../../store/actions/Schedules';

export const SPECIAL = "Từ nguồn Theo dõi đặc biệt"
export const TIKTOK_RENEW_CAPTION = "Thay caption Tiktok"
export const TIKTOK_TO_TEXT = "Tiktok To Text"

const RESOURCES_ARR = [
  {
    title: SPECIAL,
    icon: MenuIconFavorite,
    type: SPECIAL,
  },
  {
    title: TIKTOK_RENEW_CAPTION,
    icon: TiktokLogoIcon,
    type: TIKTOK_RENEW_CAPTION,
  },
  {
    title: TIKTOK_TO_TEXT,
    icon: TiktokLogoIcon,
    type: TIKTOK_TO_TEXT,
  },
]

const RegenerateResources = () => {
  const [selectedSource, setSelectedSource] = useState(null);
  const createPostState = useSelector((state) => state.createPost);
  const specialContentsState = useSelector((state) => state.specialContents);
  const schedulesState = useSelector((state) => state.schedules);
  const dispatch = useDispatch();

  const onRegenerate = async () => {
    if (createPostState[KEY_LABEL_SELECT] === null) {
      toast.error('Vui lòng chọn "Phân loại content" ở bên trái màn hình!');
      return;
    }

    // Parse contents from any resource
    if (selectedSource == SPECIAL) {
      generateContent(
        specialContentsState.contents.filter((item, index) => specialContentsState.selectedIndexs.includes(index)).map((item, index) => {
          return {
            post_text: item.post_text,
            post_permalink: item.post_permalink,
            medias: item.medias,
            media_url: item.media_url,
            source_type: 'special'
          }
        })
      );
    }
    else if (selectedSource == TIKTOK_RENEW_CAPTION) {
      generateContent(
        schedulesState.autoWaitingList.contents.map((item, index) => {
          return {
            post_text: item.text,
            post_permalink: `https://tiktok.com/@/video/${item.post_id}`,
            medias: [],
            media_url: `${item.post_id}|`,
            source_type: 'tiktok_renew_caption',
            is_reels: item.is_reels ? 1 : 0
          }
        })
      );
    }
    else if (selectedSource == TIKTOK_TO_TEXT) {
      if (schedulesState.autoWaitingList.contents.some((item) => item.duration > 90)) {
        toast.error('Video bạn chọn dài hơn 90 giây. Vui lòng lọc video dưới 90 giây!');
        return;
      }
      confirmAlert({
        title: 'Xác nhận',
        message: 'Bạn muốn content mới có nội dung nào?',
        buttons: [
          {
            label: 'CHỈ VĂN BẢN',
            color: 'green',
            onClick: () => {
              generateContent(
                schedulesState.autoWaitingList.contents.map((item, index) => {
                  return {
                    post_text: item.text,
                    post_permalink: `https://tiktok.com/@/video/${item.post_id}`,
                    medias: [],
                    media_url: '',
                    source_type: 'tiktok_to_text',
                    is_reels: item.is_reels ? 1 : 0
                  }
                })
              );
            },
          },
          {
            label: 'VĂN BẢN + VIDEO',
            color: 'blue',
            onClick: () => {
              generateContent(
                schedulesState.autoWaitingList.contents.map((item, index) => {
                  return {
                    post_text: item.text,
                    post_permalink: `https://tiktok.com/@/video/${item.post_id}`,
                    medias: [],
                    media_url: `${item.post_id}|`,
                    source_type: 'tiktok_to_text',
                    is_reels: item.is_reels ? 1 : 0
                  }
                })
              );
            },
          },
          {
            label: 'HUỶ',
            onClick: () => { },
          },
        ],
        overlayClassName: 'large-confirmation',
      });
    }
  }
  const generateContent = async (contents) => {
    if (contents.length == 0) {
      toast.error('Hãy chọn content gốc bên dưới !');
      return;
    }
    var res = await CreateContent.generateContents(createPostState.planSelect.id, createPostState[KEY_LABEL_SELECT], contents)
    if (res.status === OK) {
      toast.success('Thành công, nhận content mới sau khoản một phút!');

      // chuyển hướng đến danh sách phân loại và content
      dispatch(actionUpdateStep1(false));
      dispatch(actionUpdateStep2(true));

      CreateContent.generateAContent(res.data.data.map((item, index) =>{
        return item.id;
      }));
      
      // reset state
      dispatch(
        setScheduleWaitingList({
          ...schedulesState.autoWaitingList,
          contents: [],
        })
      );
    }
    else {
      toast.error('Đã xảy ra lỗi!');
    }
  }

  const renderButtonGenerate = () => {
    return (
      <button
        className={`p-3 m-3 w-1/2 rounded-md border bg-blue-500 hover:bg-blue-700 transition-all duration-200 ease-linear cursor-pointer font-bold text-xl text-white`}
        onClick={(e) => onRegenerate()}
      >
        Tạo mới với AI
      </button>
    );
  }

  // return (
  //   <>
  //     <span className="italic text-red-600 text-base font-bold w-full flex justify-center items-center">
  //       ĐANG BẢO TRÌ, RẤT MONG NHẬN ĐƯỢC SỰ KIÊN NHẪN CỦA QUÝ KHÁCH Ạ.
  //     </span>
  //   </>
  // );
  return (
    <>
      {/* Nếu chưa chọn nguồn thì hiện danh sách nguồn */}
      {selectedSource == null ?
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 max-h-full p-2">
          {RESOURCES_ARR.map((resource, index) => (
            <div key={index}>
              <div
                className="border-2 border-gray-200 bg-gray-100 rounded-lg p-4 h-26 hover:bg-blue-50 cursor-pointer flex justify-center transition-all"
                onClick={() => setSelectedSource(resource.type)}
              >
                <img src={resource.icon} className="w-16" />
              </div>
              <p className="text-center"> {resource.title}</p>
            </div>
          ))}
        </div>
        : <>
          <div className="bg-gray-50 rounded-md text-sm overflow-hidden pt-3 pb-3 flex justify-between">
            <span className="font-bold border-l-4 border-green-500 uppercase text-base px-2">{selectedSource}</span>
            <button className="mr-4">
              <FiArrowLeftCircle size={25} color="gray" onClick={() => setSelectedSource(null)} />
            </button>
          </div>
          {selectedSource == SPECIAL ?
            <Special isMultiSelect={true} allowedContentTypes={['for_ai_generate', 'image', 'video', 'text']} additionalButton={renderButtonGenerate()} />
            : selectedSource == TIKTOK_RENEW_CAPTION ?
              <Tiktok isAuto={true} additionalButton={renderButtonGenerate()} isCreatedContent={true} />
              : selectedSource == TIKTOK_TO_TEXT ?
                <>
                  <span className="italic text-red-600 text-base font-bold w-full flex justify-center items-center">
                    Chuyển giọng nói trên video Tiktok thành văn bản. Video có độ dài tối đa 90 giây.
                  </span>
                  <Tiktok isAuto={true} additionalButton={renderButtonGenerate()} isCreatedContent={true} />
                </>
                :
                <>unknow resource</>
          }
        </>
      }
    </>
  );
}
export default RegenerateResources;