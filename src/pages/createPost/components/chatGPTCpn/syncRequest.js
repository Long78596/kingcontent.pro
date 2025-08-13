import React from 'react';
import { useSelector } from 'react-redux';

const SyncRequest = () => {
  const { syncRequestPedding } = useSelector(state => state['createPost'])
  return (
    <div>
        <div className='text-center text-white py-5 mb-5' style={{backgroundColor : "#54B435"}}>
          Vui lòng chờ từ 30s đến 2 phút để trí tuệ nhân tạo AI xử lý bài viết của bạn!
          </div>
      {
        syncRequestPedding.length === 0 ? <div className='flex justify-center mt-2'>
          {/* <div style={{backgroundColor : "#54B435"}}>
          Vui lòng chờ từ 30s đến 2 phút để trí tuệ nhân tạo AI xử lý bài viết của bạn!
          </div> */}
          <span className='text-md font-bold text-center  mb-80'>Không có yêu cầu nào đang xử lý ở đây !</span></div> : <ul>
          {
            syncRequestPedding.map(({ id, title, status }, index) => (
              <li key={index} className='flex justify-between items-center mb-2'>
                <span className='font-bold w-11/12'>{title}</span>
                <span className='bg-yellow-400 p-2 rounded-md text-white w-2/12'>{status === 'PENDDING' && 'Đang xử lý ...'}</span>
              </li>
            ))
          }
        </ul>
      }
    </div>

  )
}

export default SyncRequest