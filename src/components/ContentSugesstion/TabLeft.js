import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { API_EDIT_SUGGEST_KEYWORD_GG } from '../../configs';
import { actionGetPostByKeyword } from '../../store/actions/createContent';
import ContentSugestion from '.'
const TabLeft = ({api , query ,typeSug }) => {
    const dispatch = useDispatch();
    const [startDocument, setStartDocument] = useState(5);
    useEffect(() => {
      dispatch(actionGetPostByKeyword(API_EDIT_SUGGEST_KEYWORD_GG , 'title' ,typeSug.type, startDocument));
    }, []);
  return (
    <ContentSugestion typeSug={typeSug.type} api={api} query={query}/>
  )
}

export default TabLeft