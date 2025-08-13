import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { FiXCircle } from 'react-icons/fi';

const DetailTiktok = ({ open, setOpen, obj }) => {
  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-9999 max-w-lg mt-1"
          onClose={setOpen}
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
                <Dialog.Panel className="w-auto max-w-md transform rounded-md bg-white p-6 text-center align-middle shadow-xl transition-all max-h-90 overflow-auto relative">
                  <iframe
                    style={{ minHeight: '50rem' }}
                    className="inline-block mt-2"
                    name="__tt_embed__v87519336200593150"
                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-top-navigation allow-same-origin"
                    src={`https://www.tiktok.com/embed/v2/${obj?.post_id}`}
                  ></iframe>

                  <button
                    type="button"
                    className="absolute top-0 right-0 rounded-md border border-transparent p-2 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={setOpen}
                  >
                    <FiXCircle color="red" className="w-5 h-5" />
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
export default DetailTiktok;
