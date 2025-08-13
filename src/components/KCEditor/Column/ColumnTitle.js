import TitleIcon from "./TitleIcon"

const ColumnTitle = (props) => {
    const {type, totalContent, title} = props;
    return(
        <div className={`flex p-3 uppercase text-white column-title bg-editor-${type}`}>
            <span className="flex-1 text-left icon"><TitleIcon type={type} /></span>
            <span className="flex-none text-center">{ title }</span>
            <div className="flex-1 text-right">
                <span className={`rounded-full bg-white px-3 py-1 text-center text-editor-${type}`}>{ totalContent }</span>
            </div>
        </div>
    )
}

export default ColumnTitle;