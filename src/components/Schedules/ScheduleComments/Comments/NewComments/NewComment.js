import React, { useCallback } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, Input } from 'rsuite';
import { setScheduleCommentsWaitingList } from '../../../../../store/actions/Schedules';

const NewComment = (props) => {
  const { comment = [], index = 0, onRemoveComment } = props;
  const { scheduleCommentsWaitingList } = useSelector(
    (state) => state.schedules
  );

  const dispatch = useDispatch();

  const onChangeComment = useCallback(
    (id, type, value) => {
      const { comments = [] } = scheduleCommentsWaitingList;
      let newComments = [];
      switch (type) {
        case 'message':
          newComments = comments.reduce((acc, cur) => {
            if (cur.id === id) {
              return [...acc, { ...cur, message: value }];
            }
            return [...acc, cur];
          }, []);
          dispatch(
            setScheduleCommentsWaitingList({
              ...scheduleCommentsWaitingList,
              comments: newComments,
            })
          );
          break;

        case 'is_random_characters':
          newComments = comments.reduce((acc, cur) => {
            if (cur.id === id) {
              return [...acc, { ...cur, is_random_characters: value }];
            }
            return [...acc, cur];
          }, []);
          dispatch(
            setScheduleCommentsWaitingList({
              ...scheduleCommentsWaitingList,
              comments: newComments,
            })
          );
          break;

        case 'is_random_emojis':
          newComments = comments.reduce((acc, cur) => {
            if (cur.id === id) {
              return [...acc, { ...cur, is_random_emojis: value }];
            }
            return [...acc, cur];
          }, []);
          dispatch(
            setScheduleCommentsWaitingList({
              ...scheduleCommentsWaitingList,
              comments: newComments,
            })
          );
          break;

        default:
          break;
      }
    },
    [scheduleCommentsWaitingList]
  );

  return (
    <div className="commentItem flex gap-3 items-center text-center mb-2">
      <div className="w-6/12 text-center">
        <Input
          placeholder={`Comment thứ ${
            index + 1
          } ...\nCó thể chọn ngẫu nhiên comment theo cấu trúc A | B | C`}
          componentClass={'textarea'}
          rows={3}
          value={comment?.message}
          onChange={(value) => onChangeComment(comment?.id, 'message', value)}
        />
      </div>
      <div className="w-2/12">
        <Checkbox
          name="isRandomCharacters"
          value={1}
          defaultChecked={comment?.is_random_characters || false}
          className="text-center"
          inline={true}
          onChange={(value, checked) =>
            onChangeComment(comment?.id, 'is_random_characters', checked)
          }
        />
      </div>
      <div className="w-2/12 text-center">
        <Checkbox
          name="isRandomEmojis"
          value={1}
          defaultChecked={comment?.is_random_emojis || false}
          className="text-center"
          inline={true}
          onChange={(value, checked) =>
            onChangeComment(comment?.id, 'is_random_emojis', checked)
          }
        />
      </div>
      <div className="w-2/12">
        <button
          className="rounded bg-red-500 cursor-pointer text-center p-3"
          onClick={() => onRemoveComment(comment?.id)}
        >
          <FaTrash color="#ffffff" />
        </button>
      </div>
    </div>
  );
};

export default NewComment;
