import { useState, useEffect } from "react";
import {formatDate} from '../../../../helpers/date';
import {CalendarIcon} from "@heroicons/react/outline"

const DateCreated = (props) => {
    const {isIcon = false, date} = props;
    const [createdDate, setCreatedDate] = useState('');
    useEffect(() => {
        if(date){
            setCreatedDate(formatDate(date));
        }
    }, [date])
    return(
        <div className="flex">
            {(
                isIcon && <CalendarIcon className="w-4 h-4 mr-1" />
            )}
            <span className="text-xs text-gray-600">{createdDate}</span>
        </div>
    )
}

export default DateCreated;