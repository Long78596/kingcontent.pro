import { useCallback } from "react";
import { connect } from "react-redux";
import { getContentSuggestions } from "../../../../store/actions/editor/createContentActions";

const SubjectItem = (props) => {
  const {itemData,setIsSearch, selectedCatId, getContentSuggestions} = props;
  const{keywords, image, title} = itemData;

  const handleOnClickTitle = useCallback((keywords=[]) => {
    setIsSearch(true)
    // will change to selectedCatId
    const currentCatId = '60ee76549d46428815950d39'
    getContentSuggestions(currentCatId, keywords, 1)
  },[selectedCatId, getContentSuggestions])

  return (
    <div 
      className="inline-flex items-center justify-center p-2 rounded-md bg-white w-full border border-solid mt-2 cursor-pointer border-gray-400"
      onClick={() => handleOnClickTitle(keywords)}
    >
      <img src={image.url} alt={title} className="mr-1 w-10 h-10" />
      <span>{title}</span>
    </div>
  )
}


const mapStateToProps = (state) => {
    return {
        selectedCatId: state.editor.selectedCatId
    };
};

export default connect(mapStateToProps, {
    getContentSuggestions
})(SubjectItem);
