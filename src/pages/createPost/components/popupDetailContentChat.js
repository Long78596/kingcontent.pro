import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState, useEffect } from 'react';
import { FiClipboard, FiX, FiPlusCircle } from 'react-icons/fi';
import { toggleEditorText } from '../../../store/actions/createContent';
import { useDispatch } from 'react-redux';

const PopupDetailContentChat = (props) => {
  const {
    isOpen = true,
    toggle,
    content = '',
    question,
    replace = false,
    isSchedule = false,
  } = props;
  const [splitContent, setSplitContent] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const spContent = content.split('\n');
    // remove empty string
    const splitContentFilter = spContent.filter((item) => {
      return item.trim() !== '' && item.trim() !== '<br />';
    });
    setSplitContent(splitContentFilter);
  }, [content]);

  const handleClickAddToEditor = (item) => {
    dispatch(toggleEditorText(item, false, true));
  };

  const handleClickAddAllToEditor = () => {
    dispatch(toggleEditorText(content, replace, true));
    toggle();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-9999 max-w-lg mt-1 "
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
                <div className="flex justify-between items-center border-b-2 border-gray-400 mb-4">
                  <span className="font-bold text-base">{question}</span>
                  <button onClick={() => toggle(content)}>
                    <FiX size="25" color="red" />
                  </button>
                </div>
                {splitContent.length > 1 ? (
                  <div className="listContents">
                    {splitContent.map((item, idx) => (
                      <div
                        className="item mb-3 flex gap-2 w-full items-center"
                        key={idx}
                      >
                        <p
                          className=""
                          dangerouslySetInnerHTML={{ __html: item }}
                        ></p>
                        {/* buttton add to editor */}
                        {!isSchedule && (
                          <button
                            className="ml-auto text-green-500 p-2 rounded-full cursor-pointer"
                            onClick={() => handleClickAddToEditor(item)}
                          >
                            <FiPlusCircle size="30" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p dangerouslySetInnerHTML={{ __html: content }}></p>
                )}
                {/* actions */}
                {!isSchedule && (
                  <div className="flex justify-end mt-4">
                    <button
                      className="bg-green-500 text-white p-2 rounded-md"
                      onClick={() => handleClickAddAllToEditor()}
                    >
                      ĐƯA VÀO TRÌNH SOẠN THẢO
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PopupDetailContentChat;
