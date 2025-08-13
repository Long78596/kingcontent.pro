import React, { useCallback, useEffect, useState } from 'react';
import {
  FaAngleDown,
  FaAngleUp,
  FaMinusCircle,
  FaPlusCircle,
} from 'react-icons/fa';
const maxComments = 10;

const AutoComments = (props) => {
  const {
    isAutoComment,
    setIsAutoComment,
    listComments,
    setListComments,
    isRandomCharacters = false,
    setIsRandomCharacters = false,
    isRandomEmojis = false,
    setIsRandomEmojis = false,
    hasThreads = false,
  } = props;
  const [isShowBody, setIsShowBody] = useState(false);
  const [isShowAddMore, setIsShowAddMore] = useState(true);

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

  const onAddComment = useCallback(() => {
    setListComments((listComments) => [
      ...listComments,
      {
        id: getMaxId(listComments) + 1,
        message: '',
      },
    ]);
  }, []);

  const onRemoveComment = useCallback((id) => {
    setListComments((listComments) => {
      const newListComments = [...listComments];
      const index = newListComments.findIndex((comment) => comment.id === id);
      if (index !== -1) newListComments.splice(index, 1);
      return newListComments;
    });
  }, []);

  const onChangeComment = useCallback((id, newMessage) => {
    setListComments((listComments) => {
      const newListComments = [...listComments];
      const index = newListComments.findIndex((comment) => comment.id === id);
      newListComments[index] = {
        ...newListComments[index],
        message: newMessage,
      };
      return newListComments;
    });
  }, []);

  const onClickShowBody = useCallback(() => {
    setIsShowBody((state) => !state);
  }, []);

  return (
    <div className="customizeContentContainer overflow-hidden">
      <div
        className="title p-3 font-bold text-base uppercase mb-2 cursor-pointer border rounded-md flex items-center"
        onClick={() => onClickShowBody()}
      >
        <h4>Comment tự động sau khi lên bài</h4>
        {isShowBody ? (
          <FaAngleUp className="ml-auto" />
        ) : (
          <FaAngleDown className="ml-auto" />
        )}
      </div>
      <div
        className={`body transition-all duration-300 ease-in-out ${
          isShowBody ? 'h-auto' : 'h-0'
        }`}
      >
        {hasThreads && false && (
          <p className="text-red-500 italic my-2 px-2">
            Chức năng tự động bình luận sau khi đăng bài thành công chỉ áp dụng
            cho Fanpage
          </p>
        )}
        <p className="text-red-500 italic my-2 px-2">
          Hệ thống sẽ tự động comment sau 2-4 phút, sau khi bài viết đã đăng
          thành công trên Facebook
        </p>
        <div>
          <label
            htmlFor="isAutoComment"
            className="flex gap-2 items-center cursor-pointer px-2"
          >
            <input
              type="checkbox"
              className="rounded-sm"
              id="isAutoComment"
              name="isAutoComment"
              checked={isAutoComment}
              onChange={() =>
                setIsAutoComment((isAutoComment) => !isAutoComment)
              }
            />
            <span>Kích hoạt</span>
          </label>
        </div>
        <div className={`mt-2 ${isAutoComment ? '' : 'hidden'}`}>
          <div className="flex items-center gap-4 mb-2">
            <label
              htmlFor="isRandomCharacters"
              className="flex gap-2 items-center cursor-pointer px-2"
            >
              <input
                type="checkbox"
                className="rounded-sm"
                id="isRandomCharacters"
                name="isRandomCharacters"
                checked={isRandomCharacters}
                onChange={() =>
                  setIsRandomCharacters(
                    (isRandomCharacters) => !isRandomCharacters
                  )
                }
              />
              <span>Thêm ký tự</span>
            </label>
            <label
              htmlFor="isRandomEmojis"
              className="flex gap-2 items-center cursor-pointer px-2"
            >
              <input
                type="checkbox"
                className="rounded-sm"
                id="isRandomEmojis"
                name="isRandomEmojis"
                checked={isRandomEmojis}
                onChange={() =>
                  setIsRandomEmojis((isRandomEmojis) => !isRandomEmojis)
                }
              />
              <span>Thêm biểu tượng </span>
            </label>
          </div>
          {listComments.length > 0 &&
            listComments.map((comment, index) => {
              const { id, message } = comment;
              return (
                <div className="flex gap-2 items-center" key={index}>
                  <textarea
                    rows={5}
                    className="w-full mb-2"
                    name="comments[]"
                    value={message}
                    onChange={(evt) => onChangeComment(id, evt.target.value)}
                    placeholder={`Comment tự động thứ ${index + 1}`}
                  ></textarea>
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
