import DateCreated from "./DateCreated"
import Medias from "./Medias"
import Label from "./Label"
import Content from "./Content"
import { useEffect, useState } from "react"

const SingleContent = (props) => {
    const {content, label, medias, user, category, type, createdAt} = props;
    const [labelName, setLabelName] = useState('');
    useEffect(() => {
        if(label){
            setLabelName(label.name || '');
        }
    }, [label])

    return(
        <div className="singleContent bg-white rounded mb-2 p-2">
            <Content content={content}/>
            <Medias medias={medias}/>
            <div className="content-bottom flex">
                <div>
                    <DateCreated isIcon={true} date={createdAt}/>
                </div>
                <div className="ml-auto">
                    <Label labelName={labelName}/>
                </div>
            </div>
        </div>
    )
}

export default SingleContent;