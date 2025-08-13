import { memo } from "react"
import LayoutTop from '../LayoutTop'
import ListMessages from '../Messages/ListMessages'

const Zalo = (props) => {
  const {
    setIsShowSettingsForm,
    setIsShowModalMessage,
    setMessageData,
    setMessageType
  } = props
  return (
    <div className="zalo">
      <LayoutTop type={`zalo`} setIsShowSettingsForm={setIsShowSettingsForm} />
      <div className="body bg-zalo-body h-zalo-body relative overflow-y-auto">
        <ListMessages 
          type={`zalo`}
          setIsShowModalMessage={setIsShowModalMessage}
          setMessageData={setMessageData}
          setMessageType={setMessageType}
        />
      </div>
      <div className="bottom bg-zalo-bottom h-zalo-bottom"></div>
    </div>
  )
}
export default memo(Zalo)