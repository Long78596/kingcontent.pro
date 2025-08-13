import React from 'react'
import addIcon from '../../../../../assets/images/icon/add-special.png';
import noImageIcon from '../../../../../assets/images/no-image.png';
import { Link } from 'react-router-dom';
const FanpageEmpty = () => {
    return (
        <div
            className="singleContent  flex gap-2 items-center relative bg-gray-100 rounded-3xl mb-1 mr-2 p-2 cursor-pointer"
        >
            <img src={noImageIcon} alt="" className='bg-gray-500 rounded-3xl' width={50} height={50} />
            <div className='w-full'>
                <p className="font-bold text-md text-gray-500 ">Kingcontent.pro</p>
                <div className='border-b-2 border-dashed border-gray-100 w-full'></div>
                <p></p>
            </div>
            <div className='absolute w-full '>
                <div className='flex mt-2 justify-center'>
                    <Link to={'/danh-sach-page'}>
                        <button title='Click để tạo lịch đăng bài mới'><img src={addIcon} width={40} height={40} alt="" /></button></Link>

                </div>
            </div>
        </div>
    )
}

export default FanpageEmpty