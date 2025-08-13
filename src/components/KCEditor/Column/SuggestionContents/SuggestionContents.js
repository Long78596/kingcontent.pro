import { useEffect, useState } from "react"
import SingleSuggestion from "./SingleSuggestion"
import PerfectScrollbar from 'react-perfect-scrollbar';

const SuggestionContents = (props) => {
    const {
        type,
        contents,
        addContentToEditor = () => {},
    } = props;

    const [title, setTitle] = useState('');

    useEffect(() => {
        switch (type) {
            case 'feedback':
                setTitle('Mẫu Feedback');
                break;
            case 'trend':
                setTitle('Bài viết mới nhất');
                break;
            case 'special':
                setTitle('Bài viết mới nhất');
                break;
        }
    }, [type])

    return (
        <div className="suggestion-contents mt-2 mb-2 p-1">
            <h2 className="uppercase mb-2 text-center font-bold">{ title }</h2>
            <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto hidden">
                <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-blue-400 h-12 w-12"></div>
                    <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-blue-400 rounded w-3/4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-blue-400 rounded"></div>
                        <div className="h-4 bg-blue-400 rounded w-5/6"></div>
                    </div>
                    </div>
                </div>
            </div>
            <PerfectScrollbar className="p-1 max-h-96">
                {( contents && contents.length > 0 && 
                    contents.map((content, key) =>{
                        return (
                            <SingleSuggestion key={key} contentData={content} addContentToEditor={addContentToEditor} />
                        )
                    })
                )}
            </PerfectScrollbar>
            <div className="text-center" >Xem thêm</div>
        </div>
    )
}

export default SuggestionContents;