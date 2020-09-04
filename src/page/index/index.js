import React from 'react';
// 路由
// import { Tab, Message, Input, Button } from '@alifd/next';
// import { useHistory, BrowserRouter as Router, Route, } from 'react-router-dom';
import {connect} from 'react-redux';
import { dispatchProps } from '../../redux/reducer';
import './index.scss';

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabKey: 0,
    }
  }

  componentDidMount() {
    this.props.dispatchFun.getValue();
  }

  render() {
    console.log(this.props);
    return (
      <div>
        hello world
      </div>
      // <Router history={useHistory}>
      //   <div className="router-Cnt">

      //   </div>
      // </Router>
    )
  }
}

const stateProps = (state) => {
  return {
    ...state
  }
}

export default connect(stateProps, dispatchProps)(Index);
