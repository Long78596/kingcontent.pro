import Header from './Header';
import SchedulesPanel from './SchedulesPanel';
import { useSelector } from 'react-redux';
// import SuggestionsPopup from './Popups/SuggestionsPopup';
import SuggestionsPopup from './Popups/SuggestionsPopup/SuggestionsPopup';
import ScheduleItemPopup from './Popups/ScheduleltemPopup/index';
import CreateSchedulePopup from './Popups/CreateSchedulePopup';
import SelectSuggestsPopup from './Popups/SelectSuggestsPopup';
import ContentDetail from '../CategoriesContent/ContentDetail';
import SelectCategories from './SelectCategories';
import SourceIdeas from './Sourceldeas/SourceIdeas';
import React, { useCallback } from 'react';
// import FinalStep from './FinalStep';
import FinalStep from './FinalStep/FinalStep';
import SourceIdeasAuto from './SourceldeasAuto/SourceIdeasAuto';
import FinalStepAuto from './FinalStepAuto/FinalStepAuto';
import ScheduleMultipleItemsPopup from './Popups/ScheduleMultipleltemsPopup/index';
import ScheduleComments from './ScheduleComments/ScheduleComments';
import ManageSchedules from './ManageSchedules/ManageSchedules';
import ModalEditingContent from './ModalEditingContent';

const SchedulesContents = () => {
  const {
    showSuggestionsPopup = false,
    scheduleItemPopupToShow = false,
    scheduleMultipleItemsToShow = null,
    showCreateSchedulePopup,
    showSelectSuggestsPopup = false,
    showSourceIdeas = false,
    showSourceIdeasAuto = false,
    showScheduleComments = false,
    isShowFinalStep = false,
    isShowFinalStepAuto = false,
    isShowManageSchedules = false,
    currentChangeContent = null,
  } = useSelector((state) => state.schedules);

  const contentDetailToShow = useSelector(
    (state) => state.contents.contentDetailToShow
  );
  const showChooseCategories = useSelector((state) => {
    return false;
    // return state.schedules.showChooseCategories;
  });

  const ShowSuggestionsPopup = useCallback(() => {
    if (showSuggestionsPopup) return <SuggestionsPopup />;
  }, [showSuggestionsPopup]);

  const ShowScheduleItemPopup = useCallback(() => {
    if (scheduleItemPopupToShow !== null)
      return <ScheduleItemPopup scheduleContent={scheduleItemPopupToShow} />;
  }, [scheduleItemPopupToShow]);

  const ShowScheduleMultipleItemsPopup = useCallback(() => {
    if (scheduleMultipleItemsToShow !== null)
      return (
        <ScheduleMultipleItemsPopup contents={scheduleMultipleItemsToShow} />
      );
  }, [scheduleMultipleItemsToShow]);

  const ShowCreateSchedulePopup = useCallback(() => {
    if (showCreateSchedulePopup) return <CreateSchedulePopup />;
  }, [showCreateSchedulePopup]);

  const ShowSelectSuggestsPopup = useCallback(() => {
    if (showSelectSuggestsPopup) return <SelectSuggestsPopup />;
  }, [showSelectSuggestsPopup]);

  const ShowContentDetailsPopup = useCallback(() => {
    if (
      contentDetailToShow !== null &&
      contentDetailToShow &&
      contentDetailToShow.length !== 0 &&
      contentDetailToShow.source_type !== 'threads'
    )
      return <ContentDetail />;
  }, [contentDetailToShow]);

  const ShowChooseCategoriesPopup = useCallback(() => {
    if (showChooseCategories === true) return <SelectCategories />;
  }, [showChooseCategories]);

  const ShowSourceIdeasPopup = useCallback(() => {
    if (showSourceIdeas === true) return <SourceIdeas />;
  }, [showSourceIdeas]);

  const ShowSourceIdeasAutoPopup = useCallback(() => {
    if (showSourceIdeasAuto === true) return <SourceIdeasAuto />;
  }, [showSourceIdeasAuto]);

  const ShowScheduleCommentsPopup = useCallback(() => {
    if (showScheduleComments === true) return <ScheduleComments />;
  }, [showScheduleComments]);

  const ShowFinalStepPopup = useCallback(() => {
    if (isShowFinalStep === true) return <FinalStep />;
  }, [isShowFinalStep]);

  const ShowFinalStepAutoPopup = useCallback(() => {
    if (isShowFinalStepAuto === true) return <FinalStepAuto />;
  }, [isShowFinalStepAuto]);

  return (
    <>
      <Header />
      <div className="mt-3 flex flex-row pb-7">
        <SchedulesPanel />
      </div>
      {ShowSuggestionsPopup()}
      {ShowScheduleItemPopup()}
      {ShowScheduleMultipleItemsPopup()}
      {ShowCreateSchedulePopup()}
      {ShowSelectSuggestsPopup()}
      {ShowChooseCategoriesPopup()}
      {ShowSourceIdeasPopup()}
      {ShowSourceIdeasAutoPopup()}
      {ShowScheduleCommentsPopup()}
      {ShowFinalStepPopup()}
      {ShowFinalStepAutoPopup()}
      {ShowContentDetailsPopup()}
      {isShowManageSchedules && <ManageSchedules />}
      {currentChangeContent && <ModalEditingContent />}
    </>
  );
};

export default SchedulesContents;
