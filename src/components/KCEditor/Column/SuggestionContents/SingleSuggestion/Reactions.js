import {ThumbUpIcon, ChatAltIcon, ShareIcon} from "@heroicons/react/outline"

const Reactions = (props) => {
    const {likes, comments, shares} = props;
    return(
        <div className="grid grid-cols-3 gap-1 mb-2">
            <div className="likes flex">
                <ThumbUpIcon className="w-4 h-4 mt-0.5" />
                <span className="pl-2">{likes}</span>
            </div>
            <div className="comments flex">
                <ChatAltIcon className="w-4 h-4 mt-0.5" />
                <span className="pl-2">{comments}</span>
            </div>
            <div className="shares flex">
                <ShareIcon className="w-4 h-4 mt-0.5" />
                <span className="pl-2">{shares}</span>
            </div>
        </div>
    )
}
export default Reactions