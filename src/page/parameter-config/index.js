import React from 'react';
import { Switch, Input, Button } from '@alifd/next';
import AxiosList from '../../require/require';
import './index.scss';

class ParameterConfig extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabKey: 0,
            sysConfig: {}
        }
    }

    componentDidMount() {
        this.getSysConfig();
    }

    getSysConfig = (bol) => {
        AxiosList.getSysConfig(this.props.history, bol).then((res) => {
            console.log(res);
            this.setState({
                sysConfig: res.data
            })
        })
    }

    render() {
        let { sysConfig } = this.state;
        return (
            <div className="ParameterConfig">
                {/* {上半部分} */}
                <div className="ParameterConfig-top">
                    <div className="ParameterConfig-header">
                        <div className="blue-div" />
                        <div className="header-text">参数配置</div>
                    </div>
                    {/* {卡片容器} */}
                    <div className="card-cnt">
                        <div className="card-item-community">
                            <div className="card-item-cnt">
                                <div className="item-left">
                                    <div className="item-circular">
                                        <img className="item-img" alt="" src={require('../../img/community-icon.png')} />
                                    </div>
                                    <span>
                                        社区身份验证
                                    </span>
                                </div>
                                <div className="item-right">
                                    <Switch
                                        checked={sysConfig.communityAuthenticationOpen === 1}
                                        size="small"
                                        onChange={(value) => {
                                            sysConfig.communityAuthenticationOpen = value ? 1 : 0;
                                            AxiosList.setSysConfig(sysConfig, this.props.history).then(() => {
                                                this.getSysConfig(true);
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="card-item-enterprise">
                            <div className="card-item-cnt">
                                <div className="item-left">
                                    <div className="item-circular">
                                        <img className="item-img" alt="" src={require('../../img/enterprise-icon.png')} />
                                    </div>
                                    <span>
                                        企业身份验证
                                    </span>
                                </div>
                                <div className="item-right">
                                    <Switch
                                        checked={sysConfig.enterpriseAuthenticationOpen === 1}
                                        size="small"
                                        onChange={(value) => {
                                            sysConfig.enterpriseAuthenticationOpen = value ? 1 : 0;
                                            AxiosList.setSysConfig(sysConfig, this.props.history).then(() => {
                                                this.getSysConfig(true);
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* {下半部分} */}
                <div className="ParameterConfig-bottom">
                    <div className="bottom-title">系统名称修改</div>
                    <div>
                        <span>系统名称</span>
                        <Input
                            onChange={(value) => {
                                sysConfig.name = value;
                                this.setState({
                                    sysConfig
                                })
                            }}
                            value={sysConfig.name}
                            className="sysName"
                            style={{ width: 312 }}
                            placeholder="输入你想要修改成的系统名称"
                        />
                        <Button onClick={
                            () => {
                                AxiosList.setSysConfig(sysConfig, this.props.history).then(() => {
                                    document.getElementById('sysTitle').innerText = sysConfig.name;
                                })
                            }
                        } type="primary">保存</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ParameterConfig;
