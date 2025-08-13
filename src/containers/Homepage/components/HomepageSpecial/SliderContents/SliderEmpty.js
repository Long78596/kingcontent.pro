import React from 'react'
import addIcon from '../../../../../assets/images/icon/add-special.png';
import noImageIcon from '../../../../../assets/images/no-image.png';
import Footer from './Footer';
import { Link } from 'react-router-dom';
const SliderEmpty = () => {
  return (
    <div className="singleContent  bg-white rounded-3xl mb-1 mr-5 p-4  cursor-pointer">
      <div className="w-full">
        <img src={noImageIcon} className="w-full rounded-3xl h-72"/>
        <div className='w-full '>
                <div className='flex justify-center'>

                    <Link to={'/theo-doi-dac-biet'}>
                        <button title='Click để tạo lịch đăng bài mới'><img src={addIcon} width={40} height={40} alt="" /></button></Link>

                </div>
            </div>
      </div>
    
    </div>
  )
}

export default SliderEmpty