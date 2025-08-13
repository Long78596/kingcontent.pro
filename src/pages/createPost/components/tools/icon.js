import styled from '@emotion/styled';
import React from 'react';
import Picker from 'emoji-picker-react';
import { useDispatch } from 'react-redux';
import { AddElement } from '../../../../store/actions/createContent';
import { uniqueId } from 'lodash';

const EmojiStyled = styled.div`
aside.emoji-picker-react{
    width: 100%;
    height: 600px;
    border : none;
    box-shadow : none;
}
`;
const Icon = ({ editor, setToggle , fabric }) => {
  const dispatch = useDispatch()
  const onEmojiClick = (event, emojiObject) => {
    const id = uniqueId()

    const textbox = new fabric.IText(emojiObject.emoji , {
      customId : id,
    });
    editor.canvas.add(textbox);
    editor.canvas.renderAll();
    dispatch(AddElement(textbox))

  };

  return (
    <div className='text-black'>
      <EmojiStyled>
        <Picker onEmojiClick={onEmojiClick} size="50" />
      </EmojiStyled>
    </div>
  );
};

export default Icon;
