import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { _dashed_border } from '../../../pages/createPost/utility';
import CreatableSelect from 'react-select/creatable';
import { fanpageService } from '../../../services/fanpages';
import client from '../../../Client';
import { API_FANPAGES, OK } from '../../../configs';
import { toast } from 'react-toastify';
const PopupSelectTag = ({
  isOpen = true,
  setOpen,
  options,
  handleChageHashTag,
  item,
  reRenderList,
}) => {
  const [value, setValue] = useState('');
  const handleUpdateTag = async () => {
    const data = {
      label_id: value.id,
    };
    const res = await client.put(`/saved-fanpages/${item.id}`, data);
    if (res.status === OK) {
      reRenderList && reRenderList();
      toast.success('Cập nhật thành công !');
      setOpen(false);
    }
  };
  useEffect(() => {
    if (item) {
      setValue(item);
    }
  }, [isOpen]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-9999 max-w-lg mt-1"
          style={{ maxWidth: '80%' }}
          onClose={() => {}}
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
            <div className="flex min-h-full items-center justify-center p-4 text-center relative">
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
                  className=" transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
                  style={{ height: '500px', width: '500px' }}
                >
                  <div className="flex justify-between items-center">
                    <h2 className="font-bold  uppercase">Chọn nhãn</h2>
                    <div>
                      <button
                        className="rounded-full p-1 bg-gray-400"
                        onClick={() => setOpen(false)}
                      >
                        <FiX size={25} color="#fff" />
                      </button>
                    </div>
                  </div>
                  <div className={_dashed_border}></div>
                  <CreatableSelect
                    menuIsOpen={true}
                    options={options}
                    value={options.find((item) => item.value === value.id)}
                    placeholder="Chọn nhãn hoặc tạo nhãn mới ..."
                    formatCreateLabel={(userInput) => `Tạo nhãn : ${userInput}`}
                    type="creatable"
                    onChange={(original) => {
                      setValue(original);
                      handleChageHashTag && handleChageHashTag(original);
                    }}
                  />
                  <div className="absolute bottom-5 right-5">
                    <button
                      className="p-3 rounded-md bg-blue-500 text-white w-full hover:bg-gray-500"
                      onClick={handleUpdateTag}
                      type="submit"
                    >
                      Cập nhật
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

export default PopupSelectTag;
