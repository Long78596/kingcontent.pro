import { memo, useEffect, useState } from "react"
import LayoutTop from '../LayoutTop'
import ListMessages from '../Messages/ListMessages'

const Messenger = (props) => {
  const {
    setIsShowSettingsForm,
    setIsShowModalMessage,
    setMessageData,
    setMessageType
  } = props

  return (
    <div className="messenger">
      <LayoutTop type={`messenger`} setIsShowSettingsForm={setIsShowSettingsForm}/>
      <div className="body bg-messenger-body h-messenger-body relative overflow-y-auto">
        <ListMessages 
          type={`messenger`}
          setIsShowModalMessage={setIsShowModalMessage}
          setMessageData={setMessageData}
          setMessageType={setMessageType}
        />
      </div>
      <div className="bottom bg-messenger-bottom h-messenger-bottom"></div>
    </div>
  )
}
export default memo(Messenger)