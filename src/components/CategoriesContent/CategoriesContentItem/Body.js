import React, { useState } from 'react';
import styled from 'styled-components';
const TextStyle = styled.p`
  max-height: 70px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.9rem !important;
`;
// full text type style with scrollbar
const FullTextStyle = styled.p`
  max-height: 400px;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: auto;
  font-size: 0.9rem !important;
  margin-bottom: 10px;
`;
// full text type style without scrollbar
const FullTextStyleNoScroll = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  font-size: 0.9rem !important;
  margin-bottom: 10px;
`;
function Body(props) {
  const { content, isPreview = false } = props;
  const [showFull, setShowFull] = useState(false);

  const handleShowFull = () => {
    setShowFull(!showFull);
  };

  return (
    <div
      className={`px-3 text-gray-900 font-medium whitespace-pre-wrap ${
        !isPreview ? 'h-10' : ''
      }`}
    >
      {isPreview ? (
        <>
          {showFull ? (
            <FullTextStyleNoScroll
              className="mb-2"
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            ></FullTextStyleNoScroll>
          ) : (
            <FullTextStyle
              className="mb-2"
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            ></FullTextStyle>
          )}
          <button
            className="text-blue-500 hover:underline text-center"
            onClick={handleShowFull}
          >
            {showFull ? 'Thu gọn' : 'Xem thêm'}
          </button>
        </>
      ) : (
        <TextStyle
          className="mb-2 line-clamp-3"
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        ></TextStyle>
      )}
    </div>
  );
}

export default Body;
