import React from 'react';
import { Tab, Message, Input, Button } from '@alifd/next';
import AxiosList from '../../require/require';
import './index.scss';

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabKey: "0",
    }
  }

  componentDidMount() {
    AxiosList.getConfig().then((res) => {
      const { data = {} } = res;
      const newData = data.data || {};
      this.setState({
        sysName: newData.name
      })
    })
  }

  // 切换tab
  tabChange = (value) => {
    this.setState({
      tabKey: value
    })
  }

  // 登录接口调用
  login = () => {

    const { username, password, tabKey, phone, code } = this.state;
    if (tabKey === "0") {
      const data = {
        username,
        password
      }

      // 判断是否为空
      for (const key in data) {
        if (!data[key]) {
          Message.error('请输入帐号或密码。');
          return null;
        }
      }

      // 帐号登录
      AxiosList.login(data).then((res) => {
        const result = res.data;
        if (result.status === -1) {
          Message.error(result.info);
        } else {
          Message.success(result.info);
          window.localStorage['visitor_user'] = JSON.stringify(result.data);
          console.log(result.data.token)
          window.localStorage['visitor_token'] = result.data.token;
          this.props.history.push('/visitorInfo')
        }
      })
    } else {
      const data = {
        phone,
        code
      }
      // 判断是否为空
      for (const key in data) {
        if (!data[key]) {
          Message.error('请输入手机号或验证码。');
          return null;
        }
      }

      // 帐号登录
      AxiosList.phoneLogin(data).then((res) => {
        const result = res.data;
        if (result.status === -1) {
          Message.error(result.info);
        } else {
          Message.success(result.info);
          window.localStorage['visitor_user'] = JSON.stringify(result.data);
          window.localStorage['visitor_token'] = result.data.token;
          this.props.history.push('/visitorInfo')
        }
      })
    }

  }

  // 输入帐号
  inputUser = (value) => {
    this.setState({
      username: value,
      errorMsg: false
    });
  }

  // 输入密码
  inputPassword = (value) => {
    this.setState({
      password: value,
      errorMsg: false
    })
  }

  // 输入手机号
  inputPhone = (value) => {
    const val = value.replace(/[^\d]/g, '');
    this.setState({
      phone: val,
      errorMsg: false
    })
  }

  // 输入验证码
  inputCode = (value) => {
    const val = value.replace(/[^\d]/g, '');
    this.setState({
      code: val,
      errorMsg: false
    })
  }

  // 获取验证码
  getCode = () => {
    const { phone, disabledBtn } = this.state;
    if (disabledBtn) return null;
    const data = {
      phone
    }
    this.setState({
      disabledBtn: true
    })
    AxiosList.getCode(data).then((res) => {
      const result = res.data;
      if (result.status === 200) {
        Message.success(result.info);
      } else {
        Message.error(result.info);
      }

    }).finally(() => {
      this.setState({
        disabledBtn: false
      })
    })
  }

  render() {
    const { phone, disabledBtn, code, sysName } = this.state;

    const getCode = (
      <div onClick={this.getCode} style={{ color: disabledBtn ? 'grey' : null }} className={"getCode"}>
        获取验证码
      </div>
    );
    return (
      <div className="login">
        <img alt=" " className="login-bg" src={require("../../img/bg.png")} />
        <div className="login-cnt">
          <div id="sysTitle" className="sysTitle">
            {sysName}
          </div>
          <div className="login-cnt-border">
            <div className="login-cnt-right" />
            <div className="login-cnt-left">
              {/* {登录框} */}
              <Tab onChange={this.tabChange} navClassName={'login-tab'}>

                {/* {帐号输入} */}
                <Tab.Item title="帐号密码登录" key="0">
                  {/* <Message style={{ display: errorMsg ? 'block' : 'none' }} className="login-Message-warning" type="warning">
                    {errorMsgText}
                  </Message> */}
                  <Input style={{ width: '320px' }} size="large" onChange={this.inputUser} className="login-input login-input-first" placeholder="请输入帐号" />
                  <Input.Password style={{ width: '320px' }} size="large" onChange={this.inputPassword} className="login-input" placeholder="请输入密码" />
                </Tab.Item>

                {/* {手机输入} */}
                <Tab.Item title="手机验证码登录" key="1">
                  <Input maxLength={11} style={{ width: '320px' }} value={phone} onChange={this.inputPhone} size="large" className="login-input login-input-first" placeholder="请输入手机号" />
                  <Input value={code} innerAfter={getCode} onChange={this.inputCode} style={{ width: '320px' }} size="large" className="login-input" placeholder="请输入验证码" />
                </Tab.Item>
              </Tab>
              <Button size="large" onClick={this.login} type="primary" className="login-btn">登录</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;
