import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { FiX } from 'react-icons/fi';

const ModalShowVideo = ({ isOpen, toggle, id }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-9999 max-w-md mt-1"
        style={{ maxWidth: '30%' }}
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
              <Dialog.Panel
                className="w-30% transform overflow-hidden rounded-lg bg-white px-6 pt-2 text-left align-middle shadow-xl transition-all"
                // style={{ height: '50%' }}
              >
                <div className="flex justify-end">
                  <FiX
                    size={35}
                    onClick={toggle}
                    className="bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 p-1"
                  />
                </div>
                <div className="flex justify-center">
                  <iframe
                    style={{ minHeight: '50rem' }}
                    className="inline-block mt-2"
                    name="__tt_embed__v87519336200593150"
                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-top-navigation allow-same-origin"
                    src={`https://www.tiktok.com/embed/v2/${id}`}
                  ></iframe>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalShowVideo;
