import SingleContent from "./SingleContent"
import PerfectScrollbar from 'react-perfect-scrollbar';

const ColumnContents = (props) => {
    const {contents} = props;
    return(
        <PerfectScrollbar className="p-1 max-h-96">
            {contents.map((content, key) => {
                return (
                    <SingleContent key={key} {...content} />
                );
            })}
        </PerfectScrollbar>
    )
}

export default ColumnContents;