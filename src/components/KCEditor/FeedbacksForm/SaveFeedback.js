import { useCallback, useState } from "react";
import { connect } from "react-redux";
import { saveUserContent } from "../../../store/actions/editor/editorActions"

const SaveFeedback = (props) => {
  const{
    feebackImage,
    setFeebackImage,
    feedbackSettings,
    saveUserContent
  } = props

  const [content, setContent] = useState('')

  const handleOnSubmit = useCallback(
    () => {
      let medias = []
      medias.push(feebackImage)
      const contentData = {
        content: content,
        medias : medias,
        type: 'feedback'
      }
      saveUserContent(contentData)
      setFeebackImage('')
    },
    [feebackImage, content],
  )

  const handleOnChange = useCallback(
    (value) => {
      setContent(value)
    },
    [],
  )

  return (
    <div className="saveFeedback w-full flex">
      <div className="formNewFeedBack w-3/5 mr-4">
        <div className="flex">
          <div className="avatar w-2/12 mr-5 text-center">
            <img className="rounded-full w-20 h-20 inline-block" src={feedbackSettings.avatar} atl="avatar" />
          </div>
          <div className="editor w-10/12">
            <textarea className="w-full border-0 rounded-md outline-none p-5" placeholder="Hãy viết gì đó cho feedback này..." onChange={e => handleOnChange(e.target.value)}></textarea>
          </div>
        </div>
        <div className="actions w-full text-right mt-3">
          <button className="inline-block bg-blue-500 rounded-lg text-white py-2 px-3 mr-2" onClick={e => handleOnSubmit()}>Lưu bài viết</button>
          <button className="inline-block bg-blue-500 rounded-lg text-white py-2 px-3">Đăng lên FB</button>
        </div>
      </div>
      <div className="feedbackImage w-2/5 rounded-md bg-white shadow-md overflow-hidden">
        <img src={feebackImage} alt="feedback image" className="max-w-full" />
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    feedbackSettings: state.editor.feedbackSettings,
  };
};

export default connect(mapStateToProps, {
  saveUserContent
})(SaveFeedback)