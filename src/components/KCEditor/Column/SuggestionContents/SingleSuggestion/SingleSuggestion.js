import Medias from "./Medias"
import Content from "./Content"
import Fanpage from "./Fanpage"
import Reactions from "./Reactions"
import DateCreated from "../../SingleContent/DateCreated";
import { useCallback } from "react";

const SingleSuggestion = (props) => {
    const {
        contentData,
        addContentToEditor = () => {}
    } = props;

    const {
        medias = [],
        fanpage = [],
        post_timestamp = '',
        content = '',
        likes = 0,
        comments = 0,
        shares = 0
    } = contentData;
    
    const handleOnClickContent = useCallback(() => {
        let post_text = content;
        const regex = /<br\s*[\/]?>/gi;
        post_text = post_text.replace(regex, "\n")
        const isReplace = true;
        addContentToEditor(post_text, isReplace);
    },[])
    return (
        <div className="single-sug-content bg-white rounded mb-2 p-2 flex cursor-pointer" onClick={() => handleOnClickContent()}>
            <div className="p-1">
                <Medias medias={medias}/>
            </div>
            <div className="w-full">
                <Fanpage {...fanpage} />
                <DateCreated date={post_timestamp}/>
                <Content content={content}/>
                <Reactions likes={likes} shares={shares} comments={comments} />
            </div>
        </div>
    )
}

export default SingleSuggestion;