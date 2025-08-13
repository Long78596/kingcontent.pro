import React, { useRef, useState } from 'react';
import OKIcon from '../../assets/images/icon/ok.png';
import Select from './Select';
import PopoverTag from './popoverTag';

function Search(props) {
  const { params, setParams, onSearch } = props;
  const op = useRef(null);
  return (
    <div className="rounded-md p-3 bg-white shadow-smBlackShadow">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-base font-bold">
            Link trang (Fanpage; Group; Profile)
          </h2>
          <input
            className="border outline-none rounded-md mt-2 mb-5 p-2 w-full"
            placeholder="Ví dụ: https://wwww.facebook.com/abc"
            defaultValue={params.link}
            onChange={(e) => setParams({ ...params, link: e.target.value })}
          />
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-base font-bold">Gắn nhãn</h2>
              <PopoverTag op={op} params={params} setParams={setParams} />
              <div className="">
                <input
                  className="border outline-none rounded-md mt-2 mb-5 p-2 w-full"
                  placeholder="Chọn nhãn hoặc tạo nhãn mới ..."
                  onClick={(e) => op.current.toggle(e)}
                  defaultValue={params.name || ''}
                />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold">Số lượng cần lấy</h2>
              <div className="mt-2 mb-5 flex">
                <div className="w-5/6">
                  <Select params={params} setParams={setParams} />
                </div>
                <div className="w-1/6">
                  <div
                    onClick={onSearch}
                    className="group float-right w-12 h-10 p-1.5 rounded-md border bg-blue-600 hover:bg-blue-400 transition-all duration-200 ease-linear cursor-pointer flex items-center justify-center"
                  >
                    <img src={OKIcon} className="w-6 inset-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
