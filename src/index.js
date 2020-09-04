import React from 'react';
import ReactDOM from 'react-dom';

// ie低版本兼容
import "babel-polyfill";

import App from './page/index/index';

import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux'
import store from './redux';

import '@alifd/next/dist/next.css';
import './index.scss';


// 路由渲染。 注：后期过多可单拉组件配置
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
