import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getQuestionPromt } from '../../../../store/actions/createContent';
import { CHAT } from '../../utility';
import PerfectScrollbar from 'react-perfect-scrollbar';

const BankQuestionPromt = ({ setInputValue, setTabSelected }) => {
  const { bankQuestionList } = useSelector((state) => state.createPost);
  const handleSeachTitle = (question) => {
    setInputValue(question);
    setTabSelected(CHAT);
    toast.success(
      'Câu hỏi đã được thêm vào trình nhập nội dung . Vui lòng chỉnh sửa hoặc bấm gửi để tìm kiếm câu hỏi !'
    );
  };
  const renderTitleChild = () => {
    const questions = bankQuestionList.map((_ques) => {
      const anwerRevert = (_ques.title + '').replace(/\\/g, '');
      return {
        ..._ques,
        content: anwerRevert,
      };
    });
    return (
      <>
        <div className="flex flex-col">
          <PerfectScrollbar className="flex-grow overflow-auto max-h-500">
            {questions.length === 0 ? (
              <div className="flex justify-center">
                <span>Không có dũ liệu hiển thị</span>
              </div>
            ) : (
              <>
                {questions.map((_elt, index) => {
                  return (
                    <div
                      className="flex py-3 items-center cursor-pointer border-b-2 border-dashed border-gray-200"
                      onClick={() => handleSeachTitle(_elt.content)}
                      key={index}
                    >
                      <div
                        className="bg-blue-500 text-white flex justify-center items-center rounded-md"
                        style={{ width: '30px', height: '30px' }}
                      >
                        {index + 1}
                      </div>
                      <span className="px-2  w-full">{_elt.content}</span>
                    </div>
                  );
                })}
              </>
            )}
          </PerfectScrollbar>
        </div>
      </>
    );
  };
  return <div className="w-full p-2">{renderTitleChild()}</div>;
};

export default BankQuestionPromt;
