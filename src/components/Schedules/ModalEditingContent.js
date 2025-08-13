import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentEditingContent,
  updateEditingContent,
} from '../../store/actions/Schedules';
import { Dialog, Transition } from '@headlessui/react';
import { FiX } from 'react-icons/fi';
import { Button } from 'reactstrap';

const ModalEditingContent = () => {
  const { currentChangeContent = null } = useSelector(
    (state) => state.schedules
  );

  const [postText, setPostText] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentChangeContent) {
      setPostText(currentChangeContent.text);
    }
  }, [currentChangeContent]);

  const onClose = () => {
    dispatch(setCurrentEditingContent(null));
  };

  const onSave = () => {
    const currentContent = {
      ...currentChangeContent,
      text: postText,
    };
    dispatch(updateEditingContent(currentContent));
    onClose();
  };

  return (
    <Transition appear show={true} as={Fragment}>
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
              <Dialog.Panel className="w-1/2 transform rounded-lg pb-3 bg-white text-left align-middle shadow-xl transition-all relative">
                <div className="flex justify-between border-b border-gray-200 pb-2 px-3 pt-3">
                  <h5 className="font-bold text-base">Sửa nội dung</h5>
                  <FiX
                    size={35}
                    onClick={onClose}
                    className="bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 p-1"
                  />
                </div>
                <div className="px-3">
                  {/* form changing content */}
                  <div className="mt-4">
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={10}
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                    />
                  </div>
                  {/* button */}
                  <div className="flex justify-end mt-4 px-3 gap-3">
                    <Button
                      color="blue"
                      className="mr-2border-2 border-gray-200 bg-blue-800 hover:bg-blue-400 py-3 px-4 text-white rounded-md"
                      onClick={() => onSave()}
                    >
                      Lưu
                    </Button>
                    <Button
                      color="red"
                      onClick={onClose}
                      className="border-2 border-gray-200 bg-gray-100 hover:bg-blue-50 py-3 px-4 text-gray-500 rounded-md"
                    >
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

export default ModalEditingContent;
