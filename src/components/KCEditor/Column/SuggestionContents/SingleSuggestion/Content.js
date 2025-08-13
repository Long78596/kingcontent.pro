import PerfectScrollbar from 'react-perfect-scrollbar';

const Content = (props) => {
    const {content = ''} = props;
    return(
        <PerfectScrollbar className="post-content max-h-16 whitespace-pre-line pb-2 pt-2 mb-2">
            <div dangerouslySetInnerHTML={{__html: content}}></div>
        </PerfectScrollbar>
    )
}
export default Content