import { useEffect, useState } from "react"
import { CloudUploadIcon, CloudDownloadIcon, XIcon } from '@heroicons/react/outline'
import { pushFeedbackMessage, updateFeedbackMessage } from '../../../../store/actions/editor/editorActions'
import { useDispatch } from "react-redux"
import { ImCamera } from "react-icons/im"
import { EmojiHappyIcon } from "@heroicons/react/solid"
import EmojiPicker from "emoji-picker-react"
import './styles.css'
import ReactImageUploading from "react-images-uploading"

const ModalNewMessage = (props) => {
  const {
    type='send',
    setIsShowModalMessage,
    messageData
  } = props

  const [message, setMessage] = useState('')
  const [currentId, setCurrentId] = useState(0)
  const [canClick, setCanClick] = useState(false)
  const [isShowEmoji, setIsShowEmoji] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if(message){
      setCanClick(true)
    }else{
      setCanClick(false)
    }
  }, [message])

  useEffect(() => {
    if(messageData){
      const {id, data} = messageData
      setMessage(data)
      setCurrentId(id)
    }else{
      setMessage('')
      setCurrentId(0)
    }
  }, [messageData])

  const handleChangeInput = (value) => {
    setMessage(value)
  }

  const handleClickSubmit = () => {
    const isEdit = currentId !==0;
    if(isEdit){
      dispatch(updateFeedbackMessage({
        id: currentId,
        type: type,
        data: message
      }))
    }else{
      dispatch(pushFeedbackMessage({
        id: 0,
        type: type,
        data: message
      }))
    }
    setIsShowModalMessage(false)
  }

  const onClickEmoji = (e, emojiObject) => {
    setMessage(message + emojiObject.emoji)
  }

  const onUploadedImage = (imageList) => {
    if(imageList.length > 0){
      const {data_url} = imageList[0]
      const isEdit = currentId !==0;
      if(isEdit){
        dispatch(updateFeedbackMessage({
          id: currentId,
          type: type,
          data: data_url
        }))
      }else{
        dispatch(pushFeedbackMessage({
          id: 0,
          type: type,
          data: data_url
        }))
      }
      setIsShowModalMessage(false)
    }
  };

  return (
    <div className="modalNewTime z-9999 absolute top-0 left-0 right-0 h-screen bg-createContent-modalOverLayClr pt-28">
      <div className="mx-auto my-0 w-5/6 max-h-80 bg-gray-200 rounded-md shadow-md text-center relative">
        <div className="text-right py-2 h-8 relative">
          <XIcon className="w-6 h-6 cursor-pointer absolute right-2 top-2" onClick={() => setIsShowModalMessage(false)}/>
        </div>
        <div className="mx-auto my-0.5 flex-grow shadow-sm rounded-md w-5/6 bg-white mb-3 relative border border-gray-500 inline-block">
          <textarea
            className="border-none outline-none rounded-md p-3 w-full mx-auto h-28"
            type="text"
            placeholder="Nhập nội dung tin nhắn"
            onChange={(e) => handleChangeInput(e.target.value)}
            value={message}
          />
          <ReactImageUploading maxNumber={1} dataURLKey="data_url" onChange={onUploadedImage} multiple={false}>
            {({ onImageUpload }) => (
              <div className="float-right flex gap-2 mt-2 p-2 items-center align-right">
                <ImCamera className="w-6 h-6 cursor-pointer" onClick={onImageUpload}/>
                <EmojiHappyIcon className="w-6 h-6 cursor-pointer text-blue-500" onClick={() => setIsShowEmoji(!isShowEmoji)}/>
              </div>
            )}
          </ReactImageUploading>
        </div>
        <div className="w-full py-3 outline-none border-t border-gray-400 text-center">
          {type==='send' && (
            <button className="p-3 bg-createContent-blueClr text-white border rounded w-5/6 cursor-pointer flex items-center justify-center m-auto disabled:opacity-50 disabled:cursor-not-allowed" disabled={!canClick} onClick={() => {handleClickSubmit()}}>
              <CloudUploadIcon className="w-5 h-5 mr-2" />
              <span>Gửi tin nhắn</span>
            </button>
          )}

          {type==='receive' && (
            <button className="p-3 bg-createContent-blueClr text-white border rounded w-5/6 cursor-pointer flex items-center justify-center m-auto disabled:opacity-50 disabled:cursor-not-allowed" disabled={!canClick} onClick={() => {handleClickSubmit()}}>
              <CloudDownloadIcon className="w-5 h-5 mr-2" />
              <span>Nhận tin nhắn</span>
            </button>
          )}
        </div>
        {isShowEmoji && (
          <EmojiPicker onEmojiClick={onClickEmoji} />
        )}
      </div>
    </div>
  )
}

export default ModalNewMessage;