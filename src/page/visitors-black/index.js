import React from 'react';
import { Form, Input, Table, Pagination, Button, Dialog } from '@alifd/next';
import AxiosList from '../../require/require';
import './index.scss';

const FormItem = Form.Item;

class VisitorBlack extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            size: 10,
            page: 1,
        }
    }

    componentDidMount() {
        this.getVisitorBlockList();
    }

    // 获取列表接口调用
    getVisitorBlockList = (query) => {
        const { size, page } = this.state;
        const data = {
            size,
            page,
            ...query
        };
        AxiosList.visitorsBlock(data, this.props.history).then((res) => {
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
            this.getVisitorBlockList(value)
        });
    }

    // 操作项
    operation = (id) => {
        return <div>
            <Button onClick={() => this.removeBlack(id)} type="primary">移除</Button>
        </div>
    }

    // 移除黑名单
    removeBlack = (id) => {
        Dialog.show({
            title: '移除黑名单',
            content: <div style={{ minWidth: 180 }}>
                确定从黑名单中移除该访客？
            </div>,
            onOk: () => {
                AxiosList.removeBlack(id, this.props.history).then((res) => {
                    this.getVisitorBlockList();
                })
            }
        })
        
    }

    imgRender = (value) => {
        return <div>
            <span>{value}</span>
        </div>
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

    render() {
        const { page, size, total, tableList = [] } = this.state;
        return (
            <div className="VisitorBlack">
                <div className="VisitorBlack-header">
                    <div className="blue-div" />
                    <div className="header-text">访客黑名单</div>
                </div>

                {/* {查询表单} */}
                <Form className="VisitorBlack-form" inline>
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

                {/* {访客信息表格} */}
                <Table hasBorder={false} className="table" dataSource={tableList}>
                    <Table.Column title="序号" dataIndex="id" />
                    <Table.Column title="访客姓名" dataIndex="name" />
                    <Table.Column title="访客电话" dataIndex="phone" />
                    <Table.Column title="身份证号码" dataIndex="idCardNo" />
                    <Table.Column title="刷脸凭证" cell={this.imgRender} />
                    <Table.Column title="移除黑名单" cell={this.operation} dataIndex="id" />
                </Table>
                <Pagination totalRender={total => `总数: ${total} `} pageSize={size} current={page} total={total} shape="arrow-only" showJump={false} onChange={this.pageChange} className="page" />
            </div>
        )
    }
}

export default VisitorBlack;
