import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';
import { FiLoader, FiSave, FiX } from 'react-icons/fi';
import Select from 'react-select';
import { Button } from 'rsuite';
import { Label } from 'reactstrap';
import { actionUpdateCurrentVideo } from '../../store/actions/videoEditor';
import { toast } from 'react-toastify';

const ModalHashTag = (props) => {
  const { modalHashTagOpen, onClose } = props;
  // @ts-ignore
  const { hashtags = [], isUpdating = false, currentVideo = null } = useSelector((state) => state.videoEditor);

  const [selectedHashTag, setSelectedHashTag] = useState(null);
  const [hashTagOptions, setHashTagOptions] = useState([]);
  const [newHashTag, setNewHashTag] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    if (hashtags && hashtags.length > 0) {
      const options = hashtags.map((tag) => ({
        value: tag,
        label: tag,
      }));
      setHashTagOptions(options);
    } else {
      setHashTagOptions([]);
    }
  }, [hashtags]);

  const onSave = async() => {
    if (newHashTag) {
      dispatch(actionUpdateCurrentVideo({
        id: currentVideo.id,
        hashTag: newHashTag
      }, true));
    } else if (selectedHashTag) {
      dispatch(actionUpdateCurrentVideo({
        id: currentVideo.id,
        hashTag: selectedHashTag.label
      }, true));
    } else {
      toast.error("Vui lòng chọn hoặc thêm một hashtag trước khi lưu", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
      return;
    }
    onClose();
  };

  useEffect(() => {
    if (currentVideo && currentVideo.hash_tag) {
      const selectedOption = hashTagOptions.find((option) => option.value === currentVideo.hash_tag);
      setSelectedHashTag(selectedOption || null);
    }
  }, [currentVideo, hashTagOptions]);

  return (
    <Transition appear show={modalHashTagOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-9999 max-w-md mt-1"
        style={{ maxWidth: '50%' }}
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
                <div className="flex justify-between border-b border-gray-200 pb-2 px-3 pt-3">
                  <h5 className="font-bold text-base">Chọn Hashtag</h5>
                  <FiX
                    size={35}
                    onClick={onClose}
                    className="bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 p-1"
                  />
                </div>
                <div className="px-3">
                  {hashTagOptions.length > 0 && (
                    <div className="mt-4">
                      <Label className="block font-bold mb-2">Chọn Hashtag</Label>
                      <Select
                        options={hashTagOptions}
                        placeholder="Chọn hashtag"
                        value={selectedHashTag}
                        onChange={(e) => setSelectedHashTag(e)}
                      />
                    </div>
                  )}
                  <div className="mt-4">
                    <Label className="block font-bold mb-2">Thêm Hashtag Mới</Label>
                    <input
                      type="text"
                      placeholder="Nhập hashtag mới"
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={newHashTag}
                      onChange={(e) => setNewHashTag(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end mt-4 px-3">
                    <Button
                      color="blue"
                      className={`mr-2 flex gap-1 items-center text-nowrap flex-nowrap ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isUpdating}
                      onClick={() => onSave()}
                    >
                      {isUpdating ? <FiLoader className="animate-spin" size={20} /> : <FiSave size={20} />}
                      <span>{isUpdating ? 'Đang lưu...' : 'Lưu'}</span>
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

export default ModalHashTag;