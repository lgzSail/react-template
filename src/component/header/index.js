import React from 'react';
import AxiosList from '../../require/require';
import fun from '../../unil'
import './index.scss';
import { Message, Dialog } from '@alifd/next';



class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabKey: 0,
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
    AxiosList.getMd5().then((res) => {
      if (window.localStorage.getItem('visitor_md5') !== (res.data && res.data.data)) {
        window.localStorage.setItem('visitor_md5', res.data.data);
        this.getDataList();
      }
    })
  }

  getDataList = () => {
    AxiosList.dataList().then((res) => {
      if (res.status === 200) {
        const data = res.data.data;
        for (const key in data) {
          window.localStorage.setItem(`visitor_${key}`, JSON.stringify(fun.parseArr(data[key].data)))
        }
      }
    });
  }

  // 退出登录
  loginOut = () => {
    Dialog.show({
      title: '是否退出？',
      content: <div style={{ minWidth: 180 }}>
        确定退出？
      </div>,
      onOk: () => {
        AxiosList.loginOut().then((res) => {
          const { data = {} } = res;
          if (data.status === 200) {
            Message.success('退出登录成功。')
            localStorage.removeItem('token');
            this.props.history.push('/login');
          }
        })
      }
    })
  }

  render() {
    const bol = window.location.pathname === '/login';
    if (bol) return null;
    const obj = window.localStorage.getItem('visitor_user') && JSON.parse(window.localStorage.getItem('visitor_user'));
    const name = obj && obj.name;
    const {sysName} = this.state;
    return (
      <div className="header">
        <div className="header-text">
          <div id="sysTitle" className="sysTitle">
            {sysName}
          </div>
          <div className="header-right">
            <div>
              <img className="header-icon" src={require('../../img/adminIcon.png')} alt="" />
            </div>
            <div className="header-name">
              {name}
            </div>
            <div>
              <img onClick={this.loginOut} className="header-icon" src={require('../../img/loginOutIcon.png')} alt="" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Header;
