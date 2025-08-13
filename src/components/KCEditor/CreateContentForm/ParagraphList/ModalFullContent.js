import { memo, useCallback, useEffect, useState } from 'react';
import { DocumentTextIcon, XIcon } from '@heroicons/react/outline';
import PerfectScrollbar from 'react-perfect-scrollbar';

const ModalFullContent = (props) => {
  const {
    paragraph = '',
    fullContent = '',
    setShowModalFullContent,
    addContentToEditor,
  } = props;

  const [showFullContent, setShowFullContent] = useState(fullContent);

  useEffect(() => {
    if (fullContent) {
      if (paragraph) {
        const destructContent = fullContent.replace(
          paragraph,
          `<span className="bg-yellow-200 p-1">${paragraph}</span>`
        );
        setShowFullContent(destructContent);
      } else {
        setShowFullContent(fullContent);
      }
    } else {
      setShowFullContent('');
    }
  }, [paragraph, fullContent]);

  const clickToHideModal = useCallback(() => {
    setShowModalFullContent(false);
  }, [setShowModalFullContent]);

  const handleAddButton = useCallback(
    (fullContent = '') => {
      addContentToEditor(fullContent, false);
      clickToHideModal();
    },
    [addContentToEditor, clickToHideModal]
  );

  return (
    <div className="modalFullContent z-9999 fixed top-0 left-0 right-0 h-screen bg-createContent-modalOverLayClr pt-16">
      <div className="mx-auto my-0 w-1/2 max-h-80 bg-gray-200 rounded-md shadow-md">
        <div className="w-full h-14 flex items-center justify-between py-0 px-5 bg-createContent-blueClr text-white outline-none ">
          <DocumentTextIcon className="h-8 w-8" />
          <h2 className="text-base uppercase font-semibold ">
            Nội dung đầy đủ
          </h2>
          <XIcon
            className="bg-createContent-lightBlueClr rounded-full h-8 w-8 p-1 text-createContent-grayClr transition-all cursor-pointer hover:text-createContent-blackClr "
            onClick={() => clickToHideModal()}
          />
        </div>
        <PerfectScrollbar className="mt-2 max-h-40 p-3">
          <div dangerouslySetInnerHTML={{ __html: showFullContent }}></div>
        </PerfectScrollbar>
        <div className="w-full h-14 flex items-center justify-end py-0 px-5 outline-none border-t border-gray-400">
          <button
            className="p-2 border border-gray-500 rounded mr-2"
            onClick={() => clickToHideModal()}
          >
            Đóng
          </button>
          <button
            className="p-2 bg-createContent-blueClr text-white border rounded"
            onClick={() => {
              handleAddButton(fullContent);
            }}
          >
            Đưa vào bài viết
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ModalFullContent);
