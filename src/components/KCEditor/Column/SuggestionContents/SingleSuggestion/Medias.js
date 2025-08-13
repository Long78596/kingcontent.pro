import { useEffect, useState } from "react";
const Medias = (props) => {
    const {medias} = props;
    const [avatar, setAvatar] = useState('');
    const [moreMedias, setMoreMedias] = useState(0);

    useEffect(() => {
        if(medias){
            let mediasArray = [];
            if(Array.isArray(medias)) mediasArray = medias;
            else mediasArray = JSON.parse(medias);
            const defaultAvatar = mediasArray[0] ?? [];
            setAvatar(defaultAvatar || '');
            setMoreMedias(mediasArray.length - 1);
        }
    }, [medias])
    return(
        <div className="content-avatar relative mb-2 w-20 h-20 text-center">
            <img className=" max-h-full inline self-center items-center" src={avatar} alt="" />
            {(moreMedias>0 &&
                <span className="more-medias absolute rounded-full bg-black bg-opacity-50 text-white text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 text-xs">+ {moreMedias}</span>
            )}
        </div>
    )
}

export default Medias;