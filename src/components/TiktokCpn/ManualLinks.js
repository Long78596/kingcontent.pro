import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert';

const ManualLinks = (props) => {
  const { open, setOpen, setManualLinks, onSearch, setSearchType } = props;
  const [text, setText] = useState('');

  const onChange = (e) => {
    setText(e.target.value);
  };

  const onClickConfirm = (e) => {
    confirmAlert({
      title: 'Xác nhận',
      message:
        'Danh sách video sẽ thay thế kết quả tìm kiếm bên dưới, bạn có chắc chắn thực hiện điều này?',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: () => {
            setSearchType('video');
            onSearch(e, text);
            setOpen();
          },
        },
        {
          label: 'Hủy',
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-9999 max-w-lg mt-1 w-1/3"
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
              <Dialog.Panel className="w-auto transform overflow-hidden rounded-md bg-white p-6 text-center align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-base font-medium text-gray-900"
                >
                  Link thủ công từ Tiktok
                </Dialog.Title>
                <div className="mt-2 text-left">
                  <p className="text-red-500 font-bold">
                    Kết quả của danh sách link thủ công sẽ thay thế kết quả tìm
                    kiếm, các bài đã chọn ở kết quả tìm kiếm sẽ bị mất.
                  </p>
                  <p className="notice mt-2">
                    Nhập link video tại đây, mỗi video 1 hàng (vui lòng chọn
                    link video hợp lệ để việc lên lịch được hoàn chỉnh) ví dụ:{' '}
                    <br />
                    https://www.tiktok.com/@marketing.tuhoc/video/7233385227521936645
                    <br />
                    https://www.tiktok.com/@marketing.tuhoc/video/7229316079787560219{' '}
                    <br />
                    https://www.tiktok.com/@marketing.tuhoc/video/7222999770938281242
                  </p>
                </div>
                <div className="mt-4">
                  <textarea
                    className="w-full h-40 rounded-md shadow-sm border-gray-100 border-2 outline-none p-2"
                    placeholder="Nhập link video ..."
                    value={text}
                    onChange={onChange}
                  ></textarea>
                </div>

                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={setOpen}
                  >
                    Đóng
                  </button>
                  <Button
                    className="px-4 py-2 bg-primary text-white hover:text-primary flex justify-center items-center rounded-lg hover:bg-white border"
                    onClick={(e) => onClickConfirm(e)}
                  >
                    Xác nhận
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ManualLinks;
