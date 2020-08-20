import React from 'react';
// import { Tab, Message, Input, Button } from '@alifd/next';
import { useHistory, BrowserRouter as Router, Route, } from 'react-router-dom';

// 组件引入
import Header from '../../component/header';
import Nav from '../../component/nav';

// 页面引入
import login from '../login';
import VisitorInfo from '../visitor-info';
import OwnerInfo from '../owner-info';
import VisitorsRecord from '../visitors-record';
import VisitorBlack from '../visitors-black';
import PersonnelAccount from '../personnel-account';
import AppletImg from '../applet-img';
import EntranceConfig from '../entrance-config';
import OperationLog from '../operation-log';
import SignLog from '../login-log';
import ParameterConfig from '../parameter-config';
import './index.scss';

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabKey: 0,
    }
  }

  render() {
    return (
      <Router history={useHistory}>
        <Route component={Header} />
        <div className="router-Cnt">
          <Route component={Nav} />
          <Route path="/visitorInfo" component={VisitorInfo} />
          <Route path="/ownerInfo" component={OwnerInfo} />
          <Route path="/visitorsRecord" component={VisitorsRecord} />
          <Route path="/visitorsBlack" component={VisitorBlack} />
          <Route path="/PersonnelAccount" component={PersonnelAccount} />
          <Route path="/appletImg" component={AppletImg} />
          <Route path="/login" component={login} />
          <Route path="/entranceConfig" component={EntranceConfig} />
          <Route path="/operationLog" component={OperationLog} />
          <Route path="/signLog" component={SignLog} />
          <Route path="/parameterConfig" component={ParameterConfig} />
        </div>
      </Router>
    )
  }
}

export default Index;
