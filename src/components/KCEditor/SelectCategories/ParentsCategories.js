import { connect } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";

const ParentCategories = (props) => {
    const { parentCategories, changeParent, selectedParent } = props;
    
    return(
        <>
            <div className="w-full border-b p-3 uppercase text-left font-bold border-t leading-tight">
                <span>Chủ đề</span>
            </div>
            <PerfectScrollbar className="p-1 max-h-96 100-don-details mt-2">
                <div className={`all mr-1 mb-2 inline-block cursor-pointer py-2 px-3 border border-solid rounded-lg hover:bg-primary hover:text-white ${selectedParent===0 ? 'bg-primary text-white' : '' }`} onClick={() => changeParent(0)}>
                    <span>Tất cả</span>
                </div>
                {parentCategories && parentCategories.length > 0 && parentCategories.map((cat, index) => (
                    <div key={index} onClick={() => changeParent(cat.id)} className={`mr-1 mb-2 inline-block cursor-pointer p-2 border border-solid rounded-lg hover:bg-primary hover:text-white ${selectedParent===cat.id ? 'bg-primary text-white' : '' }`}>
                        <span>{cat.name}</span>
                    </div>
                ))}
            </PerfectScrollbar>
        </>
    )
}

const mapStateToProps = (state) => {
  return {
    parentCategories: state.editor.parentCategories
  };
};


export default connect(mapStateToProps, null)(ParentCategories)