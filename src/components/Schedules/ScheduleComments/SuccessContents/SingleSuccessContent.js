import React, { useEffect, useState } from 'react';
import { Checkbox } from 'rsuite';
import defaultImg from '../../../../assets/images/anh-cute-nhat.jpg';
import moment from 'moment';
import { useSelector } from 'react-redux';
const MAX_CHARACTERS = 100;

const SingleSuccessContent = (props) => {
  const {
    content = null,
    onChooseContent,
    setIsShowCommented = () => {},
    setListComments = () => {},
  } = props;
  const [thumbnail, setThumbnail] = useState(defaultImg);
  const [description, setDescription] = useState('');
  const [datePublish, setDatePublish] = useState('');
  const [hasComments, setHasComments] = useState(false);

  const { scheduleCommentsWaitingList } = useSelector(
    (state) => state.schedules
  );

  useEffect(() => {
    if (content) {
      const {
        source_content = null,
        source_type = '',
        replaced_post_text = '',
        date_publish = '',
        comments = [],
        schedule_comments = [],
        thumbnail = '',
      } = content;
      switch (source_type) {
        case 'tiktok':
          setThumbnail(thumbnail);
          // setDescription(replaced_post_text.slice(0, MAX_CHARACTERS) || '');
          setDescription(replaced_post_text || '');
          break;

        default:
          setThumbnail(thumbnail || source_content?.medias[0] || defaultImg);
          // setDescription(source_content?.post_text.slice(0, MAX_CHARACTERS) || '');
          setDescription(replaced_post_text || source_content?.post_text || '');
          break;
      }
      setHasComments(schedule_comments.length > 0 ? true : false);
      setDatePublish(moment(date_publish).format('HH:mm:ss DD-MM-YYYY'));
    } else {
      setThumbnail(defaultImg);
      setDescription('');
      setDatePublish('');
      setHasComments(false);
    }
  }, [content]);

  const isChecked = (value) => {
    const { content_ids = [] } = scheduleCommentsWaitingList;
    const isExist = content_ids.find((item) => item === value);
    return isExist ? true : false;
  };

  return (
    <div
      className="single-success-content flex gap-4 border-b border-gray-400 border-dashed hover:border-blue-500 p-2 mb-2 items-center cursor-pointer"
    >
      <div className="checkbox w-1/12" 
      onClick={() => onChooseContent(content?.id)}>
        <Checkbox value={content?.id} checked={isChecked(content?.id)} />
      </div>
      <div className="thumbnail w-4/12 xl:w-3/12">
        <div
          className="block rounded-md bg-cover bg-no-repeat bg-center w-28 h-28"
          style={{ backgroundImage: `url(${thumbnail})` }}
        />
      </div>
      <div className="content w-7/12 xl:w-8/12">
        <div
        onClick={() => onChooseContent(content?.id)}
        >
          <p className="line-clamp-2 mb-2">{description}</p>
          <p className="italic">Ngày đăng: {datePublish}</p>
        </div>
        {hasComments && (
          <p
            className="italic btn bg-red-400 py-2 px-3 inline-block rounded-lg mt-2 text-white"
            onClick={async () => {
              await setIsShowCommented(false);
              await setListComments(content?.schedule_comments);
              setIsShowCommented(true);
            }}
          >
            Đã Comment
          </p>
        )}
      </div>
    </div>
  );
};

export default SingleSuccessContent;
