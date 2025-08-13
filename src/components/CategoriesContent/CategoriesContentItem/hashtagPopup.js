import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { actionGetAllContent } from '../../../store/actions/contentUserLiked';
import { useDispatch, useSelector } from 'react-redux';
import {
  REDUX_NAME_CONTENT_USER_LIKED,
  REDUX_NAME_CREATE_POST,
} from '../../../utils/utilityFunc';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { CreateContent } from '../../../services/createContent';
import { toast } from 'react-toastify';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
const PopupTag = ({
  isOpen = true,
  toggle = () => {},
  onSubmitClick,
  hashtag,
  setIsOpenPopupTag,
}) => {
  const dispatch = useDispatch();
  const { hashTags, contents } = useSelector(
    (state) => state[REDUX_NAME_CONTENT_USER_LIKED]
  );
  const { user } = useSelector((state) => state.userReducer);
  const [hashtagEdit, setHashtagEdit] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isEditMultil, setsEditMultil] = useState(false);
  const handleEditHashTag = (hashtag) => {
    setInputValue(hashtag);
    setHashtagEdit(hashtag);
    setsEditMultil(true);
  };
  const handelSaveEdit = (hashtag) => {
    const hashTagFilter = contents
      .filter((_elt) => _elt.hashtag === hashtagEdit)
      .map((_hash) => _hash.id);
    axios
      .all(
        hashTagFilter.map((promise) => {
          CreateContent.editHagTags(promise, {
            hashtag: hashtag,
            user_id: user.id,
          });
        })
      )
      .then(
        axios.spread((user, repos, followers, following) => {
          toast.success('Cập nhật thẻ thành công !');
          dispatch(actionGetAllContent());
          setInputValue('');
          setHashtagEdit('');
          setsEditMultil(false);
          onSubmitClick && onSubmitClick(inputValue);
        })
      );
  };
  const handleDeleteHashtag = (hashtag) => {
    const hashTagFilter = contents
      .filter((_elt) => _elt.hashtag === hashtag)
      .map((_hash) => _hash.type_id);
    confirmAlert({
      title: 'Thông báo',
      message:
        'Khi xóa thẻ các bài viết có thể sẽ không được phân loại. Bạn có chắc muốn xóa không?',
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            axios
              .all(
                hashTagFilter.map((promise) => {
                  CreateContent.deleteHagTags(promise);
                })
              )
              .then(
                axios.spread((user, repos, followers, following) => {
                  toast.success('Xoá thẻ thành công !');
                  dispatch(actionGetAllContent());
                })
              );
          },
        },
        {
          label: 'Không',
          onClick: () => {},
        },
      ],
    });
  };
  useEffect(() => {
    if (hashtag) {
      setInputValue(hashtag);
    }
  }, [hashtag]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-9999 max-w-lg mt-1"
        style={{ maxWidth: '50%' }}
        onClose={toggle}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="w-2/4 transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
                style={{ height: '50%' }}
              >
                <div className="mb-3">
                  <input
                    value={inputValue}
                    className="w-full h-14 rounded-md shadow-sm border-gray-100 border-2 outline-none p-2"
                    placeholder="Nhập tên thẻ ..."
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      // setIsContent({ ...isContent, tag: e.target.value })
                    }}
                  />
                  <h4 className="font-bold text-base uppercase mt-2">
                    Thẻ gợi ý
                  </h4>
                  <PerfectScrollbar
                    className=" w-full mt-1"
                    style={{ height: '200px' }}
                  >
                    <ul className="mt-2">
                      {hashTags.map((tag, index) => (
                        <li
                          key={tag.id}
                          className={`mb-2 cursor-pointer ${
                            tag.hashtag === inputValue && 'bg-gray-100'
                          } px-2 rounded-md flex justify-between`}
                        >
                          <span
                            className="py-3 w-full"
                            onClick={() => setInputValue(tag.hashtag)}
                          >
                            #{tag.hashtag}
                          </span>
                          <div className="flex gap-5 justify-end w-1/3 py-3">
                            <FiEdit
                              size={25}
                              color="green"
                              onClick={() => handleEditHashTag(tag.hashtag)}
                              title={'Chỉnh sửa thẻ'}
                            />
                            <FiTrash
                              size={25}
                              color="red"
                              onClick={() => handleDeleteHashtag(tag.hashtag)}
                              title={'Xoá thẻ'}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </PerfectScrollbar>
                </div>
                <div className="flex justify-end gap-5 mt-3">
                  <button
                    onClick={() => toggle()}
                    className="bg-red-400 px-3 h-10 rounded-md text-white"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() =>
                      isEditMultil
                        ? handelSaveEdit(inputValue)
                        : onSubmitClick(inputValue)
                    }
                    disabled={inputValue === ''}
                    className="bg-blue-400 h-10 px-10 rounded-md text-white"
                  >
                    {isEditMultil ? 'Cập nhật' : 'Lưu'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PopupTag;
