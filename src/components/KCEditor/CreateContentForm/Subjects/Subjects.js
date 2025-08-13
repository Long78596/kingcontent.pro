import { connect } from 'react-redux';
import SubjectItem from './SubjectItem';

const Subjects = (props) => {
    const {googleSubjects, setIsSearch} = props;
    return (
        <div className="subjects">
            {
                googleSubjects.map((item, index) => {
                    return (
                        <SubjectItem key={index} itemData={item} setIsSearch={setIsSearch}/>
                    )
                })
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        googleSubjects: state.editor.googleSubjects
    };
};
  
export default connect(mapStateToProps, null)(Subjects);