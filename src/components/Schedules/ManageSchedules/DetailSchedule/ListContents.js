import React, { useEffect, useState } from 'react';
import SingleContent from './SingleContent';

const ListContents = (props) => {
  const { contents, listSelected, setListSelected } = props;
  const [isCheckedAll, setIsCheckedAll] = useState(false);

  useEffect(() => {
    if (
      listSelected &&
      contents &&
      listSelected.length === contents.length &&
      contents.length > 0
    ) {
      setIsCheckedAll(true);
    } else {
      setIsCheckedAll(false);
    }
  }, [listSelected, contents]);

  const onClickSelectAll = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setListSelected(contents);
    } else {
      setListSelected([]);
    }
  };
  return (
    <div className="list-contents p-2 border rounded-md border-gray-400">
      {/* headers */}
      <div className="flex gap-2 items-center mb-2 p-2 border-b text-center font-bold">
        <div className="">
          <input
            type="checkbox"
            className="w-5 h-5"
            title="Chọn tất cả"
            onClick={onClickSelectAll}
            checked={isCheckedAll}
          />
        </div>
        <div className="w-3/12">Nội dung</div>
        <div className="w-2/12">Ngày đăng</div>
        <div className="w-2/12">Trạng thái</div>
        <div className="w-2/12">Nơi đăng</div>
        <div className="w-1/12">Link bài gốc</div>
        <div className="w-1/12">Nguồn bài viết</div>
        <div className="w-1/12 text-right">Hành động</div>
      </div>
      <div className="max-h-manage-schedules overflow-auto w-full text-center">
        {contents &&
          contents?.map((content, index) => (
            <SingleContent
              key={index}
              content={content}
              index={index}
              listSelected={listSelected}
              setListSelected={setListSelected}
            />
          ))}
      </div>
    </div>
  );
};

export default ListContents;
