import React from 'react';
import { render } from 'react-dom';

import 'react-calendar/dist/Calendar.css';

 import './assets/css/styles.css';
 import './assets/css/tailwind.css';
 import { ToastContainer } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';
// css for editor
 import './assets/css/editor.css';
// import './styles.css';
import App from './App.js';
import store from './store';
import { Provider } from 'react-redux';

const root = document.createElement('div');
document.body.appendChild(root);

render(
  <Provider store={store}>
    <App />
    {/* <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    /> */}
  </Provider>
  , root);