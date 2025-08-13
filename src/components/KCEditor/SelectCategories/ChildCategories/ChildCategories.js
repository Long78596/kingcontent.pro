import { useCallback, useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect } from "react-redux";
import CatListing from "./CatListing";
import SearchBar from "./SearchBar";

const ChildCategories = (props) => {
    const { childCategories, selectedParent } = props;
    const [childCats, setChildCats] = useState([childCategories])
    const [keyword, setKeyword] = useState('')

    useEffect(() => {
      if(selectedParent){
        const newChildCats = [...childCategories].reduce((acc, cat) => {
          let { parent, name } = cat;
          if(parent){
            const {id} = parent;
            if (id === selectedParent){
              if(keyword){
                if(name.toLowerCase().includes(keyword)) acc.push(cat);
              }else{
                acc.push(cat);
              }
            }
          }
          return acc;
        }, []);
        setChildCats(newChildCats);
      }else{
        if(keyword){
          const newChildCats = [...childCategories].reduce((acc, cat) => {
            let { name } = cat;
            if(name.toLowerCase().includes(keyword)) acc.push(cat);
            return acc;
          }, []);
          setChildCats(newChildCats);
        }else{
          setChildCats(childCategories);
        }
      }
    }, [selectedParent, keyword])

    const handleSearchCat = useCallback((evt) => {
      const kw = evt.target.value;
      setKeyword(kw);
    },[]);

    return(
        <>
          <SearchBar handleSearchCat={handleSearchCat}/>
          <PerfectScrollbar className="p-1 max-h-96 100-don-details mt-2">
              <CatListing childCategories={childCats} selectedParent={selectedParent}/>
          </PerfectScrollbar>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
      childCategories: state.editor.childCategories
    };
};
export default connect(mapStateToProps, null)(ChildCategories)