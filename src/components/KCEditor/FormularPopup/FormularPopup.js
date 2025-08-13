import Categories from '../SelectCategories'
import FormularForm from './FormularForm'
import { connect } from 'react-redux';

const FormularPopup = ({isShowFormularPopupForm}) => {

    const ShowStateFormularPopupForm = () => {
        return isShowFormularPopupForm && (<FormularForm/>)
    }

    return (
        <>
            { ShowStateFormularPopupForm() }
        </>
    )
}


const mapStateToProps = (state) => {
    return {
        isShowFormularPopupForm: state.createContent.isShowFormularPopupForm
    }
}

export default connect(mapStateToProps, {})(FormularPopup);