import SuggestTitles from '../SuggestTitles'
import Subjects from '../Subjects'
import SuggestionContents from '../../Column/SuggestionContents'
import { connect } from 'react-redux'
import { useCallback, useState } from 'react'
import { MenuAlt1Icon, DocumentIcon } from '@heroicons/react/outline';
import ParagraphList from '../ParagraphList' 

const FormularTab = (props) => {
  const {
    suggestionContents,
    addContentToEditor=() => {}
} = props
  const [isSearch, setIsSearch] = useState(true)
  const [loading, setLoading] = useState(false)
  const [isParagraph, setIsParagraph] = useState(false)

  const showParagraph = useCallback((status = true) => {
      setIsParagraph(status)
    },
    [],
  )
  
  return (
      <div id="formularTabContent">
          <SuggestTitles setIsSearch={setIsSearch}/>
          <div className="flex">
            <div className="w-3/12">
              <Subjects setIsSearch={setIsSearch}/>
            </div>
            <div className="w-9/12">
              <ul className="flex ml-2 mt-2">
                <li className="mr-2">
                  <button className={`inline-flex items-center justify-center cursor-pointer p-2 border rounded border-solid border-gray-400 ${isParagraph ? 'bg-blue-100' : 'bg-white'}`}
                  onClick={() => {showParagraph(true)}}>
                    <MenuAlt1Icon className="w-6 h-6 mr-1" />
                    <span>Từng câu</span>
                  </button>
                </li>
                <li className="">
                  <button className={`inline-flex items-center justify-center cursor-pointer p-2 border rounded border-solid border-gray-400 ${!isParagraph ? 'bg-blue-100' : 'bg-white'}`}
                  onClick={() => {showParagraph(false)}}>
                    <DocumentIcon className="w-6 h-6 mr-1" />
                    <span>Bài hoàn chỉnh</span>
                  </button>
                </li>
              </ul>
              {isSearch && loading && (                         
                <div className="flex justify-center items-center relative">
                  <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-t-2 border-gray-600"></div>
                  <label className="absolute top-1/3 z-10">Loading ...</label>
                </div>
              )}
              {isSearch && !loading && isParagraph && (
                <ParagraphList contents={suggestionContents} addContentToEditor={addContentToEditor}/>
              )}
              {isSearch && !loading && !isParagraph && ( <SuggestionContents contents={suggestionContents} addContentToEditor={addContentToEditor}/> )}
            </div>
          </div>
      </div>
  )
}

const mapStateToProps = (state) => {
  return {    
    suggestionContents: state.createContent.suggestionContents
  };
};

export default connect(mapStateToProps, null)(FormularTab);