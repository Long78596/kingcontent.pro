import React, { Fragment, useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { actionResetState } from '../../store/actions/createContent';
import { actionLoadingApp } from '../../store/actions/loading';
import Action from './components/action';
import Check from './components/check';
import Special from './components/special';
import Commit from './components/commit';
import Coupon from './components/coupon';
import Discount from './components/discount';
import Emoji from './components/emoji';
import Designs from './components/Designs';
import Trend from './components/Trend';
import Trending from './components/trending';
import Upload from './components/upload';
import FacebookPresets from './components/FacebookPresets';

import {
  CHAT_GPT,
  CHAT_GPT_TOOLS_TEXT,
  CHAT_GPT_TOOLS_TEXT_STEP_2,
  ContentDataStyled,
  FACEBOOK_PRESETS,
  FEEDBACKS,
  getTitle,
  REGENERATE,
  THREADS,
} from './utility';
import {
  ACTION,
  CHECK,
  SPECIAL,
  COMMIT,
  COUPON,
  DEFAULT,
  DISCOUNT,
  EMOJI,
  IDEA,
  DESIGNS,
  TEXT,
  TOOLS_ARR,
  TREND,
  TRENDING,
  UPLOAD,
} from './utility';
import ChatGPTSceen from './components/chatGPTSceen';
import {
  changeStateFeedbacksForm,
  resetFeedbackData,
} from '../../store/actions/editor/editorActions';
import ChatGPTTools from './components/chatGPTTools';
import Idea from './components/Idea';
import ThreadsTool from './components/ThreadsTool';
import RegenerateResources from './components/RegenerateResources';

const Tools = ({
  titleType,
  setTitleType,
  setIsEditor,
  images,
  setImages,
  setIsRightImage,
  setImagesRightEditor,
}) => {
  const { isCreateToHomepage } = useSelector((state) => state['createPost']);
  const dispatch = useDispatch();
  const [stepName, setStepName] = useState('STEP_1');
  const [isChild, setIsChild] = useState(false);

  const resetFeedback = () => {
    if (titleType === CHAT_GPT_TOOLS_TEXT && stepName === 'STEP_3' && isChild) {
      setIsChild(false);
      setStepName('STEP_2');
      return;
    }
    if (
      titleType === CHAT_GPT_TOOLS_TEXT &&
      stepName === 'STEP_3' &&
      !isChild
    ) {
      setStepName('STEP_1');
      return;
    } else if (titleType === CHAT_GPT_TOOLS_TEXT && stepName === 'STEP_2') {
      setStepName('STEP_1');
      return;
    } else {
      setTitleType(DEFAULT);
      dispatch(actionResetState());
      return;
    }
  };
  const selectType = (type) => {
    if (type === FEEDBACKS) {
      dispatch(resetFeedbackData());
      dispatch(changeStateFeedbacksForm(true));
    } else {
      setTitleType(type);
      dispatch(actionLoadingApp(true));
    }
  };

  const renderContentType = () => {
    switch (titleType) {
      case CHAT_GPT_TOOLS_TEXT:
        return (
          <ChatGPTTools
            stepName={stepName}
            setStepName={setStepName}
            setIsChild={setIsChild}
            isChild={isChild}
          />
        );

      case TREND:
        return <Trend />;

      case COMMIT:
        return <Commit />;

      case DISCOUNT:
        return <Discount />;

      case ACTION:
        return <Action />;

      case IDEA:
        return <Idea />;

      case COUPON:
        return <Coupon />;

      // case TEXT:
      //   return <TextWrite />;

      case EMOJI:
        return <Emoji />;

      case CHECK:
        return <Check />;

      case DESIGNS:
        return (
          <Designs
            setIsRightImage={setIsRightImage}
            setImagesRightEditor={setImagesRightEditor}
            setIsEditor={setIsEditor}
          />
        );

      case UPLOAD:
        return (
          <Upload
            setIsEditor={setIsEditor}
            images={images}
            setImages={setImages}
          />
        );

      case SPECIAL:
        return <Special allowedContentTypes={['', 'image', 'video', 'text', 'feedback', 'sale', 'nonsale']}/>;

      case TRENDING:
        return <Trending />;

      case CHAT_GPT:
        return <ChatGPTSceen />;

      case FACEBOOK_PRESETS:
        return <FacebookPresets />;

      case THREADS:
        return <ThreadsTool />;
      
      case REGENERATE:
        return <RegenerateResources />;

      default:
        return null;
    }
  };

  const renderDefaultContentArr = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 max-h-full p-2">
        {TOOLS_ARR.map((_elt, index) => (
          <div key={index}>
            <div
              className="border-2 border-gray-200 bg-gray-100 rounded-lg p-4 h-26 hover:bg-blue-50 cursor-pointer flex justify-center transition-all"
              onClick={() => selectType(_elt.title)}
            >
              <img src={_elt.icon} className="w-16" />
            </div>
            <p className="text-center"> {_elt.title}</p>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (isCreateToHomepage.status && isCreateToHomepage.type === 'gochat') {
      selectType(CHAT_GPT);
    }
  }, []);

  return (
    <div
      className="bg-gray-50 rounded-md  text-sm overflow-hidden py-2"
      style={{ minHeight: '80%' }}
    >
      <div className="bg-gray-50 rounded-md  text-sm overflow-hidden pt-3 pb-3 flex justify-between">
        <span className="font-bold border-l-4 border-green-500 uppercase text-base px-2">
          {getTitle(titleType)}
        </span>
        {titleType !== DEFAULT ? (
          <button className="mr-4">
            <FiX size={25} color="red" onClick={() => resetFeedback()} />
          </button>
        ) : null}
      </div>
      {titleType === DEFAULT ? (
        renderDefaultContentArr()
      ) : (
        <ContentDataStyled className="overflow-auto">
          {renderContentType()}
        </ContentDataStyled>
      )}
    </div>
  );
};

export default Tools;
