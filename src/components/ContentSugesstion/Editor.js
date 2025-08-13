import { positions } from '@mui/system';
import { Editor } from 'draft-js';
import React from 'react';
import ScrollBar from 'react-perfect-scrollbar';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { actionUpdateEditorState } from '../../store/actions/createContent';
import createResizeablePlugin from '@draft-js-plugins/resizeable';

const styles = {
  editor: {
    background: '#fff',
    borderRadius: '5px',
    padding: '20px',
    overflowY : "scroll",
    height: "100%",
    width: "98%",
    position: "absolute",
    right: 0,
    left : "1%",
  },
};
const EditorStyled = styled.div`
box-sizing: border-box;
.isVPCS-text{
  background-color: ${p => !p.isCheckVPCS ? "#fff !important" :"red!important" };
  color: ${p => !p.isCheckVPCS ? "#000 !important" :"#fff !important" };
}
`
export default function MyEditor({ editorState, dispatch }) {
  const { isCheckVPCS } = useSelector((state) => state.createPost);
  const resizeablePlugin = createResizeablePlugin();
  const editor = React.useRef(null);
  function focusEditor() {
    editor.current.focus();
  }
  React.useEffect(() => {
    focusEditor();
  }, []);
  return (
    <EditorStyled onClick={focusEditor} style={styles.editor} isCheckVPCS={isCheckVPCS}>
      <ScrollBar onClick={focusEditor}>
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={(editorState) =>
            dispatch(actionUpdateEditorState(editorState))
          }
          placeholder="Nhập nội dung bài viết ..."
          plugins={[resizeablePlugin]}
        />
      </ScrollBar>
    </EditorStyled>
  );
}
