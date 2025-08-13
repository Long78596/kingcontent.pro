// import ReactEmojiPicker from '@bit/personal-dev.emoji-picker.react-emoji-picker';
import React, { useState } from 'react';
import Scrollbar from 'react-scrollbars-custom';

function GetEmoji(props) {
  const {addContentToEditor} = props
  return (
    <Scrollbar className="w-full h-full">
      {/* <ReactEmojiPicker
        className="w-full"
        onSelected={(currentEmoji) => {
          if(currentEmoji){
            addContentToEditor(currentEmoji, false);
          }
        }}
      /> */}
    </Scrollbar>
  );
}

export default (GetEmoji);
