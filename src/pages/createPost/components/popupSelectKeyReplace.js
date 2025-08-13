import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
const PopupSelectKeyReplace = ({
  isOpenPopupSelectKey,
  toggleOpenPopupRepl,
  listKeyRepl = [],
  keySelect,
  replaceKeySelectVPCS,
}) => {
  return (
    <>
      <Transition appear show={isOpenPopupSelectKey} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-9999 max-w-lg mt-1"
          style={{ maxWidth: '50%' }}
          onClose={toggleOpenPopupRepl}
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
                  <h3>
                    Thay thế từ : <b>{keySelect}</b>{' '}
                  </h3>
                  <div
                    className="w-full bg-gray-400 mb-2"
                    style={{ height: '1px' }}
                  ></div>
                  {listKeyRepl.map((_elt, index) => (
                    <li
                      key={index}
                      className="
                         font-bold tooltip mb-3 cursor-pointer hover:text-red-600"
                      onClick={() => replaceKeySelectVPCS(_elt)}
                    >
                      {_elt}
                    </li>
                  ))}
                  <div className="mt-16 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-blue-600 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 font-bold"
                      onClick={() => toggleOpenPopupRepl('')}
                    >
                      Trở về
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default PopupSelectKeyReplace;
