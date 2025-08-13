import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { removeFeedbackMessage } from '../../../../../store/actions/editor/editorActions';
import { useCallback } from 'react';

const SingleSend = (props) => {
  const {
    data,
    id,
    type = 'messenger',
    setIsShowModalMessage,
    setMessageType,
    setMessageData,
  } = props;

  const dispatch = useDispatch();

  const onClickRemove = () => {
    dispatch(removeFeedbackMessage(id));
  };

  const editMessage = useCallback(() => {
    setIsShowModalMessage(true);
    setMessageType('send');
    setMessageData({
      id: id,
      data: data,
      type: 'send',
    });
  }, [id, data]);
  return (
    <div className="group send pr-2 pb-1 flex justify-end">
      <div className="messActions opacity-0 group-hover:opacity-100 flex flex-row-reverse pr-2 justify-center">
        <button
          className="edit_button hover:text-white hover:bg-black p-3 rounded-full h-10 self-center"
          onClick={(e) => editMessage()}
        >
          <FontAwesomeIcon size="3x" className="text-base" icon={faPenAlt} />
        </button>
        <button
          className="delete_button hover:text-white hover:bg-red-500 p-3 rounded-full h-10 self-center"
          onClick={() => onClickRemove()}
        >
          <FontAwesomeIcon size="3x" className="text-base" icon={faTrashAlt} />
        </button>
      </div>
      {data.includes('data:image') ? (
        <div
          className={`tracking-wide max-w-chat-${type} text-chat-${type}-send-text ${
            type === 'messenger'
              ? 'rounded-3xl border-0'
              : 'rounded-xl border-2'
          } border-chat-${type}-send-border leading-7 text-left text-base overflow-hidden`}
        >
          <img src={data} alt="attachment" className="w-full object-cover" />
        </div>
      ) : (
        <div
          className={`max-w-chat-${type} px-3 py-4 bg-chat-${type}-send-bg text-chat-${type}-send-text ${
            type === 'messenger'
              ? 'rounded-3xl border-0'
              : 'rounded-xl border-2'
          } border-chat-${type}-send-border leading-7 text-left text-base`}
        >
          {data}
        </div>
      )}
    </div>
  );
};

export default SingleSend;
