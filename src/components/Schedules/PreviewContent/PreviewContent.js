import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import Body from '../../CategoriesContent/CategoriesContentItem/Body';
import Body from '../../CategoriesContent/CategonesContentltem/Body';

import Header from '../../CategoriesContent/CategonesContentltem/Header';
import Image from '../../CategoriesContent/CategonesContentltem/Image';
import logo from '../../../assets/images/logo.jpg';
import logoTikTok from '../../../assets/images/icon/main-menu/menu-icon-tiktok.png';
import { userServices } from '../../../services/users';
import PerfectScrollbar from 'react-perfect-scrollbar';
import DetailTiktok from '../Tiktok/DetailTiktok';
import { ResourcesService } from '../../../services/resources';
import { setSelectedScheduleContent } from '../../../store/actions/Schedules';
import { convertInstagramLink } from '../../../helpers';
import { toast } from 'react-toastify';
import DetailDouyin from '../douyin/detailDouyin';
import Images from '../../Threads/Images';
import ContentDetailThreads from '../../CategoriesContent/ContentDetailThreads/ContentDetailThreads';
import { setContentDetailToShow } from '../../../store/actions/Contents/contentActions';
import { OK } from '../../../configs';

const listTypesHasUpload = ['event'];

const PreviewContent = (props) => {
  const { content = {}, replaceContent = '', isAddSource = false } = props;
  const {
    source_type = '',
    post_timestamp = '',
    timestamp = '',
    page_name = '',
    post_header = '',
    page_id = '',
    post_text = '',
    medias = [],
    videos = [],
    feed_id = '',
    feed_name = '',
    thumbnail = '',
    schedule_content_id = 0,
    post_id = 0,
    media_type = '',
    ad_id = '',
    image_url = '',
    media_url = '',
    images = [],
    is_reels = false,
    video = null,
    user_display_name = '',
    is_event_content = false,
    video_id = '',
    user_name = '',
  } = content;

  const [thumb, setThumb] = useState(thumbnail);
  const [avatar, setAvatar] = useState('');
  const [previewContent, setPreviewContent] = useState('');
  const [sourceName, setSourceName] = useState();
  const [contentType, setContentType] = useState();
  const [isUploadImage, setIsUploadImage] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userReducer);
  const { selectedScheduleContent } = useSelector((state) => state.schedules);
  const [open, setOpen] = useState(false);
  const [objSelect, setObjSelect] = useState(null);

  const { contentDetailToShow } = useSelector((state) => state.contents);
  const handleClosePopup = () => {
    setOpen(!open);
  };
  const handleActionShowPopup = () => {
    if (source_type === 'threads' || source_type === 'system') {
      dispatch(
        setContentDetailToShow({
          ...content,
          post_text: previewContent,
          text: previewContent,
        })
      );
    } else {
      setObjSelect(content);
      setOpen(true);
    }
  };

  const getThumbnail = async (type, video) => {
    await userServices
      .getSingleTikTokVideo(type, video)
      .then((res) => {
        setThumb(res?.data?.data?.thumbnail);
      })
      .catch((err) => {
        setThumb(logoTikTok);
      });
  };
  useEffect(() => {
    if (
      (videos && videos.length > 0) ||
      source_type === 'tiktok' ||
      media_type === 'video'
    ) {
      setContentType('video');
      if (source_type === 'instagram') {
        if (video) {
          setThumb(convertInstagramLink(thumbnail));
        } else {
          setThumb(convertInstagramLink(videos[0]?.thumbnail) || '');
        }
      } else if (schedule_content_id) {
        getThumbnail('id', post_id);
      } else if (ad_id) {
        setThumb(videos[0].thumb);
      } else {
        setThumb(thumbnail);
      }
    } else if (source_type === 'douyin') {
      setThumb(thumbnail);
    } else {
      setContentType('image');
      if (ad_id || source_type === 'instagram') {
        setThumb(images[0]);
      } else {
        setThumb(medias[0]);
      }
    }
  }, [
    videos,
    source_type,
    schedule_content_id,
    post_id,
    thumbnail,
    medias,
    ad_id,
    images,
    media_type,
    video,
  ]);

  const onChangeImage = async (e) => {
    const files = e.target.files;
    const filesArr = [...files];
    if (filesArr.length > 10 || selectedScheduleContent.medias.length === 10) {
      toast.error('Chỉ được phép tải lên tối đa 10 ảnh cho content sự kiện');
      return;
    }
    const formData = new FormData();
    filesArr.forEach((file) => {
      formData.append('files[]', file, file.name);
    });
    setIsUploadImage(true);
    const res = await ResourcesService.uploadFile(formData);
    if (res.status === OK) {
      let images = res.data.data
        .slice(0, filesArr.length)
        .map((_elt) => _elt.url);
      dispatch(
        setSelectedScheduleContent({
          ...selectedScheduleContent,
          medias: [...selectedScheduleContent.medias, ...images],
          images: [...selectedScheduleContent.medias, ...images],
        })
      );
      setIsUploadImage(false);
    }
  };

  useEffect(() => {
    switch (source_type) {
      case 'ads':
        setSourceName(page_name);
        break;

      case 'tiktok':
      case 'douyin':
        setSourceName(feed_name);
        break;

      case 'threads':
        setSourceName(user_name);
        break;

      case 'instagram':
        setSourceName(user_display_name);
        break;

      default:
        setSourceName(post_header);
        break;
    }
  }, [source_type, page_name, post_header]);

  useEffect(() => {
    if (user && user.facebook_id) {
      setAvatar(
        `https://graph.facebook.com/${user?.facebook_id}/picture?width=1000&height=1000`
      );
    } else {
      setAvatar(logo);
    }
  }, [user, logo]);

  useEffect(() => {
    if (replaceContent) {
      setPreviewContent(replaceContent);
      // add source
      if (isAddSource) {
        setPreviewContent(`${replaceContent} \n\nNguồn: ${sourceName}`);
      }
    } else {
      setPreviewContent(post_text);
      // add source
      if (isAddSource) {
        setPreviewContent(`${post_text} \n\nNguồn: ${sourceName}`);
      }
    }
  }, [replaceContent, post_text, isAddSource, sourceName]);

  return (
    <div className="list-none align-top mb-5 w-2/6 rounded-lg previewContent">
      <PerfectScrollbar
        style={{
          maxHeight: '700px',
        }}
      >
        <div className="bg-white rounded-t-lg relative contentItem">
          <Header
            fanpageName={source_type === 'ads' ? page_name : post_header}
            createdDate={source_type === 'ads' ? timestamp : post_timestamp}
            page="preview"
            page_avatar={avatar}
          />
          <Body content={previewContent} isPreview={true} />
          <div className="mt-3">
            {listTypesHasUpload.includes(source_type) &&
              media_type !== 'video' && (
                <label
                  htmlFor="inputUploadImage"
                  className=" text-sm w-full text-gray-500 font-semibold mb-2 max-w-md mx-auto flex flex-col items-center border-2 border-dashed border-gray-400 p-3"
                  style={{ width: '100%' }}
                >
                  {isUploadImage ? 'Đang tải lên ...' : 'Tải ảnh lên'}
                  <input
                    disabled={isUploadImage}
                    accept="image/*"
                    id="inputUploadImage"
                    onChange={onChangeImage}
                    multiple
                    type="file"
                    className="w-full hidden text-gray-400 font-semibold bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded"
                  />
                </label>
              )}
          </div>
          {source_type === 'threads' ? (
            <Images
              medias={images}
              contentType={media_type}
              videos={videos}
              isShowDetail={true}
              handleActionShowPopup={handleActionShowPopup}
            />
          ) : (
            <Image
              medias={
                source_type === 'tiktok' || media_type === 'video'
                  ? [thumb]
                  : ad_id ||
                    source_type === 'douyin' ||
                    source_type === 'instagram'
                  ? images
                  : medias
              }
              sourceType={source_type}
              contentType={contentType}
              isPreview={true}
              handleActionShowPopup={handleActionShowPopup}
              isShowDelete={source_type === 'event'}
              mediaUrl={
                ad_id && media_type === 'video'
                  ? videos[0].video
                  : source_type === 'instagram' && media_type === 'video'
                  ? videos[0].source
                  : media_type === 'video' && media_url
                  ? media_url
                  : null
              }
            />
          )}
        </div>
      </PerfectScrollbar>
      {source_type === 'tiktok' && (
        <DetailTiktok
          open={open}
          setOpen={handleClosePopup}
          handleClosePopup={handleClosePopup}
          obj={objSelect}
        />
      )}
      {source_type === 'douyin' && (
        <DetailDouyin
          open={open}
          setOpen={handleClosePopup}
          handleClosePopup={handleClosePopup}
          obj={objSelect}
        />
      )}

      {contentDetailToShow && source_type === 'threads' && (
        <ContentDetailThreads />
      )}
    </div>
  );
};

export default PreviewContent;
