import React from 'react';
import { Helmet } from 'react-helmet';
import KCEditor from '../../components/KCEditor';
import { Provider, connect, useSelector } from 'react-redux';
import store from '../../store';
import CreateContentForm from '../../components/KCEditor/CreateContentForm';
import FormularPopup from '../../components/KCEditor/FormularPopup';
import SelectCategories from '../../components/KCEditor/SelectCategories';
import FeedbacksForm from '../../components/KCEditor/FeedbacksForm';
import facebook from '../../utils/facebook';

const Editor = (props) => {
  const { isShowFormularPopup = false, isShowCreateContentForm = false } =
    useSelector((state) => state.createContent);

  const { isShowCategories = false, isShowFeedbacksForm = false } = useSelector(
    (state) => state.editor
  );

  // facebook.getInstalledGroupIds();

  const ShowCreateContentForm = () => {
    return isShowCreateContentForm && <CreateContentForm />;
  };

  const ShowFormularPopup = () => {
    return isShowFormularPopup && <FormularPopup />;
  };

  const ShowCategoriesPopup = () => {
    return isShowCategories && <SelectCategories />;
  };

  const ShowFeedbacksForm = () => {
    return isShowFeedbacksForm && <FeedbacksForm />;
  };

  return (
    <>
      {ShowCategoriesPopup()}

      {ShowCreateContentForm()}

      {ShowFormularPopup()}

      {ShowFeedbacksForm()}

      <Provider store={store}>
        <Helmet>
          <title>Tạo Content</title>
        </Helmet>
        <h1 className="hidden">Tạo content</h1>
        <KCEditor />
      </Provider>
    </>
  );
};

export default Editor;
