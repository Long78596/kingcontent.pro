import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContentSugestion from '../../../components/ContentSugesstion';
import { API_EDIT_SUGGEST_KEYWORD } from '../../../configs';
import {
  actionGetPostByKeyword,
  actionResetState
} from '../../../store/actions/createContent';
import { ACTION } from '../utility';
const Action = () => {
  const [startDocument, setStartDocument] = useState(5);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actionGetPostByKeyword(API_EDIT_SUGGEST_KEYWORD , 'label' , ACTION, startDocument));
  }, []);
  return (
    <ContentSugestion typeSug={ACTION} api={API_EDIT_SUGGEST_KEYWORD} query={'label'}/>
  );
};

export default Action;
