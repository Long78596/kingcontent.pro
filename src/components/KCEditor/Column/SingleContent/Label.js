const Label = (props) => {
    const {labelName} = props;
    return(
        <>
            {(
                labelName && <span className="bg-editor-label rounded-md text-white p-1 pl-2 pr-2">{labelName}</span>
            )}
        </>
    )
}

export default Label;