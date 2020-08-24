import React from 'react';
import { Form, Input, Table, Pagination, Button, Dialog, Message } from '@alifd/next';
import AxiosList from '../../require/require';
import './index.scss';

const FormItem = Form.Item;

class VisitorInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            size: 10,
            page: 1,
        }
    }

    componentDidMount() {
        this.getVisitorList();
    }

    // 获取列表接口调用
    getVisitorList = (query) => {
        const { size, page } = this.state;
        const data = {
            size,
            page,
            ...query
        };
        AxiosList.getVisitorList(data, this.props.history).then((res) => {
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
            this.getVisitorList(value)
        });
    }

    // table 复选框选择
    selectChange = (...args) => {
        this.setState({
            selectArr: args[0]
        })
    }

    // 分页选择
    pageChange = (value) => {
        this.setState({
            page: value,
            selectArr: undefined
        }, () => {
            this.getVisitorList();
        })
    }

    imgRender = (value) => {
        return <div className="imgRender">
            <div onClick={() => this.imgView(value)} >
                查看凭证
            </div>
        </div>
    }

    // 查看凭证
    imgView = (id) => {
        AxiosList.viewVisitorImg(id, this.props.history).then((res) => {
            const { data = {} } = res;
            if (!data.data) {
                Message.error('无刷脸凭证');
                return null;
            }
            this.setState({
                imgVisible: true,
                viewImg: data.data
            })
        })
    }

    addBlacklist = () => {
        const { selectArr = [] } = this.state;
        if (selectArr.length === 0) {
            Message.error('请至少选择一名访客')
            return null;
        }
        Dialog.show({
            title: '加入黑名单',
            content: <div style={{ minWidth: 180 }}>
                是否将访客拉入黑名单？
            </div>,
            onOk: () => {
                AxiosList.addBlack(selectArr, this.props.history).then((res) => {
                    this.getVisitorList();
                })
            }
        })
    }


    render() {
        const { selectArr, page, size, total, tableList = [], imgVisible, viewImg } = this.state;
        console.log(viewImg)
        return (
            <div className="VisitorInfo">
                <div className="VisitorInfo-header">
                    <div className="blue-div" />
                    <div className="header-text">访客信息</div>
                </div>

                {/* {查询表单} */}
                <Form className="VisitorInfo-form" inline>
                    <FormItem label="访客姓名">
                        <Input name="name" style={{ width: 248 }} placeholder="" />
                    </FormItem>
                    <FormItem label="访客电话">
                        <Input name="phone" style={{ width: 248 }} placeholder="" />
                    </FormItem>
                    <FormItem>
                        <Form.Submit validate type="primary" onClick={this.submitHandler}>查询</Form.Submit>
                        <Form.Reset style={{ marginLeft: 10 }}>清除查询条件</Form.Reset>
                    </FormItem>
                </Form>

                {/* {操作项} */}
                <div className="btn-cnt">
                    <Button onClick={this.addBlacklist} type="primary">加入黑名单</Button>
                </div>

                {/* {访客信息表格} */}
                <Table
                    className="table"
                    dataSource={tableList}
                    hasBorder={false}
                    rowSelection={{
                        onChange: this.selectChange,
                        selectedRowKeys: selectArr,
                        columnProps: () => {
                            return {
                                lock: 'left',
                                width: 90,
                                align: 'center'
                            };
                        }
                    }}
                >
                    <Table.Column title="序号" dataIndex="id" />
                    <Table.Column title="访客姓名" dataIndex="name" />
                    <Table.Column title="访客电话" dataIndex="phone" />
                    <Table.Column title="身份证号码" dataIndex="idCardNo" />
                    <Table.Column title="刷脸凭证" cell={this.imgRender} dataIndex="id" />
                </Table>
                <Pagination totalRender={total => `总数: ${total} `} pageSize={size} current={page} total={total} shape="arrow-only" showJump={false} onChange={this.pageChange} className="page" />
                {
                    imgVisible && viewImg ?
                        <div className="viewImgCnt">
                            <img className="imgSize" src={viewImg} alt="" />
                            <img onClick={() => this.setState({ imgVisible: false, viewImg: undefined })} className="icon" src={require('../../img/close.png')} alt="" />
                        </div>
                        :
                        null
                }
            </div>
        )
    }
}

export default VisitorInfo;
