import { useState, useEffect, memo, useCallback } from "react";
import { destructContentsToParagraph } from "../../../../utils/utilityFunc"
import ParagraphItem from './ParagraphItem'
import PerfectScrollbar from 'react-perfect-scrollbar';
import ModalFullContent from './ModalFullContent'

const ParagraphList = (props) => {
  const {contents, addContentToEditor} = props;
  const [paragraphData, setParagraphData] = useState([])
  const [showModalFullContent, setShowModalFullContent] = useState(false)
  const [paragraph, setParagraph] = useState('')
  const [fullContent, setFullContent] = useState('')

  useEffect(() => {
    if(contents && contents.length > 0){
      const destructed = destructContentsToParagraph(contents)
      setParagraphData(destructed);
    }
  }, [contents])

  const clickToShowFullContent = useCallback(
    (paragraph, fullContent) => {
      setShowModalFullContent(true)
      setParagraph(paragraph);
      setFullContent(fullContent);
    },
    [setShowModalFullContent, setParagraph, setFullContent],
  )
  
  return (
    <>
      {paragraphData && paragraphData.length > 0 && (
        <PerfectScrollbar className="paragraphContents mt-2 p-1 max-h-96">
          {paragraphData.map((item, index) => {
            const {paragraph, fullContent} = item
            return (
              <ParagraphItem data={paragraph} fullContent={fullContent} key={index} addContentToEditor={addContentToEditor} clickToShowFullContent={clickToShowFullContent}/>
            )
          })}
        </PerfectScrollbar>
      )}
      {showModalFullContent && (
        <ModalFullContent 
          paragraph={paragraph}
          fullContent={fullContent}
          setShowModalFullContent={setShowModalFullContent}
          addContentToEditor={addContentToEditor}
        />
      )}
    </>
  )
}

export default memo(ParagraphList);