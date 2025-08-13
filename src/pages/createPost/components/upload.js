import React, { useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { FiCheckSquare, FiEdit2, FiImage, FiX } from 'react-icons/fi';
import ImageUploading from 'react-images-uploading';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionAddImage,
  resetImagesSelect,
  updateProps,
} from '../../../store/actions/createContent';
import { ResourcesService } from '../../../services/resources';
import { toast } from 'react-toastify';
import { UPLOAD_TYPE_IMAGE, UPLOAD_TYPE_VIDEO, hasVideo } from '../utility';
import { useState } from 'react';
import { isArrayEmpty, OK } from '../../../configs';
import { confirmAlert } from 'react-confirm-alert';
import {
  KEY_EDITOR_IMAGE,
  KEY_HASH_VIDEO_OR_IMAGE,
  KEY_IMAGE_SELECT,
  KEY_INDEX_IMAGE_SELECT,
  KEY_ITEM_EDIT,
} from '../../../reducers/createContent';
import { REDUX_NAME_CREATE_POST } from '../../../utils/utilityFunc';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
const Upload = ({ setIsEditor, images, setImages }) => {
  const {
    [KEY_IMAGE_SELECT]: imageSelect,
    [KEY_HASH_VIDEO_OR_IMAGE]: hashVideoOrImage,
    [KEY_ITEM_EDIT]: editItem,
  } = useSelector((state) => state[REDUX_NAME_CREATE_POST]);
  const [videos, setVideos] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isOpenPopupEdit, setIsOpenPopupEdit] = useState(false);
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      setLoadingResources(true);
      const res = await ResourcesService.getAllFile();
      if (res.status === OK) {
        setResources(res?.data?.data || []);
      }
      setLoadingResources(false);
    };
    fetchResources();
  }, []);

  const dispatch = useDispatch();
  const maxNumber = 30;
  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };
  const upload = async () => {
    if (hashVideoOrImage === UPLOAD_TYPE_VIDEO && !isArrayEmpty(imageSelect)) {
      toast.warning(
        'Không thể sử dụng nhiều video trong cùng một content, vui lòng xóa video cũ'
      );
      return;
    }
    setUploading(true);
    const newData = [...images, ...videos];
    let hasVideo = false;

    const formData = new FormData();
    newData.forEach((_elt) => {
      formData.append(
        'files',
        // @ts-ignore
        formData.append('files[]', _elt.file, _elt.file.name)
      );
    });
    const resCreateResources = await ResourcesService.uploadFile(
      formData,
      setUploadProgress
    );
    if (resCreateResources.status === OK) {
      const sliceArray = resCreateResources?.data?.data?.slice(
        0,
        newData.length
      );
      sliceArray.forEach((_elt, index) => {
        const isVideo = _elt.type === 'video';
        if (isVideo) {
          hasVideo = true;
          dispatch(
            updateProps([
              {
                prop: 'isReels',
                value: _elt.can_be_reels ? true : false,
              },
            ])
          );
        }
        dispatch(
          actionAddImage({
            data_url: _elt.url,
            url: _elt.url,
            type: isVideo ? 'video' : 'image',
          })
        );
      });
      setImages([]);
      setVideos([]);
      dispatch(
        updateProps([
          {
            prop: KEY_HASH_VIDEO_OR_IMAGE,
            value: hasVideo ? UPLOAD_TYPE_VIDEO : UPLOAD_TYPE_IMAGE,
          },
        ])
      );
      setUploading(false);
      toast.success('Tải dữ liệu thành công !');
      setResources(resCreateResources?.data?.data || []);
    }
  };
  const removeVideo = (item) => {
    const newVideo = videos.filter((_elt) => _elt.url !== item);
    setVideos(newVideo);
  };
  const handleFileVideo = (e) => {
    const file = e.target.files[0];
    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > maxSize) {
      const currentSize = (file.size / (1024 * 1024)).toFixed(2);
      toast.error(
        `Bạn đang tải lên video dung lượng ${currentSize}MB, vui lòng chọn video có dung lượng nhỏ hơn 20MB`
      );
      return;
    }

    if (file) {
      if (videos.length === 1) {
        toast.warning(
          'Hệ thống tạm thời chưa hỗ trợ sử dụng nhiều video trong cùng một bài viết, vui lòng xóa video cũ'
        );
        return;
      }
      const url = URL.createObjectURL(file);
      setVideos([...videos, { name: file.name, file: file, url: url }]);
    }
  };
  const handleChangeTab = (type) => {
    if (
      (type === 1 && !isArrayEmpty(imageSelect)) ||
      (type === 1 && !isArrayEmpty(images))
    ) {
      confirmAlert({
        title: 'Thông báo',
        message:
          'Không thể sử dụng cả ảnh và video trong cùng một content, vui lòng xóa hết ảnh !',
        buttons: [
          {
            label: 'Xoá hết ảnh',
            onClick: async () => {
              dispatch(resetImagesSelect());
              setImages([]);
              setSelectedIndex(type);
            },
          },
          {
            label: 'Không',
            onClick: () => {},
          },
        ],
      });
      return;
    }
    if (
      (type === 0 && !isArrayEmpty(imageSelect)) ||
      (type === 0 && !isArrayEmpty(videos))
    ) {
      confirmAlert({
        title: 'Thông báo',
        message:
          'Không thể sử dụng cả ảnh và video trong cùng một content, vui lòng xóa hết video !',
        buttons: [
          {
            label: 'Xoá hết video',
            onClick: async () => {
              dispatch(resetImagesSelect());
              setVideos([]);
              setSelectedIndex(type);
            },
          },
          {
            label: 'Không',
            onClick: () => {},
          },
        ],
      });
      return;
    }

    setSelectedIndex(type);
  };
  const handleEditPhoto = (photo, index) => {
    // reset redux
    dispatch(
      updateProps([
        {
          prop: KEY_EDITOR_IMAGE,
          value: null,
        },
        {
          prop: KEY_INDEX_IMAGE_SELECT,
          value: null,
        },
      ])
    );
    dispatch(
      updateProps([
        {
          prop: KEY_EDITOR_IMAGE,
          value: photo.json_data ? photo.json_data : photo.data_url,
        },
        {
          prop: KEY_INDEX_IMAGE_SELECT,
          value: index,
        },
      ])
    );
    // history.push('/chinh-sua-anh');
    setIsEditor(true);
  };

  const togglePhotoEditor = () => {
    setIsOpenPopupEdit(!isOpenPopupEdit);
  };

  const handleOnSelectResource = (resource) => {
    if (resource.type === 'image') {
      if (hasVideo(imageSelect)) {
        toast.warning(
          'Không thể sử dụng video và ảnh trong cùng một content, vui lòng xóa video cũ'
        );
        return;
      }

      dispatch(
        updateProps([
          {
            prop: KEY_HASH_VIDEO_OR_IMAGE,
            value: UPLOAD_TYPE_IMAGE,
          },
        ])
      );
      dispatch(actionAddImage(resource));
    } else {
      // only 1 video selected
      if (!isArrayEmpty(imageSelect)) {
        toast.warning(
          'Không thể sử dụng nhiều video hoặc cả video và ảnh trong cùng một content, vui lòng xóa ảnh/video cũ'
        );
        return;
      }
      dispatch(
        updateProps([
          {
            prop: KEY_HASH_VIDEO_OR_IMAGE,
            value: UPLOAD_TYPE_VIDEO,
          },
        ])
      );
      dispatch(actionAddImage(resource));
    }
  };

  const handleOnRemoveResource = async (resource) => {
    const { id, type = 'image' } = resource;
    confirmAlert({
      title: 'Thông báo',
      message: `Bạn có chắc muốn xoá ${
        type === 'image' ? 'ảnh' : 'video'
      } này không ?`,
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            toast.info('Đang xoá dữ liệu ...');
            const res = await ResourcesService.deleteFile(id);
            if (res.status === OK) {
              toast.dismiss();
              toast.success('Xoá thành công !');
              // remove this item from resources
              const newResources = resources.filter((_elt) => _elt.id !== id);
              setResources(newResources);
            } else {
              toast.dismiss();
              toast.error('Đang có lỗi xảy ra, vui lòng thử lại sau !');
            }
          },
        },
        {
          label: 'Không',
          onClick: () => {},
        },
      ],
    });
  };

  const renderUploadImage = () => {
    return (
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
        acceptType={['jpg', 'jpeg', 'png', 'svg']}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div className="upload__image-wrapper">
            <div className="grid grid-cols-4 gap-2 mb-3">
              {imageList.map((image, index) => (
                <div key={index} className="image-item relative">
                  <img
                    src={image.data_url}
                    alt=""
                    className="h-full w-full rounded-lg max-h-52 bg-cover"
                  />
                  <div
                    className="absolute grid grid-cols-2 top-0 gap-2 text-white"
                    style={{ left: '50%', transform: 'translate(-50%, 50%)' }}
                  >
                    <button
                      onClick={() => onImageUpdate(index)}
                      className="bg-white rounded-md text-black p-2 hover:bg-red-500 hover:text-white"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => onImageRemove(index)}
                      className="bg-white rounded-md text-black p-2 hover:bg-red-500 hover:text-white"
                    >
                      <FiX />
                    </button>
                    <button
                      onClick={() => handleEditPhoto(image, index)}
                      className="bg-white rounded-md text-black p-2 hover:bg-red-500 hover:text-white"
                    >
                      <FiImage />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="flex justify-center items-center w-full mb-24"
              style={isDragging ? { color: 'red' } : null}
              onClick={() => onImageUpload()}
              {...dragProps}
            >
              <label
                // for="dropzone-file"
                className={`flex flex-col justify-center items-center w-full h-32 bg-gray-50 rounded-lg border-2  border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 ${
                  isDragging ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <div className="flex flex-col justify-center items-center pt-5 pb-6">
                  <svg
                    aria-hidden="true"
                    className="mb-3 w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">
                      Nhấn hoặc kéo thả hình ảnh để tải lên
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    * Định dạng yêu cầu : SVG, PNG, JPG or JPEG
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}
      </ImageUploading>
    );
  };

  const renderUploadVideo = () => {
    return (
      <>
        <div className="grid grid-cols-4 gap-4 mb-3">
          {videos.map((video, index) => (
            <div key={index} className="image-item relative">
              <video
                src={video.url}
                controls
                className="h-full w-full rounded-lg max-h-52"
              />
              <div className="absolute grid grid-cols-2 top-2 -right-7 gap-2 text-white">
                <button
                  onClick={() => removeVideo(video.url)}
                  className="bg-white rounded-md text-black p-1 hover:bg-red-500 hover:text-white"
                >
                  <FiX />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center w-full mb-2">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col justify-center items-center w-full h-32 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col justify-center items-center pt-5 pb-6">
              <svg
                aria-hidden="true"
                className="mb-3 w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Nhấn để tải lên video</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                * Định dạng yêu cầu : .mp4 <br />* Dung lượng tối đa : 20MB
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept=".mp4"
              onChange={handleFileVideo}
            />
          </label>
        </div>
      </>
    );
  };

  const renderUploadResources = () => {
    return (
      <>
        {/* show loading */}
        {loadingResources ? (
          <div className="flex justify-center items-center w-full h-32">
            <div className="flex flex-col justify-center items-center">
              <svg
                aria-hidden="true"
                className="mb-3 w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Đang tải dữ liệu ...</span>
              </p>
            </div>
          </div>
        ) : null}
        {/* show resources */}
        {!loadingResources ? (
          <div className="grid grid-cols-4 gap-4 mb-3">
            {resources &&
              resources.length > 0 &&
              resources.map((resource, index) => {
                const { url, type } = resource;
                return (
                  <div key={index} className="image-item relative">
                    {type === 'image' ? (
                      <img
                        src={url}
                        alt=""
                        className="h-full w-full rounded-lg max-h-52"
                      />
                    ) : (
                      <video
                        src={url}
                        controls
                        className="h-full w-full rounded-lg max-h-52"
                      />
                    )}
                    <div className="absolute grid grid-cols-2 top-2 right-2 gap-2 text-white">
                      <button
                        onClick={() => handleOnSelectResource(resource)}
                        className="absolute top-0 right-0 p-1 bg-white rounded-md text-black hover:bg-green-500 hover:text-white"
                      >
                        <FiCheckSquare />
                      </button>
                      <button
                        onClick={() => handleOnRemoveResource(resource)}
                        className="bg-white rounded-md text-black p-1 hover:bg-red-500 hover:text-white"
                      >
                        <FiX />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : null}
      </>
    );
  };

  useEffect(() => {
    if (editItem) {
      dispatch(
        updateProps([
          {
            prop: KEY_HASH_VIDEO_OR_IMAGE,
            value: editItem?.media_type,
          },
        ])
      );
      setSelectedIndex(
        editItem?.media_type === UPLOAD_TYPE_IMAGE
          ? 0
          : editItem?.media_type === UPLOAD_TYPE_VIDEO
          ? 1
          : 0
      );
    }
  }, [editItem]);
  return (
    <div className="p-3 overflow-y-scroll max-h-full">
      <Tab.Group
        selectedIndex={selectedIndex}
        onChange={(e) => handleChangeTab(e)}
      >
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 p-1">
          <Tab
            // disabled={hashVideoOrImage === UPLOAD_TYPE_VIDEO}
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 font-medium leading-5 text-blue-700',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 btn__update-text',
                selected
                  ? 'bg-white shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-black'
              )
            }
          >
            Hình ảnh
          </Tab>
          <Tab
            // disabled={hashVideoOrImage === UPLOAD_TYPE_IMAGE}
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 font-medium leading-5 text-blue-700',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 btn__update-text',
                selected
                  ? 'bg-white shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-black'
              )
            }
          >
            {UPLOAD_TYPE_VIDEO}
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 font-medium leading-5 text-blue-700',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 btn__update-text',
                selected
                  ? 'bg-white shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-black'
              )
            }
          >
            Đã tải lên
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2 overflow-scroll overflow-x-hidden max-h-screen">
          <Tab.Panel>{renderUploadImage()}</Tab.Panel>
          <Tab.Panel>{renderUploadVideo()}</Tab.Panel>
          <Tab.Panel>{renderUploadResources()}</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      {images.length === 0 && videos.length === 0 ? null : (
        <button
          className={`${
            uploading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
          } w-full p-2 text-white  transition-all rounded-md shadow-md`}
          onClick={upload}
          disabled={uploading}
        >
          {uploading ? (
            <span className="text-white font-bold">
              {uploadProgress === 100
                ? 'Đang tải dữ liệu lên hệ thống, vui lòng đợi trong giây lát ...'
                : `${uploadProgress}%`}
            </span>
          ) : (
            'Tải lên tất cả'
          )}
        </button>
      )}
    </div>
  );
};

export default Upload;
