import React, { useEffect, useState } from 'react';
import {
  FaMinusCircle,
  FaPlusCircle,
} from 'react-icons/fa';
import { Checkbox, Input } from 'rsuite';
const maxComments = 10;

const defaultCommentItem = {
  id: 1,
  message: '',
};

const AutoComments = (props) => {
  const { onChangeRandom, localSettings, onChangedLocalSettings } = props;

  const [isShowAddMore, setIsShowAddMore] = useState(true);
  const [isAutoComment, setIsAutoComment] = useState(0);
  const [listComments, setListComments] = useState([defaultCommentItem]);

  useEffect(() => {
    if (localSettings) {
      const { is_auto_comment = 0, comments = [] } = localSettings;
      setListComments(comments);
      setIsAutoComment(is_auto_comment);
    } else {
      setListComments([defaultCommentItem]);
      setIsAutoComment(0);
    }
  }, [localSettings]);

  useEffect(() => {
    if (listComments.length >= maxComments) setIsShowAddMore(false);
    else setIsShowAddMore(true);
  }, [listComments]);

  const getMaxId = (listComments) => {
    let maxId = 0;
    listComments.forEach((comment) => {
      if (comment.id > maxId) maxId = comment.id;
    });
    return maxId;
  };

  const onAddComment = () => {
    const newListComments = [
      ...listComments,
      {
        id: getMaxId(listComments) + 1,
        message: '',
      },
    ];
    onChangedLocalSettings('comments', newListComments);
  };

  const onRemoveComment = (id) => {
    const newListComments = [...listComments];
    const index = newListComments.findIndex((comment) => comment.id === id);
    if (index !== -1) newListComments.splice(index, 1);
    onChangedLocalSettings('comments', newListComments);
  };

  const onChangeComment = (id, newMessage) => {
    const newListComments = [...listComments];
    const index = newListComments.findIndex((comment) => comment.id === id);
    newListComments[index] = {
      ...newListComments[index],
      message: newMessage,
    };
    onChangedLocalSettings('comments', newListComments);
  };

  return (
    <div className="settingRow my-2 flex gap-2">
      <div className="w-1/3">
        <h5 className="font-bold">Comment tự động sau khi lên bài:</h5>
        <p className="text-red-500 italic my-2">
          Hệ thống sẽ tự động comment sau 2-4 phút, sau khi bài viết đã đăng
          thành công trên Facebook
        </p>
      </div>
      <div className="w-2/3">
        <div>
          <Checkbox
            name="isAutoComment"
            value={1}
            onChange={(value, checked) =>
              onChangeRandom('isAutoComment', checked)
            }
          >
            Kích hoạt
          </Checkbox>
        </div>
        <div className={`mt-2 ${isAutoComment ? '' : 'hidden'}`}>
          <div className="flex items-center gap-4 mb-2">
            <Checkbox
              name="isRandomCharactersComment"
              value={1}
              onChange={(value, checked) =>
                onChangeRandom('isRandomCharactersComment', checked)
              }
            >
              Thêm ký tự
            </Checkbox>
            <Checkbox
              name="isRandomEmojisComment"
              value={1}
              onChange={(value, checked) =>
                onChangeRandom('isRandomEmojisComment', checked)
              }
            >
              Thêm biểu tượng
            </Checkbox>
          </div>
          {listComments.map((comment, index) => {
            const { id, message } = comment;
            return (
              <div className="flex gap-2 items-center" key={index}>
                <Input
                  componentClass="textarea"
                  rows={5}
                  className="w-full mb-2"
                  name="comments[]"
                  value={message}
                  onChange={(value) => onChangeComment(id, value)}
                  placeholder={`Comment tự động thứ ${index + 1}`}
                />
                <button
                  className="ml-auto cursor-pointer"
                  onClick={() => onRemoveComment(id)}
                >
                  <FaMinusCircle className="text-redQuestion" size={30} />
                </button>
              </div>
            );
          })}
          {isShowAddMore && (
            <button className="mt-4" onClick={() => onAddComment()}>
              <FaPlusCircle size={50} className="text-primary" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoComments;
