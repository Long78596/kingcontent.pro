import React, { useEffect, useRef, useState } from 'react';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, SelectionState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { changeSelectedKeyword } from '../../../store/actions/editor/createContentActions';
import { connect } from 'react-redux';
import ScrollBar from 'react-perfect-scrollbar';

const Input = (props) => {
  const {setSelectedKeyword, changeSelectedKeyword, editorState, setEditorState , className} = props
  const [startFind, setStartFind] = useState(0)

  const handleOnChange = (newState) => {
    setEditorState(newState);
  }
  
  const handleKeyCommand = (command) => {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        handleOnChange(newState);
        return true;
      }
      return false;
  }

  const mapKeyToEditorCommand = (e) => {
    switch(e.keyCode) {
      case 9:
          const newEditorState = RichUtils.onTab(
              e,
              editorState,
              4, /* maxDepth */
          );
          if (newEditorState !== editorState) {
            handleOnChange(newEditorState);
          }
          break;
      case 50:
          if(startFind === 0){
            setStartFind(1);
          }else{
            setTimeout(() => {
              setStartFind(2);
            },500)
          }
          break;
      default:
          return getDefaultKeyBinding(e);
    }
  }

  useEffect(() => {
    if(startFind===2){
      selectKw();
      setStartFind(0)
    }
  }, [startFind]);

  const toggleBlockType = (blockType) => {
    handleOnChange(
      RichUtils.toggleBlockType(
        editorState,
        blockType
      )
    )
  }

  const toggleInlineStyle = (inlineStyle) => {
    handleOnChange(
      RichUtils.toggleInlineStyle(
          editorState,
          inlineStyle
      )
    );
  }

  const editor = useRef(null);

  const focusEditor = () => {
    editor.current.focus();
  };

  const onBoldClick = () => {
    handleOnChange(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  }
  const onItalicClick = () => {
    handleOnChange(
      RichUtils.toggleInlineStyle(editorState, 'ITALIC')
    );
  }
  const onUnderlineClick= () => {
    handleOnChange(
      RichUtils.toggleInlineStyle(editorState, 'UNDERLINE')
    );
  }

  const selectKw = () => {
    const kw = editorState.getCurrentContent().getPlainText();
    const real_kw = kw.split("@")[1];
    changeSelectedKeyword(real_kw);
    const selectionState = editorState.getSelection();
    const focusOffset = selectionState.getFocusOffset();
    const offset = focusOffset - real_kw.length - 2;

    // const newSelectionState = new SelectionState;
    let newSelection = SelectionState;
    newSelection = selectionState.merge({
      anchorOffset: offset,
      focusOffset: focusOffset,
    });

    const newEditorState = EditorState.forceSelection(
      editorState,
      newSelection
    );
    setEditorState(newEditorState)
  }
  
  return (
    <ScrollBar onClick={focusEditor}>
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={handleOnChange}
        toggleBlockType={toggleBlockType}
        toggleInlineStyle={toggleInlineStyle}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={mapKeyToEditorCommand}
        placeholder="Gõ @từ khóa@ để máy tính gợi ý một câu hoàn chỉnh"
        spellCheck={false}
        className={`max-h-84 ${className}`}
      />
    </ScrollBar>
  );
}

export default connect(null, {
  changeSelectedKeyword
})(Input);
