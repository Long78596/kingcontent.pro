import PerfectScrollbar from 'react-perfect-scrollbar';

const Content = (props) => {
    const {content} = props;
    return(
        <PerfectScrollbar className="post-content max-h-28 whitespace-pre-line pb-2 pt-2 mb-2">
            {content}
        </PerfectScrollbar>
    )
}
export default Content