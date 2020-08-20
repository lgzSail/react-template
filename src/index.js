import React from 'react';
import ReactDOM from 'react-dom';
import "babel-polyfill";
import './index.scss';

import App from './page/index/index';

import * as serviceWorker from './serviceWorker';
import '@alifd/next/dist/next.css';

// 路由渲染。 注：后期过多可单拉组件配置
ReactDOM.render(
  <App />,
  document.getElementById('root')
);

serviceWorker.unregister();
