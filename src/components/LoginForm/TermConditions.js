import React from "react";

const TermConditions = (props) => {
  const { isOpen, setIsOpen } = props;

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="ManageSchedulesContainer fixed left-0 top-0 z-9999 w-full h-screen">
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none max-h-screen">
        <div
          className="relative w-11/12 mx-auto"
          style={{ maxHeight: 'calc(100vh - 40px)' }}
        >
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*body*/}
            <div className="relative">
              <iframe
                src="https://xaynhom.com/dieu-khoan-su-dung/"
                className="w-full h-screen rounded-lg pt-6"
                style={{ maxHeight: "calc(100vh - 8rem)" }}
              ></iframe>
            </div>
            {/* footer */}
            <div className="mb-4 flex gap-4 px-6">
              <button
                className="border-2 border-gray-200 bg-gray-100 hover:bg-blue-50 py-3 px-4 text-gray-500 rounded-md"
                onClick={() => toggle()}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"
      onClick={() => toggle()}
      ></div>
    </div>
  );
}

export default TermConditions;