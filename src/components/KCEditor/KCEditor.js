import React, { useEffect } from 'react';
import Column from './Column/index';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';
import {
  getCreatedContents,
  getFeedbackKeywords,
  getGoogleSubjects,
  getFeedbackSuggestions,
  getTrendSuggestions,
  getAllCategories,
  get100DonCharts,
  get100DonDetails
} from '../../store/actions/editor/editorActions';
import auth from '../../utils/auth';

const KCEditor = (props) => {
  const {   
    feedbackKeywords,   
    getCreatedContents,
    getFeedbackKeywords,
    getGoogleSubjects,
    get100DonCharts,
    get100DonDetails,
    getFeedbackSuggestions,
    getTrendSuggestions,
    getAllCategories,
    columnContent,
  } = props; 
  
  const currentUser = auth.getUserInfo();
  const currentUserId = currentUser?.id;
  useEffect(() => {
    getCreatedContents(currentUserId);
    getFeedbackKeywords();
    getGoogleSubjects();
    get100DonCharts();
    get100DonDetails();
    getFeedbackSuggestions(feedbackKeywords, '', 1);
    getTrendSuggestions('', 1);
    getAllCategories();
  }, []);

  return (
    <PerfectScrollbar className="text-nowrap">
      <div className="flex whitespace-nowrap flex-nowrap gap-1 editor-columns">        
        {columnContent.map((column, index) => (
          <Column key={index} column = {column} />
        ))}
      </div>
    </PerfectScrollbar>
  );
};

const mapStateToProps = (state) => {
  return {    
    feedbackKeywords: state.editor.feedbackKeywords,
    columnContent: state.editor.columnContent,
  };
};

export default connect(mapStateToProps, {
  getCreatedContents,
  getFeedbackKeywords,
  getGoogleSubjects,
  get100DonCharts,
  get100DonDetails,
  getFeedbackSuggestions,
  getTrendSuggestions,
  getAllCategories
})(KCEditor);
