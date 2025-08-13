import React, { useEffect, useState } from 'react';
import {
  actionGetPostByKeyword
} from '../../../store/actions/createContent';
import { COMMIT } from '../utility';
import ContentSugestion from '../../../components/ContentSugesstion'
import { useDispatch } from 'react-redux';
import { API_EDIT_SUGGEST_KEYWORD } from '../../../configs';
const Commit = () => {
  const dispatch = useDispatch();
  const [startDocument, setStartDocument] = useState(5);
  useEffect(() => {
    dispatch(actionGetPostByKeyword(API_EDIT_SUGGEST_KEYWORD , 'label' ,COMMIT, startDocument));
  }, []);
  return (
    <ContentSugestion typeSug={COMMIT} api={API_EDIT_SUGGEST_KEYWORD} query={'label'}/>
  );
};

export default Commit;
