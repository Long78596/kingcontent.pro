import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getHistory } from '../../../store/actions/createContent';
import { actionLoadingApp } from '../../../store/actions/loading';
import { BANK, CHAT, DOWNLOAD, PEDDING, _TAB_CHAT_GPT_PROMT } from '../utility';
import BankQuestionPromt from './chatGPTCpn/bankQuestionPromt';
import Chat from './chatGPTCpn/chat';
import Saved from './chatGPTCpn/saved';
import SyncRequest from './chatGPTCpn/syncRequest';
const ChatGPTSceenPromt = () => {
  const { syncRequestPedding, historyQuestionList } = useSelector(
    (state) => state.createPost
  );
  const dispatch = useDispatch();
  const [_tabSelected, setTabSelected] = useState(BANK);
  const [inputValue, setInputValue] = useState('');
  const renderScreen = () => {
    switch (_tabSelected) {
      case CHAT:
        return <Chat inputValue={inputValue} setInputValue={setInputValue} />;
      case BANK:
        return (
          <BankQuestionPromt
            setInputValue={setInputValue}
            setTabSelected={setTabSelected}
          />
        );
      case PEDDING:
        return <SyncRequest />;
      case DOWNLOAD:
        return <Saved />;
      default:
        return <Chat />;
    }
  };
  const handleSelectTab = (type) => {
    setTabSelected(type);
  };
  useEffect(() => {
    dispatch(actionLoadingApp(false));
    dispatch(getHistory());
  }, []);

  return (
    <div className="px-3 ">
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul
          className="grid grid-cols-4 -mb-px font-medium text-center"
          id="myTab"
          data-tabs-toggle="#myTabContent"
          role="tablist"
        >
          {_TAB_CHAT_GPT_PROMT.map(({ title, icon, type }, index) => (
            <li
              className={`"mr-2 p-4 border-b-2 rounded-t-lg flex items-center hover:border-blue-700 ${
                _tabSelected === type &&
                'border-blue-700 transition-all duration-700 cursor-pointer'
              }`}
              id="profile-tab"
              role="presentation"
              key={index}
              onClick={() => handleSelectTab(type)}
            >
              <div className="relative flex justify-center items-center">
                {type === PEDDING && (
                  <div className="absolute text-green">
                    {syncRequestPedding.length}
                  </div>
                )}
                {type === DOWNLOAD && (
                  <div className="absolute  2xl:top-0 xl:-top-2 md:-top-2 right-0 w-3 h-3">
                    {historyQuestionList.length}
                  </div>
                )}
                <img
                  src={icon}
                  width={35}
                  className={
                    type === PEDDING && syncRequestPedding.length > 0
                      ? 'animate-spin'
                      : ''
                  }
                />
              </div>
              <button
                className={`${
                  _tabSelected === type ? '' : null
                } data-tabs-target="#profile" type="button`}
                role="tab"
                aria-controls="profile"
                aria-selected="false"
              >
                <span className="ml-2 text-md font-medium">{title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* ==========RENDER SCREEN=========== */}
      <div>{renderScreen()}</div>
    </div>
  );
};

export default ChatGPTSceenPromt;
