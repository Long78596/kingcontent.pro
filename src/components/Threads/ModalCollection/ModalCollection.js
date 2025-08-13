import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
  actionSaveCollection,
  actionSaveVideoToCollection,
  actionUpdateChosenVideos,
  actionUpdateCollectionModalOpen,
  actionUpdateCollectionModalType,
  actionUpdateCurrentCollection,
} from '../../../store/actions/threads';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'rsuite';
import { Dialog, Transition } from '@headlessui/react';
import { FiX } from 'react-icons/fi';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import { COLLECTION_MAX_ITEMS_WARNING } from '../../../configs';

const ModalCollection = () => {
  const {
    modalCollectionType = 'add',
    modalCollectionOpen = false,
    currentCollection = null,
    collections = null,
    chosenVideos = [],
  // @ts-ignore
  } = useSelector((state) => state.threads);
  const dispatch = useDispatch();

  const [modalTile, setModalTile] = useState('');
  const [isShowSelection, setIsShowSelection] = useState(false);
  const [colOptions, setColOptions] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [collectionName, setCollectionName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onClose = () => {
    dispatch(actionUpdateCurrentCollection(null));
    dispatch(actionUpdateCollectionModalOpen(false));
    dispatch(actionUpdateCollectionModalType('add'));
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

      case 'addVideo':
        setModalTile('Thêm video vào bộ sưu tập');
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

  const onSave = useCallback(async () => {
    switch (modalCollectionType) {
      case 'add':
        setIsLoading(true);
        await dispatch(
          actionSaveCollection({
            name: collectionName,
          })
        );
        toast.success('Bộ sưu tập đã được thêm thành công');
        onClose();
        setIsLoading(false);
        break;

      case 'edit':
        setIsLoading(true);
        await dispatch(
          actionSaveCollection({
            id: currentCollection.id,
            name: collectionName,
          })
        );
        toast.success('Tên bộ sưu tập đã được sửa thành công');
        onClose();
        setIsLoading(false);
        break;

      case 'addVideo':
        if (!collectionName && !selectedCollection) {
          toast.error('Vui lòng chọn hoặc nhập tên bộ sưu tập');
          return;
        }

        // Check collection limit for existing collection
        if (selectedCollection && !collectionName) {
          const selectedCol = collections.find(col => col.id === selectedCollection.value);
          const currentVideoCount = selectedCol?.videos_count ?? 0;
          const newVideoCount = chosenVideos.length;
          const totalCount = currentVideoCount + newVideoCount;

          if (totalCount > COLLECTION_MAX_ITEMS_WARNING) {
            confirmAlert({
              title: 'Cảnh báo số lượng video',
              message: `Mỗi bộ sưu tập có nhiều hơn ${COLLECTION_MAX_ITEMS_WARNING} video có thể làm chậm tốc độ xử lý. Bạn đang thêm ${newVideoCount} video vào BST "${selectedCol?.name}" có ${currentVideoCount} video. Bạn có chắc chắn muốn thêm?`,
              buttons: [
                {
                  label: 'Tiếp tục',
                  onClick: async () => {
                    setIsLoading(true);
                    await dispatch(
                      actionSaveVideoToCollection(
                        selectedCollection?.value,
                        '',
                        chosenVideos
                      )
                    );
                    dispatch(actionUpdateChosenVideos([]));
                    setIsLoading(false);
                    toast.success('Lưu video vào BST thành công');
                    onClose();
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

        // create new collection when user input new collection name
        // const videos = chosenVideos.map((video) => ({
        //   video_id: video.post_id,
        //   feed_name: video.feed_username,
        //   avatar: video.thumbnail,
        // }));
        if (collectionName) {
          const newVideoCount = chosenVideos.length;
          
          if (newVideoCount > COLLECTION_MAX_ITEMS_WARNING) {
            confirmAlert({
              title: 'Cảnh báo số lượng video',
              message: `Bạn đang tạo bộ sưu tập mới với ${newVideoCount} video. Mỗi bộ sưu tập có nhiều hơn ${COLLECTION_MAX_ITEMS_WARNING} video có thể làm chậm tốc độ xử lý. Bạn có chắc chắn muốn tạo?`,
              buttons: [
                {
                  label: 'Tiếp tục',
                  onClick: async () => {
                    setIsLoading(true);
                    await dispatch(
                      actionSaveVideoToCollection(0, collectionName, chosenVideos)
                    );
                    dispatch(actionUpdateChosenVideos([]));
                    setIsLoading(false);
                    toast.success('Đã tạo vào lưu video vào BST thành công');
                    onClose();
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
          
          setIsLoading(true);
          await dispatch(
            actionSaveVideoToCollection(0, collectionName, chosenVideos)
          );
          dispatch(actionUpdateChosenVideos([]));
          setIsLoading(false);
          toast.success('Đã tạo vào lưu video vào BST thành công');
          onClose();
        } else {
          // save video to collection
          await dispatch(
            actionSaveVideoToCollection(
              selectedCollection?.value,
              '',
              chosenVideos
            )
          );
          // clear chosen videos
          dispatch(actionUpdateChosenVideos([]));
          setIsLoading(false);
          toast.success('Lưu video vào BST thành công');
          onClose();
        }
        break;

      default:
        break;
    }
  }, [
    modalCollectionType,
    collectionName,
    currentCollection,
    selectedCollection,
    chosenVideos,
    dispatch,
    onClose,
  ]);

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
                {isLoading && (
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
