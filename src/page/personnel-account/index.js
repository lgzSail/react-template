import React from 'react';
import { Form, Input, Table, Pagination, Select, Button, Switch, Dialog, Message } from '@alifd/next';
import AxiosList from '../../require/require';
import './index.scss';

const FormItem = Form.Item;

class PersonnelAccount extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabKey: 0,
            size: 10,
            page: 1
        }
    }

    componentDidMount() {
        this.userAdmin();
    }

    // 获取列表接口调用
    userAdmin = (query, bol) => {
        const { size, page } = this.state;
        const data = {
            size,
            page,
            ...query
        };
        AxiosList.userAdmin(data, this.props.history, bol).then((res) => {
            const { data = {} } = res;
            this.setState({
                total: data.totalElements,
                tableList: data.content
            });
        })
    }

    // 提交查询信息
    submitHandler = (value) => {
        this.setState({
            page: 1
        }, () => {
            this.userAdmin(value)
        });
    }

    // 帐号状态render
    userType = (value, key, item) => {
        return <Switch checked={value === 1} size="small" onChange={(bol) => this.userTypeChange(bol, item.id)} />
    }

    // 修改帐号状态
    userTypeChange = (value, id) => {
        if (value) {
            AxiosList.stateAdmin(id, this.props.history).then((res) => {
                this.userAdmin(null, true);
            })
        } else {
            AxiosList.stopAdmin(id, this.props.history).then((res) => {
                this.userAdmin(null, true);
            })
        }
    }

    // 创建帐号点击事件
    createAccount = () => {
        const formItemLayout = {
            labelCol: {
                fixedSpan: 8
            },
            wrapperCol: {
                span: 18
            }
        };
        const { createAdminFormData, editBol } = this.state;
        const title = editBol ? '编辑帐号' : '创建帐号'
        this.createAdmin = Dialog.show({
            title,
            content: <Form
                className="createAdminForm"
                value={createAdminFormData}
                onChange={(value) => this.setState({ createAdminFormData: value })}
                {...formItemLayout}
            >
                <FormItem requiredMessage="该字段不可为空" required label="帐号">
                    <Input disabled={editBol} name="username" style={{ width: 340 }} placeholder="请输入帐号" />
                </FormItem>
                {
                    editBol ?
                        null
                        :
                        <div>
                            <FormItem requiredMessage="该字段不可为空" required {...formItemLayout} label="密码">
                                <Input.Password disabled={editBol} name="password" style={{ width: 340 }} placeholder="请输入密码" />
                            </FormItem>
                            <FormItem requiredMessage="该字段不可为空" required {...formItemLayout} label="确认密码">
                                <Input.Password disabled={editBol} name="passwordSure" style={{ width: 340 }} placeholder="请输入密码" />
                            </FormItem>
                        </div>
                }
                <FormItem requiredMessage="该字段不可为空" required label="员工姓名">
                    <Input name="name" style={{ width: 340 }} placeholder="请输入姓名" />
                </FormItem>
                <FormItem requiredMessage="该字段不可为空" required label="员工手机号">
                    <Input name="phone" style={{ width: 340 }} placeholder="请输入手机号" />
                </FormItem>
                <FormItem wrapperCol={{ offset: 10 }} >
                    <Form.Submit onClick={this.editOwnerSub} validate type="primary">确定</Form.Submit>
                    <Button
                        className="cancel"
                        onClick={() => {
                            this.setState({
                                createAdminFormData: {}
                            }, () => {
                                this.createAdmin.hide()
                            })
                        }}>取消</Button>
                </FormItem>
            </Form>,
            footer: false,
            onClose: () => {
                this.setState({
                    createAdminFormData: {}
                }, () => {
                    this.createAdmin.hide()
                })
            }
        });
    }

    // 创建帐号
    editOwnerSub = (data, error) => {
        
        if (error) return null;
       
        const { editBol } = this.state;
        if (editBol) {
            AxiosList.editAdmin(data, this.props.history).then((res) => {
                this.userAdmin(null, true);
                this.createAdmin.hide()
            })
        } else {
            if (data.password !== data.passwordSure) {
                Message.error('请确认密码一致');
                return null;
            }
            AxiosList.createAdmin(data, this.props.history).then((res) => {
                this.userAdmin(null, true);
                this.createAdmin.hide()
            })
        }
    }

    // 重置密码事件
    resetPassword = (item) => {
        const formItemLayout = {
            labelCol: {
                fixedSpan: 4
            },
            wrapperCol: {
                span: 18
            }
        };
        item.password = undefined;
        this.setState({
            resetPasswordFormData: item
        }, () => {
            const { resetPasswordFormData } = this.state;

            this.resetPasswordDialog = Dialog.show({
                title: '重置密码',
                content: <Form
                    value={resetPasswordFormData}
                    onChange={(value) => this.setState({ resetPasswordFormData: value })}
                    {...formItemLayout}
                >
                    <FormItem label="帐号">
                        <Input disabled name="username" style={{ width: 340 }} placeholder="请输入帐号" />
                    </FormItem>
                    <FormItem requiredMessage="该字段不可为空" required label="密码">
                        <Input.Password name="password" style={{ width: 340 }} placeholder="请输入密码" />
                    </FormItem>
                    <FormItem requiredMessage="该字段不可为空" required label="确认密码">
                        <Input.Password name="passwordSure" style={{ width: 340 }} placeholder="请输入密码" />
                    </FormItem>
                    <FormItem wrapperCol={{ offset: 8 }} >
                        <Form.Submit onClick={this.resetPasswordSub} validate type="primary">提交</Form.Submit>
                        <Button
                            className="cancel"
                            onClick={() => {
                                this.setState({
                                    resetPasswordFormData: {}
                                }, () => {
                                    this.resetPasswordDialog.hide()
                                })
                            }}>取消</Button>
                    </FormItem>
                </Form>,
                footer: false,
                onClose: () => {
                    this.setState({
                        resetPasswordFormData: {}
                    }, () => {
                        this.resetPasswordDialog.hide()
                    })
                }
            });
        })
    }

    // 重置密码
    resetPasswordSub = (value, error) => {
        if (error) return null;
        const { resetPasswordFormData } = this.state;
        if (resetPasswordFormData.password !== resetPasswordFormData.passwordSure) {
            Message.error('请确认密码一致');
            return null;
        }
        AxiosList.resetPassword(resetPasswordFormData, this.props.history).then((res) => {
            this.userAdmin(null, true);
            this.resetPasswordDialog.hide()
        })
    }

    // 分页选择
    pageChange = (value) => {
        this.setState({
            page: value,
        }, () => {
            this.userAdmin();
        })
    }

    // 重置密码render
    operation = (value, bol, item) => {
        return <div>
            <Button onClick={() => this.resetPassword(item)} className="btn-item-left" type="primary">重置密码</Button>
            <Button
                onClick={() => {
                    this.setState({
                        createAdminFormData: item,
                        editBol: true
                    }, () => {
                        this.createAccount()
                    })
                }}
                className="btn-item"
                type="primary"
            >
                编辑
            </Button>
        </div>
    }

    render() {
        const { page, size, total, tableList = [] } = this.state;
        
        const userState = JSON.parse(window.localStorage.getItem('user_state')) || [];
        return (
            <div className="personnelAccount">
                <div className="personnelAccount-header">
                    <div className="blue-div" />
                    <div className="header-text">人员帐号</div>
                </div>

                {/* {查询表单} */}
                <Form className="personnelAccount-form" inline>
                    <FormItem label="帐号">
                        <Input name="username" style={{ width: 248 }} placeholder="" />
                    </FormItem>
                    <FormItem label="帐号状态">
                        <Select
                            name="state"
                            defaultValue={0}
                            dataSource={[
                                { label: '全部', value: 0},
                                ...userState 
                            ]}
                        />
                    </FormItem>
                    <FormItem>
                        <Form.Submit validate type="primary" onClick={this.submitHandler}>查询</Form.Submit>
                        <Form.Reset style={{ marginLeft: 10 }}>清除查询条件</Form.Reset>
                    </FormItem>
                </Form>

                {/* {操作项} */}
                <div className="btn-cnt">
                    <Button onClick={() => {
                        this.setState({
                            editBol: false
                        }, () => {
                            this.createAccount();
                        })
                        }} type="primary">创建帐号</Button>
                </div>

                {/* {访客信息表格} */}
                <Table
                    className="table"
                    dataSource={tableList}
                    hasBorder={false}
                >
                    <Table.Column title="序号" dataIndex="id" />
                    <Table.Column title="帐号" dataIndex="username" />
                    <Table.Column title="员工姓名" dataIndex="name" />
                    <Table.Column title="帐号状态" cell={this.userType} dataIndex="state" />
                    <Table.Column title="操作" cell={this.operation} dataIndex="state" />
                </Table>
                <Pagination totalRender={total => `总数: ${total} `} pageSize={size} current={page} total={total} shape="arrow-only" showJump={false} onChange={this.pageChange} className="page" />
            </div>
        )
    }
}

export default PersonnelAccount;
