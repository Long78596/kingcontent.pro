import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { actionGetPageByKeyword } from '../../store/actions/createContent'
import PostSugesstion from './PostSugesstion'

const TabRight = ({api , query ,typeSug }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(actionGetPageByKeyword(api , query ,typeSug.type))
  }, [])
  return (
    <div>
      <PostSugesstion />
    </div>
  )
}

export default TabRight