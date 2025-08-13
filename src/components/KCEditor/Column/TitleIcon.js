import { PencilAltIcon, FilterIcon, ThumbUpIcon, LightBulbIcon, TrendingUpIcon } from "@heroicons/react/outline"

const TitleIcon = (props) => {
    const {type} = props;
    return(
        <>
            {
                {
                'manual': <PencilAltIcon className="h-6 w-6"/>,
                'formular': <FilterIcon className="h-6 w-6"/>,
                'special': <LightBulbIcon className="h-6 w-6"/>,
                'feedback': <ThumbUpIcon className="h-6 w-6"/>,
                'trend': <TrendingUpIcon className="h-6 w-6"/>,
                }[type]
            }
        </>
    )
}

export default TitleIcon;