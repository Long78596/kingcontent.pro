import React, { useState, useEffect, Fragment } from 'react';
import { BiPencil } from 'react-icons/bi';
import { FiTrash2 } from 'react-icons/fi';
import { Checkbox } from 'rsuite';
import auth from '../../../../utils/auth';

const SingleSuggestionTag = (props) => {
  const {
    tag,
    index,
    listTags = [],
    handleSelectTag,
    isUserTag = false,
    setTag = () => {},
    deleteTag = () => {},
  } = props;
  const [isChecked, setIsChecked] = useState(false);
  const [isCreatedUserTag, setIsCreatedUserTag] = useState(false);

  const currentUser = auth.getUserInfo();
  const currentUserId = currentUser?.id;

  useEffect(() => {
    setIsChecked(Array.from(listTags).some((item) => item.id === tag.id));
  }, [listTags, tag]);

  useEffect(() => {
    if (tag) {
      setIsCreatedUserTag(tag.user_id === currentUserId);
    }
  }, [tag]);

  const onCheck = (value, event) => {
    if (isUserTag) {
      return;
    }
    handleSelectTag(tag, event);
  };

  return (
    <div className="relative">
      <Checkbox
        checked={isChecked || isUserTag}
        onChange={onCheck}
        disabled={isUserTag}
        id={`checkbox${index}`}
        type="checkbox"
        title={`Chọn kịch bản "${tag.name}"`}
        className="hidden"
      />
      <label
        htmlFor={`checkbox${index}`}
        className="cursor-pointer hover:border-red-300"
      >
        <div
          className={`flex items-center bg-gray-50 p-4 rounded-md shadow-md mb-4 ${
            Array.from(listTags).some((item) => item.id === tag.id) === true
              ? 'border-red-300 border-2'
              : ''
          } hover:border-red-300 border-2`}
          title={`Chọn kịch bản "${tag.name}"`}
        >
          <Checkbox
            checked={isChecked || isUserTag}
            disabled={isUserTag}
            onChange={onCheck}
            id={`checkbox${index}`}
            type="checkbox"
            title={`Chọn kịch bản "${tag.name}"`}
          />
          <span className="font-bold uppercase">{tag.name}</span>
        </div>
      </label>
      {(isUserTag || isCreatedUserTag) && (
        <Fragment>
          <BiPencil
            onClick={() => setTag(tag)}
            className="cursor-pointer hover:text-red-500 absolute top-0 right-9 bottom-0 m-auto h-5 w-5"
          />
          {/* trash icon */}
          <FiTrash2
            onClick={() => deleteTag(tag)}
            className="cursor-pointer hover:text-red-500 absolute top-0 right-2 bottom-0 m-auto h-5 w-5"
          />
        </Fragment>
      )}
    </div>
  );
};

export default SingleSuggestionTag;
