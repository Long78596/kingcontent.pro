import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getHistory } from '../../../store/actions/createContent';
import { actionLoadingApp } from '../../../store/actions/loading';
import { BANK, CHAT, DOWNLOAD, ISUE, PEDDING, _TAB } from '../utility';
import BankQuestion from './chatGPTCpn/bankQuestion';
import Chat from './chatGPTCpn/chat';
import Isue from './chatGPTCpn/isue';
import Saved from './chatGPTCpn/saved';
import SyncRequest from './chatGPTCpn/syncRequest';

const ChatGPTSceen = () => {
  const { syncRequestPedding, historyQuestionList } = useSelector(
    (state) => state['createPost']
  );
  const dispatch = useDispatch();
  const [_tabSelected, setTabSelected] = useState(CHAT);
  const [inputValue, setInputValue] = useState('');

  const renderScreen = () => {
    switch (_tabSelected) {
      case CHAT:
        return <Chat inputValue={inputValue} setInputValue={setInputValue} />;
      case ISUE:
        // @ts-ignore
        return <Isue setTabSelected={setTabSelected} />;
      case BANK:
        return (
          <BankQuestion
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
          className="grid grid-cols-5 -mb-px font-medium text-center"
          id="myTab"
          data-tabs-toggle="#myTabContent"
          role="tablist"
        >
          {_TAB.map(({ title, icon, type }, index) => (
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
                    {historyQuestionList.length > 0 &&
                      historyQuestionList.filter(
                        (item) => item.type !== 'threads'
                      ).length}
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

export default ChatGPTSceen;
