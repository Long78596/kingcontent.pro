// @ts-nocheck
 import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

 import PrivateRoute from './containers/PrivateRoute';
 import Layout from './components/Layout.js';
import Login from './pages/Login.js';
 import Logout from './pages/Logout';
 import Home from './pages/Home.js';
 import CategoriesPage from './pages/CategoriesPage';
 import Fanpages from './pages/Fanpages.js';
 import Collections from './pages/Collections.js';
 import Editor from './pages/editor/Editor.js';
 import CategoriesContent from './components/CategoriesContent/index.js';
import Trendings from './pages/Trendings.js';
import Schedules from './pages/Schedules';
import Interactions from './pages/Interactions';
import ContentLiked from './pages/ContentLiked';
import SpecialFollow from './pages/SpecialFollow';
import Content from './pages/content/Content';
import RunningAds from './pages/RunningAds';
import Tiktok from './pages/Tiktok/Tiktok.js';
import Douyin from './pages/Douyin/Douyin.js';
import Instagram from './pages/Instagram/Instagram.js';
import FanpagesListPage from './pages/fanpagesList';
import CreatePost from './pages/createPost/CreatePost';
 import CreateLabelAdmin from './pages/createLabelAdmin.js';
 import Account from './pages/account';
 import PhotoEditor from './pages/createPost/components/photoeditor.js';
 import noLoginPage from './pages/noLoginPage';
 import activationPage from './pages/ActivationPage.js';
  import Threads from './pages/Threads/Threads.js';
 import privacy from './pages/privacy';
 import termConditions from './pages/termConditions';
 import topFanPages from './pages/topFanPages';
  import TextToVideo from './pages/TextToVldeo/TextToVideo.js';
  import VideoList from './pages/VideoEditor/VideoEditor';
 import NoVip3Page from './pages/NoVip3Page';
  import SuggestionsPopup from './components/Schedules/Popups/SuggestionsPopup';

class Routers extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/dang-nhap" component={Login} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/dang-xuat" component={Logout} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/chua-kich-hoat" component={noLoginPage} />
          <Route exact path="/chua-kich-hoat-vip3" component={NoVip3Page} />
          <Route exact path="/yeu-cau-kich-hoat" component={activationPage} />
          <Route exact path="/chinh-sach-bao-mat" component={privacy} />
          <Route exact path="/huong-dan-su-dung" component={termConditions} />
          <Route exact path="/bang-xep-hang" component={topFanPages} />
          <Layout>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path="/danh-muc/:slug/:id"
              component={CategoriesContent}
            />
            <Route exact path="/dang-thinh-hanh" component={Trendings} />
            <Route exact path="/nhieu-tuong-tac" component={Interactions} />
            <Route exact path="/lich-dang-bai" component={Schedules} />
            <Route exact path="/danh-muc-content" component={CategoriesPage} />
            <Route exact path="/danh-muc-fanpage" component={Fanpages} />
            <Route exact path="/bo-suu-tap-content" component={Collections} />
            <Route exact path="/tao-content" component={CreatePost} />
            <Route exact path="/tao-content-old" component={Editor} />
            <Route exact path="/y-tuong-da-luu" component={ContentLiked} />
            <Route exact path="/theo-doi-dac-biet" component={SpecialFollow} />
            <Route exact path="/content-da-thich" component={Content} />
            <Route exact path="/dang-chay-ads" component={RunningAds} />
            <Route exact path="/quan-ly-tiktok" component={Tiktok} />
            <Route exact path="/quan-ly-douyin" component={Douyin} />
            <Route exact path="/quan-ly-threads" component={Threads} />
            <Route exact path="/quan-ly-instagram" component={Instagram} />
            <Route exact path="/danh-sach-page" component={FanpagesListPage} />
            <Route exact path="/tao-bai-viet" component={CreatePost} />
            <Route exact path="/text-to-video" component={TextToVideo} />
            <Route exact path="/video-editor" component={VideoList} />
            <Route
              exact
              path="/admin/nhan-tao-san"
              component={CreateLabelAdmin}
            />
            <Route exact path="/chinh-sua-anh" component={PhotoEditor} />
            <Route exact path="/user-info" component={Account} />
          </Layout>
        
        </Switch>
      </Router>
      
    );
  }
}

export default Routers;
