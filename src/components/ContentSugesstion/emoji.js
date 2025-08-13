import React, { useState } from 'react';
import Picker from 'emoji-picker-react';
import {
  actionUpdateEditorState,
  toggleEditorText,
} from '../../store/actions/createContent';
import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';
const EmojiStyled = styled.div`
  aside.emoji-picker-react {
    height: 80vh !important;
    position: relative !important;
    top: 0 !important;
  }
`;
const MyEmoji = () => {
  const dispatch = useDispatch();
  const onEmojiClick = (event, emojiObject) => {
    dispatch(toggleEditorText(emojiObject.emoji));
  };

  return (
    <EmojiStyled>
      <Picker onEmojiClick={onEmojiClick} />
    </EmojiStyled>
  );
};
export default MyEmoji;
