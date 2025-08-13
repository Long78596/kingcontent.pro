import React, { useEffect, useState } from 'react';
import { FaSpinner, FaThList } from 'react-icons/fa';
import { FiEdit3, FiPlayCircle, FiTag, FiX } from 'react-icons/fi';
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from 'react-icons/tb';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styledComponents from 'styled-components';
import imgIcon from '../../assets/images/icon/create-content/cloud-computing.png';
import dkIcon from '../../assets/images/icon/diskette.png';
import fbIcon from '../../assets/images/icon/facebook.png';
import prIcon from '../../assets/images/icon/preview.png';
import ContentDetail from '../../components/CategoriesContent/ContentDetail/ContentDetail';
import MyEditor from '../../components/ContentSugesstion/Editor';

import {
  KEY_EDITOR_IMAGE,
  KEY_HASH_VIDEO_OR_IMAGE,
  KEY_INDEX_IMAGE_SELECT,
  KEY_ITEM_EDIT,
  KEY_LABELS,
  KEY_LABEL_SELECT,
  KEY_NOTE,
} from '../../reducers/createContent';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ResourcesService } from '../../services/resources';
import {
  actionSelectCategory,
  createPost,
  deleteImage,
  openScreenPlan,
  updateProps,
} from '../../store/actions/createContent';
import { isObjEmpty } from '../../utils/utilityFunc';
import PopupSelectTag from './components/planCpn/popupSelectTag';
import { UPLOAD, UPLOAD_TYPE_IMAGE, UPLOAD_TYPE_VIDEO } from './utility';
import { setContentDetailToShow } from '../../store/actions/Contents/contentActions';
import { isArrayEmpty, OK } from '../../configs';
import FeedbacksForm from '../../components/KCEditor/FeedbacksForm';
import {
  changeStateFeedbacksForm,
  setCurrentFeedback,
} from '../../store/actions/editor/editorActions';
import _ from 'lodash';
import ScheduleSettings from './components/ScheduleSettings/ScheduleSettings';
import DialogImage from '../../components/ContentSugesstion/DialogImage';
import {
  setIsActivePreset,
  setSelectFacebookPreset,
} from '../../store/actions/editor/createContentActions';
const EditorStyled = styledComponents.div`
.input-post{
  height : 450px;
}
`;
const VideoStyle = styledComponents.div`
.react-player > video {
  position: absolute;
  object-fit: cover;
  height : 100px;
`;
const ImageStyled = styledComponents.div`
img{
  height : 170px !important;
  width : 100% !important;
}
`;
const Editor = ({
  collapse,
  setCollapse,
  setTitleType,
  setIsEditor,
  setIsRightImage,
  setImagesRightEditor,
}) => {
  const [videoPopup, setVideoPopup] = useState(null);
  const [isOpenSelectTag, setIsOpenSelectTag] = useState(false);
  const [isShowSchedule, setIsShowSchedule] = useState(false);
  const [imgSelect, setImgSelect] = useState('');
  const [openViewImage, setOpenViewImage] = useState(false);

  const {
    imageSelect,
    editorState,
    textContent,
    [KEY_LABEL_SELECT]: labelId,
    [KEY_LABELS]: labels,
    [KEY_NOTE]: note,
    [KEY_ITEM_EDIT]: editItem,
    [KEY_HASH_VIDEO_OR_IMAGE]: hashVideoOrImage,
    isReels,
    isSaving = false,
    selectedFacebookPreset = null,
    facebookPresets = [],
    isActivePreset,
  } = useSelector((state) => state.createPost);

  useEffect(() => {
    if (isReels) {
      dispatch(
        updateProps([{ prop: KEY_HASH_VIDEO_OR_IMAGE, value: 'video' }])
      );
    }
  }, [isReels]);

  useEffect(() => {
    if (!isObjEmpty(editItem)) {
      dispatch(setSelectFacebookPreset(editItem.preset_id));
      dispatch(setIsActivePreset(editItem.is_active_preset));
    }
  }, [editItem]);

  const contentDetailToShow = useSelector(
    (state) => state.contents.contentDetailToShow
  );
  const { isShowFeedbacksForm = false, savedFeedbacks = [] } = useSelector(
    (state) => state.editor
  );
  const dispatch = useDispatch();

  const deleteImageSelect = async (item) => {
    if (item.id && item.type !== 'designs') {
      const newArr = imageSelect.filter((_elt) => _elt.id !== item.id);
      const res = await ResourcesService.deleteFile(item.id);
      if (res.status === OK) {
        dispatch(deleteImage(newArr));
        toast.success('Xoá thành công !');
        if (newArr.length === 0) {
          dispatch(
            updateProps([
              {
                prop: KEY_HASH_VIDEO_OR_IMAGE,
                value: null,
              },
            ])
          );
        }
      }
    } else {
      const newArr = imageSelect.filter((_elt) => _elt !== item);
      dispatch(deleteImage(newArr));
      toast.success('Xoá thành công !');
      if (newArr.length === 0) {
        dispatch(
          updateProps([
            {
              prop: KEY_HASH_VIDEO_OR_IMAGE,
              value: null,
            },
          ])
        );
      }
    }
  };

  const handleCreatePost = async () => {
    if (labelId === null) {
      toast.error('Vui lòng chọn phân loại !');
      return;
    }
    const isReels = imageSelect.some(
      (_elt) => _elt.can_be_reels === 1
    );
    dispatch(createPost(false, isReels));
    dispatch(actionSelectCategory(''));
  };

  const handleSchedule = () => {
    if (labelId === null) {
      toast.error('Vui lòng chọn phân loại !');
      return;
    }
    // check if current medias has video
    imageSelect.map((_elt) => {
      const { can_be_reels = 0 } = _elt;
      if (can_be_reels === 1) {
        dispatch(
          updateProps([
            {
              prop: 'isReels',
              value: true,
            },
          ])
        );
      }
    });
    setIsShowSchedule(true);
  };

  const handleEditImage = async (_elt, index) => {
    const { type = '', feedbackId = 0 } = _elt;
    if (type === 'feedback') {
      dispatch(setCurrentFeedback(feedbackId));
      dispatch(changeStateFeedbacksForm(true));
    } else {
      dispatch(
        updateProps([
          {
            prop: KEY_EDITOR_IMAGE,
            value: _elt.json_data
              ? _elt.json_data
              : _elt.full_url
              ? _elt.full_url
              : _elt.url
              ? _elt.url
              : _elt.data_url
              ? _elt.data_url
              : _elt,
          },
          {
            prop: KEY_INDEX_IMAGE_SELECT,
            value: index,
          },
        ])
      );
      setImagesRightEditor(imageSelect);
      setIsRightImage(true);
      setIsEditor(true);
    }
  };

  const handleShowImage = (elt) => {
    setOpenViewImage(true);
    setImgSelect(elt?.full_url || elt?.url || elt?.image || elt);
  };

  const showPreviewContent = () => {
    const facebookPreset = selectedFacebookPreset
      ? facebookPresets.find((_elt) => _elt.name === selectedFacebookPreset)
      : null;
    switch (hashVideoOrImage) {
      case UPLOAD_TYPE_IMAGE:
        if (isObjEmpty(editItem)) {
          const newImages = imageSelect.map((_elt) => {
            if (_elt.full_url) {
              return _elt.full_url;
            } else if (_elt.url) {
              return _elt.url;
            } else {
              return _elt;
            }
          });
          dispatch(
            setContentDetailToShow({
              post_text: textContent,
              images: newImages,
              isCreatedContent: true,
            })
          );
        } else {
          const newImages = imageSelect.map((_elt) => {
            if (_elt.full_url) {
              return _elt.full_url;
            } else if (_elt.url) {
              return _elt.url;
            } else {
              return _elt;
            }
          });
          dispatch(
            setContentDetailToShow({
              post_text: textContent,
              images: newImages,
              isCreatedContent: true,
            })
          );
        }
        return;

      case UPLOAD_TYPE_VIDEO:
        if (isObjEmpty(editItem)) {
          const newArrVideo = imageSelect.map((video) => {
            return {
              ...video,
              video: video.url ? video.url : video,
            };
          });
          dispatch(
            setContentDetailToShow({
              post_text: textContent,
              videos: newArrVideo,
              isCreatedContent: true,
            })
          );
        } else {
          const newArrVideo = imageSelect.map((video) => {
            return {
              ...video,
              video: video.url ? video.url : video,
            };
          });
          dispatch(
            setContentDetailToShow({
              post_text: textContent,
              videos: newArrVideo,
              isCreatedContent: true,
            })
          );
        }
        return;

      case 'designs':
        const newImages = imageSelect.map((_elt) => {
          return _elt?.full_url || '';
        });
        dispatch(
          setContentDetailToShow({
            post_text: textContent,
            images: newImages,
            isCreatedContent: true,
          })
        );
        return;

      default:
        dispatch(
          setContentDetailToShow({
            post_text: textContent,
            images: [],
            isCreatedContent: true,
            preset: facebookPreset,
          })
        );
        return;
    }
  };

  const isVideo = new RegExp('https://.*mp4');

  if (contentDetailToShow) {
    return <ContentDetail />;
  }

  return (
    <div>
      {isSaving && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-9999 flex justify-center items-center">
          <div className="p-5 bg-white rounded-lg flex gap-3 items-center">
            <FaSpinner size={50} color="green" className="animate-spin" />
            <p className="text-black text-xl">
              Đang lưu bài viết, vui lòng chờ trong giây lát !
            </p>
          </div>
        </div>
      )}
      <EditorStyled className="gap-2">
        <div className="bg-gray-50 rounded-t-md  text-sm relative overflow-hidden pb-2 w-full">
          <div>
            <div className="flex justify-between items-center">
              <p className="font-bold border-l-4 border-yellow-500 uppercase text-base mb-5 mt-5">
                Trình soạn thảo content
              </p>
              <div className="pr-3 flex gap-3">
                <button onClick={() => dispatch(openScreenPlan())}>
                  <FaThList
                    size={25}
                    color="green"
                    title="Danh sách kế hoạch"
                  />
                </button>
                {collapse ? (
                  <button
                    title="Hiện công cụ hỗ trợ"
                    onClick={() => setCollapse(false)}
                  >
                    <TbLayoutSidebarLeftCollapse size={30} color="green" />
                  </button>
                ) : (
                  <button
                    title="Ẩn công cụ hỗ trợ"
                    onClick={() => setCollapse(true)}
                  >
                    <TbLayoutSidebarRightCollapse size={30} color="green" />
                  </button>
                )}
              </div>
            </div>

            <div>
              {/* <button
                className="bg-blue-500 rounded-md text-white hover:bg-red-600 p-1 ml-3"
                onClick={() => setCollapse(!collapse)}
              >
                {!collapse ? "Ẩn công cụ hỗ trợ" : 'Công cụ hỗ trợ'}
              </button> */}
              {/* <button
                className="bg-green-800 rounded-md text-white hover:bg-red-600 p-1 ml-3"
              >
                Danh sách content
              </button> */}
            </div>
          </div>
        </div>

        {textContent.length > 0 ? (
          <div className="text-right py-3 text-base font-bold">
            ( {textContent.length} kí tự )
          </div>
        ) : null}

        {/* show message when no any images and post_text is larger than 130 */}
        {isActivePreset && textContent.length > 130 ? (
          <div className="bg-red-500 text-white p-2 text-center my-2">
            <p>
              Bạn đang vượt quá {textContent.length}/130 kí tự, ảnh nền trên
              Facebook có thể sẽ bị mờ
            </p>
          </div>
        ) : null}

        <div className="bg-gray-50 rounded-b-md pb-5  text-sm relative w-full input-post">
          <div className="flex justify-center">
            <MyEditor editorState={editorState} dispatch={dispatch} />
          </div>
        </div>

        {/* show message when no any images and post_text is larger than 130 */}
        {isActivePreset && textContent.length > 130 && (
          <div className="bg-red-500 text-white p-2 text-center my-2">
            <p>
              Bạn đang vượt quá {textContent.length}/130 kí tự, ảnh nền trên
              Facebook có thể sẽ bị mờ
            </p>
          </div>
        )}

        {/* =============================== HÌNH ẢNH ===================== */}
        {imageSelect.length > 6 ? (
          <PerfectScrollbar style={{ height: '370px' }}>
            <div className={`mx-2 grid  grid-cols-3 gap-2 mt-3 mb-2`}>
              {imageSelect.map((_elt, index) => (
                <div className="group relative" key={index}>
                  <ImageStyled>
                    <img
                      key={index}
                      src={
                        _elt.full_url
                          ? _elt.full_url
                          : _elt.url
                          ? _elt.url
                          : _elt.image
                          ? _elt.image
                          : _elt
                      }
                      className={'rounded-md h-full min-w-28'}
                    />
                  </ImageStyled>

                  <div className="absolute top-0 left-0 w-full h-0 p-5 flex flex-col justify-center items-center bg-gray-700 opacity-0 group-hover:h-full group-hover:opacity-95 rounded-md duration-500">
                    <button
                      className="absolute right-1 top-1 bg-red-500 w-6 h-6 rounded-full text-white z-20"
                      onClick={() => deleteImageSelect(_elt)}
                    >
                      <FiX size={25} color="#fff" />
                    </button>
                    <div className="actions gap-2 absolute left-0 right-0 group-hover:flex mx-auto justify-center items-center flex-col">
                      <button
                        className="bg-blue-500 p-3 text-white rounded-md text-center w-24"
                        onClick={() => handleShowImage(_elt)}
                      >
                        Xem ảnh
                      </button>
                      <button
                        className="bg-blue-500 p-3 text-white rounded-md text-center w-24"
                        onClick={() => handleEditImage(_elt, index)}
                      >
                        Chỉnh sửa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PerfectScrollbar>
        ) : (
          <div
            className={`mx-2 my-4 grid ${
              (imageSelect[0]?.type && imageSelect[0]?.type === 'video') ||
              isVideo.test(imageSelect[0]) ||
              (imageSelect[0]?.type && imageSelect[0]?.type === 'video')
                ? ' grid-cols-3'
                : 'grid-cols-3'
            } gap-2`}
          >
            {imageSelect.length > 0 ? (
              imageSelect.map((_elt, index) => (
                <div className="relative group" key={index}>
                  <button
                    className="absolute right-1 top-1 bg-red-500 w-6 h-6 rounded-full text-white"
                    onClick={() => deleteImageSelect(_elt)}
                  >
                    <FiX size={25} color="#fff" />
                  </button>

                  {(_elt.type && _elt.type === 'video') ||
                  isVideo.test(_elt) ||
                  (_elt.type && _elt.type === 'video') ? (
                    <VideoStyle className="rounded-md cursor-pointer">
                      <div
                        onClick={() =>
                          setVideoPopup(_elt.url ? _elt.url : _elt)
                        }
                      >
                        <ReactPlayer
                          className="react-player rounded-md w-full cursor-pointer"
                          width={'100%'}
                          height={'140px'}
                          controls={false}
                          url={_elt.url ? _elt.url : _elt}
                          playing={false}
                        />
                      </div>
                      <button
                        className="absolute right-1 top-1 bg-red-500 w-6 h-6 rounded-full text-white"
                        onClick={() => deleteImageSelect(_elt)}
                      >
                        <FiX size={25} color="#fff" />
                      </button>
                      <div
                        className="w-20 h-20 bg-gray-400 rounded-full opacity-50 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer"
                        onClick={() =>
                          setVideoPopup(_elt.url ? _elt.url : _elt)
                        }
                      >
                        <FiPlayCircle className="w-full h-full text-white" />
                      </div>
                    </VideoStyle>
                  ) : (
                    <div className="group relative">
                      <ImageStyled>
                        <img
                          key={index}
                          src={
                            _elt.full_url
                              ? _elt.full_url
                              : _elt.url
                              ? _elt.url
                              : _elt.image
                              ? _elt.image
                              : _elt
                          }
                          className={'rounded-md h-full'}
                        />
                      </ImageStyled>

                      <div className="absolute top-0 left-0 w-full h-0 flex flex-col justify-center items-center p-5 bg-gray-700 opacity-0 group-hover:h-full group-hover:opacity-95 rounded-md duration-500">
                        <button
                          className="absolute right-1 top-1 bg-red-500 w-6 h-6 rounded-full text-white"
                          onClick={() => deleteImageSelect(_elt)}
                        >
                          <FiX size={25} color="#fff" />
                        </button>
                        <div className="actions gap-2 absolute left-0 right-0 group-hover:flex mx-auto justify-center items-center flex-col">
                          <button
                            className="bg-blue-500 p-3 text-white rounded-md text-center w-24"
                            onClick={() => handleShowImage(_elt)}
                          >
                            Xem ảnh
                          </button>
                          <button
                            className="bg-blue-500 p-3 text-white rounded-md text-center w-24"
                            onClick={() => handleEditImage(_elt, index)}
                          >
                            Chỉnh sửa
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <>
                <img
                  src={imgIcon}
                  onClick={() => setTitleType(UPLOAD)}
                  className="cursor-pointer"
                  title="Tải ảnh hoặc video lên"
                />
              </>
            )}
          </div>
        )}

        <div className="flex ml-2 gap-3 mt-3 bg-white justify-center items-center relative h-15 mb-5 p-2 rounded-lg shadow-sm">
          {/* <img src="" alt="" /> */}
          <FiEdit3 size={25} className="absolute left-4" />
          <input
            type="text"
            className="w-full border-none pl-14 h-10"
            placeholder="Điền ghi chú quan trọng vào đây ..."
            value={note}
            onChange={(e) =>
              dispatch(updateProps([{ prop: KEY_NOTE, value: e.target.value }]))
            }
          />
        </div>
        <div className="ml-2 gap-3 flex mb-3">
          <div
            onClick={() => setIsOpenSelectTag(true)}
            className="flex w-full items-center py-2 px-2 rounded-md shadow-md gap-2 cursor-pointer"
            style={{
              backgroundColor: labelId
                ? labels.find((_elt) => _elt.id === labelId)?.color
                : '#fff',
              color: labelId ? '#fff' : '#000',
            }}
          >
            <FiTag size={25} />
            <span className="font-bold">
              {labelId === null
                ? ' Phân loại content'
                : labels.find((_elt) => _elt.id === labelId)?.name}
            </span>
          </div>
        </div>
        <div className="ml-2 gap-3 flex">
          <div className="flex gap-2">
            {/^\s*$/.test(textContent) && isArrayEmpty(imageSelect) ? null : (
              <button
                onClick={showPreviewContent}
                className="bg-blue-500 p-3 text-white rounded-lg shadow-lg flex gap-2 items-center hover:bg-red-600 transform transition-all"
              >
                <img src={prIcon} className="w-4" />
                <span>Xem trước</span>
              </button>
            )}
            {!textContent || /^\s*$/.test(textContent) ? null : (
              <button
                onClick={handleCreatePost}
                className="bg-blue-500 p-3 text-white rounded-lg shadow-lg flex gap-2 items-center hover:bg-red-600 transform transition-all"
              >
                <img src={fbIcon} className="w-4" />
                <span>Lưu</span>
              </button>
            )}

            {!textContent || /^\s*$/.test(textContent) ? null : (
              <button
                className="bg-blue-500 p-3 text-white rounded-lg shadow-lg flex gap-2 items-center hover:bg-red-600 transform transition-all"
                onClick={() => handleSchedule()}
              >
                <img src={dkIcon} className="w-4" />
                <span>Đăng bài</span>
              </button>
            )}
          </div>
        </div>
      </EditorStyled>
      <PopupSelectTag isOpen={isOpenSelectTag} setOpen={setIsOpenSelectTag} />
      {isShowFeedbacksForm && <FeedbacksForm />}
      {isShowSchedule && (
        <ScheduleSettings setIsShowSchedule={setIsShowSchedule} />
      )}
      {videoPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 z-9999 flex justify-center items-center">
          <button
            className="absolute right-2 top-2"
            onClick={() => setVideoPopup(null)}
          >
            <FiX size={25} color="white" />
          </button>
          {/* center screen */}
          <div className="bg-back p-5 rounded-lg w-1/3 h-90 bg-black">
            <ReactPlayer
              className="react-player rounded-md"
              width={'100%'}
              height={'100%'}
              controls={true}
              url={videoPopup}
              playing={true}
            />
          </div>
        </div>
      )}
      <DialogImage
        open={openViewImage}
        setOpen={() => setOpenViewImage(!openViewImage)}
        imageLink={imgSelect}
      />
    </div>
  );
};

export default Editor;
