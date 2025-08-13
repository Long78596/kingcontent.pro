import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteHistory,
  getHistory,
  removeHistoryHashtag,
} from '../../../../store/actions/createContent';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { confirmAlert } from 'react-confirm-alert';

const PopupTag = ({
  isOpen = false,
  toggle,
  handleSaveHistory,
  isContent,
  setIsContent,
  isEdit = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [editHashTag, setEditHashTag] = useState('');
  const dispatch = useDispatch();
  const { tagList } = useSelector((state) => state.createPost);
  useEffect(() => {
    if (isContent) {
      setInputValue(isContent.tag);
    }
    dispatch(getHistory());
  }, []);

  const handleEditHashTag = (tag) => {
    confirmAlert({
      title: 'Chỉnh sửa thẻ',
      message:
        'Bạn có chắc chắn muốn chỉnh sửa thẻ này không? Toàn bộ kết quả đã lưu sẽ được cập nhật theo thẻ mới !',
      buttons: [
        {
          label: 'Có',
          onClick: () => {
            setInputValue(tag);
            setEditHashTag(tag);
          },
        },
        {
          label: 'Không',
          onClick: () => {},
        },
      ],
    });
  };

  const handleDeleteHashtag = (tag) => {
    confirmAlert({
      title: 'Xoá thẻ',
      message:
        'Bạn có chắc chắn muốn xoá thẻ này không? Chúng tôi sẽ chỉ xoá thẻ của toàn bộ kết quả đã lưu !',
      buttons: [
        {
          label: 'Có',
          onClick: () => {
            dispatch(removeHistoryHashtag(tag));
          },
        },
        {
          label: 'Không',
          onClick: () => {},
        },
      ],
    });
  };

  const onSaveHistory = () => {
    if (editHashTag !== '') {
      const editingHashtag = {
        oldTag: editHashTag,
        newTag: inputValue,
      };
      handleSaveHistory(editingHashtag);
    } else {
      handleSaveHistory();
    }
  };

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
                    placeholder="Vui lòng điền một thẻ phân loại để lưu content gợi ý này"
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setIsContent({ ...isContent, tag: e.target.value });
                    }}
                  />
                  {editHashTag && (
                    <span className="text-xs text-red-500">
                      Bạn đang chỉnh sửa thẻ: {editHashTag}
                    </span>
                  )}
                </div>
                {tagList.length === 0 ? null : (
                  <div className="relative">
                    <span className="uppercase text-md font-bold">
                      Thẻ gợi ý
                    </span>
                    <div
                      className="w-full h-1 bg-gray-600 mb-3 mt-2"
                      style={{ height: '1px' }}
                    ></div>
                    {editHashTag && (
                      <div className="absolute left-0 top-0 w-full h-full z-10 cursor-not-allowed"></div>
                    )}
                    <ul className="rounded-md max-h-96 overflow-y-scroll">
                      {tagList.length > 0 &&
                        tagList.map(
                          (_elt, index) =>
                            // only show _elt has not empty
                            _elt &&
                            _elt.trim() && (
                              <li
                                className={`flex mb-2 font-bold hover:text-red-500 cursor-pointer items-center ${
                                  inputValue === _elt
                                    ? 'text-red-500'
                                    : 'text-gray-500'
                                }`}
                                key={index}
                              >
                                <span
                                  className="w-full"
                                  onClick={() => {
                                    if (inputValue === _elt) {
                                      toast.warning('Bạn đang chọn thẻ này !');
                                      return;
                                    }
                                    setInputValue(_elt);
                                    setIsContent({ ...isContent, tag: _elt });
                                  }}
                                >
                                  {_elt}
                                </span>
                                <div className="flex items-center ml-auto gap-2">
                                  <FiEdit
                                    size={25}
                                    color="green"
                                    onClick={() => handleEditHashTag(_elt)}
                                    title={'Chỉnh sửa thẻ'}
                                  />
                                  <FiTrash
                                    size={25}
                                    color="red"
                                    onClick={() => handleDeleteHashtag(_elt)}
                                    title={'Xoá thẻ'}
                                  />
                                </div>
                              </li>
                            )
                        )}
                    </ul>
                  </div>
                )}
                <div className="flex justify-end gap-5 mt-3">
                  <button
                    onClick={() => toggle()}
                    className="bg-red-400 px-3 h-10 rounded-md text-white"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => onSaveHistory()}
                    disabled={inputValue === ''}
                    className="bg-blue-400 h-10 px-10 rounded-md text-white"
                  >
                    {isEdit ? 'Cập nhật' : 'Lưu'}
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
