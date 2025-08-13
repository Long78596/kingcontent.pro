import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CreateContent } from '../../../services/createContent';
import { actionLoadingApp } from '../../../store/actions/loading';
import { CHAT_GPT_TOOLS_TEXT_STEP_2, DEFAULT } from '../utility';
import ChatGPTSceenPromt from './ChatGPTSceenPromt';
import { isArrayEmpty, OK } from '../../../configs';
import { ACTION_GET_BANK_QUESTION } from '../../../store/actions/createContent';

const ChatGPTTools = ({ stepName, setStepName, setIsChild }) => {
  const [categories, setCategories] = useState([]);
  const [cateChild, setCateChild] = useState([]);
  const dispatch = useDispatch();
  const handleSelect = (childs, questions) => {
    dispatch({
      type: ACTION_GET_BANK_QUESTION,
      payload: questions,
    });
    //check cate child
    if (childs && !isArrayEmpty(childs) && stepName === 'STEP_1') {
      setIsChild(true);
      setStepName('STEP_2');
      setCateChild(childs);
    } else if (childs && isArrayEmpty(childs) && stepName === 'STEP_1') {
      setIsChild(false);
      setStepName('STEP_3');
      setCateChild(childs);
    } else if (stepName === 'STEP_2') {
      setIsChild(true);
      setStepName('STEP_3');
    }
  };
  const renderItemsCate = (_cates) => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 p-5">
        {_cates.map((_elt, index) => (
          <div key={index}>
            <div
              className="border-2 border-gray-200 bg-gray-100 rounded-lg p-4 h-26 hover:bg-blue-50 cursor-pointer flex justify-center transition-all"
              onClick={() => {
                handleSelect(_elt.childs, _elt.questions);
              }}
            >
              <img src={_elt.icon} className="w-16" />
            </div>
            <p className="text-center"> {_elt.name}</p>
          </div>
        ))}
      </div>
    );
  };
  useEffect(() => {
    const getCate = async () => {
      dispatch(actionLoadingApp(true));
      const res = await CreateContent.getChatGPTcategories();
      if (res.status === OK) {
        setCategories(res?.data?.data || []);
        dispatch(actionLoadingApp(false));
      }
    };
    getCate();
  }, []);

  return (
    <>
      {stepName === 'STEP_1' ? (
        renderItemsCate(categories)
      ) : stepName === 'STEP_2' ? (
        renderItemsCate(cateChild)
      ) : (
        <ChatGPTSceenPromt />
      )}
    </>
  );
};

export default ChatGPTTools;
