export const IS_LOADING_APP = "IS_LOADING_APP"
export const actionLoadingApp = (status) => {
    return async (dispatch) =>{
        dispatch({
            type : IS_LOADING_APP,
            payload : status
        })
    }
}