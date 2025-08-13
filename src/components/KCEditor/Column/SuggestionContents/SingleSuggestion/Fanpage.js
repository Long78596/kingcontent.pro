const Fanpage = (props) => {
    const {id, name, fb_id, fb_url, avatar} = props;
    return(
        <div className="font-bold">
            {name}
        </div>
    )
}
export default Fanpage