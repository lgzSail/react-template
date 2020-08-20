import React from 'react';
import { Nav } from '@alifd/next';
import data from './data';
import './index.scss';

const { Item, SubNav } = Nav;

class IndexNav extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabKey: 0,
    }
  }

  componentDidMount() {
    const bolToken = window.localStorage.getItem('token');
    if (bolToken === null) this.props.history.push('/login');
  }

  iconRender = (defaultNav) => {
    for (const item of data.list) {
      for (const key of item.childrenList) {
        if (key.label === defaultNav) {
          return item.label;
        }
      }
    }
  }

  render() {
    const defaultNav = this.props.history.location.pathname && this.props.history.location.pathname.slice(1);
    const bol = window.location.pathname === '/login';
    if (bol) return null;
    return (
      <div className="nav">
        <Nav
          defaultSelectedKeys={defaultNav}
          onSelect={(value) => {
            this.props.history.push(`/${value}`)
          }}
          className="nav-cnt"
          style={{ width: '200px' }}
        >
          {
            data.list.map((item) => {
              if (item.childrenList) {
                return <SubNav
                  key={item.label}
                  label={item.value}
                  icon={<img alt=" " className="nav-icon" src={require(`../../img/${item.iconAction}.png`)} />}
                >
                  {
                    item.childrenList.map((key) => {
                      return <Item key={key.label} >{key.value}</Item>
                    })
                  }
                </SubNav>
              } else {
                return null;
              }
            })
          }
        </Nav>
      </div>
    )
  }
}

export default IndexNav;
