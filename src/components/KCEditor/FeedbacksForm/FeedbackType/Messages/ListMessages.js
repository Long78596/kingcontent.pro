import { connect, useSelector } from 'react-redux';
import SingleReceive from './SingleReceive';
import SingleSend from './SingleSend';

const ListMessages = (props) => {
  const { type, setIsShowModalMessage, setMessageData, setMessageType } = props;

  const { listMessages } = useSelector((state) => state.editor);

  const checkIsLastReceive = (index, listMessages) => {
    const nextIndex = index + 1;
    if (typeof listMessages[nextIndex] === 'undefined') {
      return true;
    } else {
      const item = listMessages[nextIndex];
      if (item.type === 'receive') return false;
      else return true;
    }
  };

  const checkIsFirstReceive = (index, listMessages) => {
    const prevIndex = index - 1;
    if (prevIndex >= 0) {
      if (typeof listMessages[prevIndex] === 'undefined') {
        return true;
      } else {
        const item = listMessages[prevIndex];
        if (item.type === 'send') return true;
        else return false;
      }
    } else {
      return true;
    }
  };

  return (
    <div className="listMessages absolute left-0 bottom-0 w-full px-4">
      {listMessages &&
        listMessages.length > 0 &&
        listMessages.map((item, index) => {
          const { id, type: chatType, data } = item;
          let isLast = true;
          let isFirst = true;
          switch (chatType) {
            case 'receive':
              isLast = checkIsLastReceive(index, listMessages);
              isFirst = checkIsFirstReceive(index, listMessages);
              break;
          }
          return (
            <div key={index} className="w-full">
              {
                {
                  send: (
                    <SingleSend
                      type={type}
                      data={data}
                      id={id}
                      setIsShowModalMessage={setIsShowModalMessage}
                      setMessageData={setMessageData}
                      setMessageType={setMessageType}
                    />
                  ),
                  receive: (
                    <SingleReceive
                      type={type}
                      isLast={isLast}
                      isFirst={isFirst}
                      data={data}
                      id={id}
                      setIsShowModalMessage={setIsShowModalMessage}
                      setMessageData={setMessageData}
                      setMessageType={setMessageType}
                    />
                  ),
                }[chatType]
              }
            </div>
          );
        })}
    </div>
  );
};

export default ListMessages;
