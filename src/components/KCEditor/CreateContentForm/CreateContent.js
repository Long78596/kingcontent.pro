import React, { useCallback, useState, useEffect, useContext } from 'react';
import Header from './Header';
import Input from './Input';
import Options from './Options';
import CustomerOverview from './CustomerOverview';
import FormularTab from './FormularTab';
import { ChartPieIcon, DocumentTextIcon } from '@heroicons/react/outline';
import { getContentSuggestions } from '../../../store/actions/editor/createContentActions';
import { setContentDetailToShow } from '../../../store/actions/Contents/contentActions';
import * as types from '../../../store/types';
import { useSelector } from 'react-redux';
import { EditorState, SelectionState, Modifier } from 'draft-js';
import ContentDetail from '../../CategoriesContent/ContentDetail';
import { createEmptyContent } from '../../../utils/utilityFunc';
import { saveUserContent } from '../../../store/actions/editor/editorActions';

function CreateContent(props) {
  const { content = false } = props;

  const { selectedCatId, createdContentSuccess, currentContentType } =
    useSelector((state) => state.editor);
  const { selectedKeyword, imagesContent, contentDetailToShow } = useSelector(
    (state) => state.contents
  );


  const [isShowFormular, setIsShowFormular] = useState(false);
  const [isShowCustomer, setIsShowCustomer] = useState(true);
  const [canSave, setCanSave] = useState(false);
  const [plainText, setPlainText] = useState('');

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    if (content) {
      const { content: post_text } = content;
      addContentToEditor(post_text, true);
    }
  }, [content]);

  useEffect(() => {
    if (editorState) {
      const currentContent = editorState.getCurrentContent().getPlainText();
      setPlainText(currentContent);
      if (currentContent) {
        setCanSave(true);
      } else {
        setCanSave(false);
      }
    }
  }, [editorState]);

  const addContentToEditor = useCallback(
    (data, replace = false) => {
      if (replace) {
        const currentContent = editorState.getCurrentContent();
        const firstBlock = currentContent.getBlockMap().first();
        const lastBlock = currentContent.getBlockMap().last();
        const firstBlockKey = firstBlock.getKey();
        const lastBlockKey = lastBlock.getKey();
        const lengthOfLastBlock = lastBlock.getLength();

        const selection = new SelectionState({
          anchorKey: firstBlockKey,
          anchorOffset: 0,
          focusKey: lastBlockKey,
          focusOffset: lengthOfLastBlock,
        });
        const tmp = Modifier.replaceText(currentContent, selection, data);
        const newState = EditorState.push(
          editorState,
          tmp,
          'replace-all-content'
        );
        setEditorState(newState);
      } else {
        const contentState = editorState.getCurrentContent();
        const selectionState = editorState.getSelection();
        if (selectionState.isCollapsed() == true) {
          //insert
          const tmp = Modifier.insertText(contentState, selectionState, data);
          const newState = EditorState.push(
            editorState,
            tmp,
            'insert-characters'
          );
          setEditorState(newState);
        } else {
          //replace
          const tmp = Modifier.replaceText(contentState, selectionState, data);
          const newState = EditorState.push(
            editorState,
            tmp,
            'replace-characters'
          );
          setEditorState(newState);
        }
      }
    },
    [editorState, setEditorState, SelectionState, Modifier, EditorState]
  );

  const showCustomerTab = useCallback(() => {
    setIsShowFormular(false);
    setIsShowCustomer(true);
  }, []);

  const showFormularTab = useCallback(() => {
    setIsShowFormular(true);
    setIsShowCustomer(false);
    getContentSuggestions(selectedCatId, [], 1);
  }, [selectedCatId]);

  useEffect(() => {
    if (selectedKeyword) {
      getContentSuggestions(selectedCatId, [selectedKeyword], 1);
    }
  }, [selectedKeyword, selectedCatId]);

  useEffect(() => {
    if (createdContentSuccess) {
      window.location.reload();
    }
  }, [createdContentSuccess]);

  const handleOnSaveContent = useCallback(() => {
    if (canSave) {
      const contentData = {
        content: plainText,
        category: selectedCatId,
        medias: imagesContent?.payload,
        type: currentContentType,
      };
      saveUserContent(contentData);
    } else {
      alert('Cant save without any content');
    }
  }, [canSave, plainText, imagesContent, selectedCatId, currentContentType]);

  const handleOnPreviewContent = useCallback(() => {
    if (canSave) {
      const emptyContent = createEmptyContent();
      const content = { ...emptyContent, content: plainText };
      setContentDetailToShow(content);
    }
  }, [canSave, plainText]);

  if (contentDetailToShow) {
    return <ContentDetail />;
  }

  return (
    <div className="z-9999 fixed top-0 left-0 right-0 h-screen bg-createContent-modalOverLayClr pt-16">
      <div className="mx-auto my-0 max-w-9.5/10 h-full max-h-80 bg-gray-200 rounded-md overflow-y-auto shadow-md">
        <Header />
        <div className="flex">
          <div className="w-2/5">
            <div className="max-h-96 h-full p-5 bg-gray-50 mx-6 my-4 rounded-md  text-sm overflow-hidden">
              <Input
                editorState={editorState}
                setEditorState={setEditorState}
              />
            </div>
            <Options
              canSave={canSave}
              addContentToEditor={addContentToEditor}
              handleOnSaveContent={handleOnSaveContent}
              handleOnPreviewContent={handleOnPreviewContent}
            />
          </div>
          <div className="w-3/5 mx-6 my-4">
            <div className="headerTabs flex gap-1 mb-2">
              <div
                className={`tabCustomer cursor-pointer inline-flex items-center justify-center flex-1 text-center border border-solid border-gray-500 rounded p-2 ${
                  isShowCustomer ? 'bg-blue-100' : 'bg-white'
                }`}
                onClick={showCustomerTab}
              >
                <ChartPieIcon className="w-6 h-6 mr-1.5" />
                <span className="text-base">Chân dung khách hàng</span>
              </div>
              <div
                className={`tabCustomer cursor-pointer inline-flex items-center justify-center flex-1 text-center border border-solid border-gray-500 rounded p-2 ${
                  isShowFormular ? 'bg-blue-100' : 'bg-white'
                }`}
                onClick={showFormularTab}
              >
                <DocumentTextIcon className="w-6 h-6 mr-1.5" />
                <span className="text-base">Viết theo công thức</span>
              </div>
            </div>
            <div className="tabsContent">
              {isShowCustomer && <CustomerOverview />}
              {isShowFormular && (
                <FormularTab addContentToEditor={addContentToEditor} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateContent;
