// @ts-nocheck
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'rsuite';
import { Dialog, Transition } from '@headlessui/react';
import { FiX } from 'react-icons/fi';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import { COLLECTION_MAX_ITEMS_WARNING } from '../../../configs';
import {
  actionSaveCollection,
  actionSavePostsToCollection,
  actionSetCollectionModalOpen,
  actionSetCollectionType,
  actionUpdateChosenPosts,
} from '../../../store/actions/instagram';

const ModalCollection = () => {
  const {
    modalCollectionType = 'add',
    modalCollectionOpen = false,
    currentCollection = null,
    collections = null,
    chosenPosts = [],
    loadingSaveCollection = false,
  } = useSelector((state) => state.instagram);
  const dispatch = useDispatch();

  const [modalTile, setModalTile] = useState('');
  const [isShowSelection, setIsShowSelection] = useState(false);
  const [colOptions, setColOptions] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [collectionName, setCollectionName] = useState('');

  const onClose = () => {
    dispatch(actionSetCollectionModalOpen(false));
    dispatch(actionSetCollectionType(''));
  };

  useEffect(() => {
    switch (modalCollectionType) {
      case 'add':
        setModalTile('Thêm bộ sưu tập');
        setIsShowSelection(false);
        break;

      case 'edit':
        setModalTile('Sửa bộ sưu tập');
        setIsShowSelection(false);
        break;

      case 'addPosts':
        setModalTile('Thêm bài viết vào bộ sưu tập');
        if (colOptions.length > 0) setIsShowSelection(true);
        break;

      default:
        break;
    }
  }, [modalCollectionType, colOptions]);

  useEffect(() => {
    if (collections) {
      const options = collections.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setColOptions(options);
    } else {
      setColOptions([]);
    }
  }, [collections]);

  useEffect(() => {
    if (currentCollection) {
      setCollectionName(currentCollection.name);
    } else {
      setCollectionName('');
    }
  }, [currentCollection]);

  const onSave = async () => {
    switch (modalCollectionType) {
      case 'add':
        dispatch(
          actionSaveCollection({
            name: collectionName,
          })
        );
        onClose();
        break;

      case 'edit':
        dispatch(
          actionSaveCollection({
            id: currentCollection.id,
            name: collectionName,
          })
        );
        onClose();
        break;

      case 'addPosts':
        if (!collectionName && !selectedCollection) {
          toast.error('Vui lòng chọn hoặc nhập tên bộ sưu tập');
          return;
        }

        // Check collection limit for existing collection
        if (selectedCollection && !collectionName) {
          const selectedCol = collections.find(col => col.id === selectedCollection.value);
          const currentPostCount = selectedCol?.posts_count ?? 0;
          const newPostCount = chosenPosts.length;
          const totalCount = currentPostCount + newPostCount;

          if (totalCount > COLLECTION_MAX_ITEMS_WARNING) {
            confirmAlert({
              title: 'Cảnh báo số lượng bài viết',
              message: `Mỗi bộ sưu tập có nhiều hơn ${COLLECTION_MAX_ITEMS_WARNING} bài viết có thể làm chậm tốc độ xử lý. Bạn đang thêm ${newPostCount} bài viết vào BST "${selectedCol?.name}" có ${currentPostCount} bài viết. Bạn có chắc chắn muốn thêm?`,
              buttons: [
                {
                  label: 'Tiếp tục',
                  onClick: () => {
                    dispatch(
                      actionSavePostsToCollection(
                        selectedCollection?.value,
                        collectionName,
                        chosenPosts,
                        onClose
                      )
                    );
                    dispatch(actionUpdateChosenPosts([]));
                  },
                },
                {
                  label: 'Hủy',
                  onClick: () => {},
                },
              ],
            });
            return;
          }
        }

        if (collectionName) {
          const newPostCount = chosenPosts.length;
          
          if (newPostCount > COLLECTION_MAX_ITEMS_WARNING) {
            confirmAlert({
              title: 'Cảnh báo số lượng bài viết',
              message: `Bạn đang tạo bộ sưu tập mới với ${newPostCount} bài viết. Mỗi bộ sưu tập có nhiều hơn ${COLLECTION_MAX_ITEMS_WARNING} bài viết có thể làm chậm tốc độ xử lý. Bạn có chắc chắn muốn tạo?`,
              buttons: [
                {
                  label: 'Tiếp tục',
                  onClick: () => {
                    dispatch(
                      actionSavePostsToCollection(0, collectionName, chosenPosts, onClose)
                    );
                    dispatch(actionUpdateChosenPosts([]));
                  },
                },
                {
                  label: 'Hủy',
                  onClick: () => {},
                },
              ],
            });
            return;
          }
          
          dispatch(
            actionSavePostsToCollection(0, collectionName, chosenPosts, onClose)
          );
          dispatch(actionUpdateChosenPosts([]));
        } else {
          // save posts to collection
          dispatch(
            actionSavePostsToCollection(
              selectedCollection?.value,
              collectionName,
              chosenPosts,
              onClose
            )
          );
          dispatch(actionUpdateChosenPosts([]));
        }
        break;

      default:
        break;
    }
  };

  return (
    <Transition appear show={modalCollectionOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-9999 max-w-md mt-1"
        style={{ maxWidth: '30%' }}
        onClose={onClose}
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
          <div className="flex items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-30% transform rounded-lg pb-3 bg-white text-left align-middle shadow-xl transition-all relative">
                {loadingSaveCollection && (
                  <div className="loading absolute w-full h-full top-0 bottom-0 right-0 left-0 flex justify-center items-center bg-gray-300 bg-opacity-50 z-10">
                    <FaSpinner
                      size={32}
                      color="primary"
                      className="animate-spin"
                    />
                  </div>
                )}
                <div className="flex justify-between border-b border-gray-200 pb-2 px-3 pt-3">
                  <h5 className="font-bold text-base">{modalTile}</h5>
                  <FiX
                    size={35}
                    onClick={onClose}
                    className="bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 p-1"
                  />
                </div>
                <div className="px-3">
                  {/* form collection name */}
                  <div className="mt-4">
                    <label className="block font-bold mb-2">
                      {isShowSelection
                        ? 'Thêm mới bộ sưu tập'
                        : 'Tên bộ sưu tập'}
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập tên bộ sưu tập"
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={collectionName}
                      name="collection_name"
                      onChange={(e) => setCollectionName(e.target.value)}
                    />

                    {/* selection */}

                    {isShowSelection && (
                      <div className="mt-2">
                        <label className="block font-bold mb-2">
                          Hoặc chọn BST đã có
                        </label>
                        <div className="mt-4">
                          <Select
                            options={colOptions}
                            placeholder="Chọn bộ sưu tập"
                            value={selectedCollection}
                            onChange={(e) => setSelectedCollection(e)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {/* button */}
                  <div className="flex justify-end mt-4 px-3">
                    <Button
                      color="blue"
                      className="mr-2"
                      onClick={() => onSave()}
                    >
                      Lưu
                    </Button>
                    <Button color="red" onClick={onClose}>
                      Hủy
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalCollection;
