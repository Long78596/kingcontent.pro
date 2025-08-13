import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { removeFeedbackMessage } from '../../../../../store/actions/editor/editorActions';

const SingleReceive = (props) => {
  const {
    data,
    id,
    type = 'messenger',
    isLast = false,
    isFirst = false,
    setIsShowModalMessage,
    setMessageType,
    setMessageData,
  } = props;
  const { feedbackSettings } = useSelector((state) => state.editor);

  const dispatch = useDispatch();

  const onClickRemove = () => {
    dispatch(removeFeedbackMessage(id));
  };

  const editMessage = () => {
    setIsShowModalMessage(true);
    setMessageType('receive');
    setMessageData({
      id: id,
      data: data,
      type: 'receive',
    });
  };

  const { customerName, avatar } = feedbackSettings;

  let classBoderRadius = '';
  if (type == 'messenger') {
    classBoderRadius = 'rounded-tr-3xl rounded-br-3xl border-0 ';
    if (isLast) {
      if (isFirst) classBoderRadius += 'rounded-tl-3xl rounded-bl-3xl';
      else classBoderRadius += 'rounded-tl-lg rounded-bl-3xl';
    } else {
      if (isFirst) {
        classBoderRadius += 'rounded-tl-3xl rounded-bl-lg';
      } else {
        classBoderRadius += 'rounded-tl-lg rounded-bl-lg';
      }
    }
  } else {
    classBoderRadius = 'rounded-xl border-2';
  }

  return (
    <div
      className={`group receive pr-2 ${
        isLast ? 'pb-4' : 'pb-1'
      } flex justify-start relative cursor-pointer`}
    >
      {isLast && (
        <img
          src={avatar}
          alt={customerName}
          className="w-8 h-8 rounded-full mr-2 object-cover absolute left-0 bottom-4"
        />
      )}
      {data.includes('data:image') ? (
        <div
          className={`ml-10 tracking-wide max-w-chat-${type} text-chat-${type}-receive-text ${classBoderRadius} border-chat-${type}-send-border leading-7 text-left text-base overflow-hidden`}
        >
          <img src={data} alt="attachment" className="w-full object-cover" />
        </div>
      ) : (
        <div
          className={`ml-10 px-3 py-4 tracking-wide max-w-chat-${type} bg-chat-${type}-receive-bg text-chat-${type}-receive-text ${classBoderRadius} border-chat-${type}-send-border leading-7 text-left text-base`}
        >
          {data}
        </div>
      )}
      <div className="messActions opacity-0 group-hover:opacity-100 flex flex-row-reverse pl-2 justify-center">
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
    </div>
  );
};

export default SingleReceive;
