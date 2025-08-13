import React, { useEffect, useState } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import aimIcon from '../../../../assets/images/icon/create-content/aim.png';
import {
  actionQuestionChatGPT,
  actionUpdateSyncRequestPedding,
  getBankQuestion,
} from '../../../../store/actions/createContent';
import { toast } from 'react-toastify';
import { CHAT } from '../../utility';
import PerfectScrollbar from 'react-perfect-scrollbar';

const BankQuestion = ({ setInputValue, setTabSelected }) => {
  const dispatch = useDispatch();
  const [titleChildSelect, setTitleChildSelect] = useState('');
  const { bankQuestionList, syncRequestPedding } = useSelector(
    (state) => state.createPost
  );
  const [titleChildStatus, setTitleChild] = useState(false);
  const handleSeachTitle = (question) => {
    setInputValue(question);
    setTabSelected(CHAT);
    toast.success(
      'Câu hỏi đã được thêm vào trình nhập nội dung . Vui lòng chỉnh sửa hoặc bấm gửi để tìm kiếm câu hỏi !'
    );
  };
  const handleGetContentChild = async (keyword) => {
    setTitleChildSelect(keyword);
    setTitleChild(true);
  };
  useEffect(() => {
    dispatch(getBankQuestion());
  }, []);
  const renderTitleChild = () => {
    const questions = bankQuestionList
      .find((_elt) => _elt.name === titleChildSelect)
      .suggestions.map((_ques) => {
        const anwerRevert = (_ques.content + '').replace(/\\/g, '');
        return {
          ..._ques,
          content: anwerRevert,
        };
      });
    return (
      <>
        <div className="mt-5 relative flex justify-center mb-3 items-center">
          <button
            onClick={() => setTitleChild(false)}
            className="bg-blue-500 hover:bg-red-500 text-white p-2 rounded-md flex gap-1 items-center absolute left-0"
          >
            {' '}
            <BiArrowBack size={20} />
          </button>
          <span className="font-bold text-base">{titleChildSelect}</span>
        </div>
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
                        className="bg-blue-500 text-white flex justify-center items-center rounded-md  w-1/6"
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
  return (
    <div className="w-full p-2">
      {titleChildStatus ? (
        renderTitleChild()
      ) : (
        <div className="overflow-scroll overflow-x-hidden max-h-screen mb-20">
          {bankQuestionList.map(({ name }, index) => (
            <div
              className="flex justify-between items-center hover:bg-gray-200 cursor-pointer"
              key={index}
              onClick={() => handleGetContentChild(name)}
            >
              <span
                className={`pb-2 pt-2  pl-1 rounded-lg cursor-pointer font-bold`}
              >
                - {name}
              </span>
              <span
                className="pr-2"
                onClick={() => handleGetContentChild(name)}
              >
                <img src={aimIcon} className="w-5" />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BankQuestion;
