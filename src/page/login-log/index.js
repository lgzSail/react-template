import React from 'react';
import { Form, Input, Table, Pagination, Select, DatePicker, Button } from '@alifd/next';
import moment from 'moment';
import AxiosList from '../../require/require';
import './index.scss';

moment.locale('zh-cn', {
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    weekdaysMin: '日_一_二_三_四_五_六'.split('_')
});

const FormItem = Form.Item;

const Option = Select.Option;

const { RangePicker } = DatePicker;

class LoginLog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            size: 10,
            page: 1,
        }
    }

    componentDidMount() {
        this.loginLogList();
    }

    // 获取列表接口调用
    loginLogList = (query) => {
        const { size, page } = this.state;
        const data = {
            size,
            page,
            ...query
        };
        AxiosList.loginLog(data, this.props.history).then((res) => {
            const { data = {} } = res;
            this.setState({
                total: data.totalElements,
                tableList: data.content
            });
        })
    }

    // 提交查询信息
    submitHandler = (value) => {
        console.log(value)
    }

    // 分页选择
    pageChange = (value) => {
        this.setState({
            page: value,
        }, () => {
            this.loginLogList();
        })
    }

    render() {
        const { page, size, total, tableList = [] } = this.state;
        return (
            <div className="LoginLog">
                <div className="LoginLog-header">
                    <div className="blue-div" />
                    <div className="header-text">登录日志</div>
                </div>

                {/* {查询表单} */}
                <Form className="LoginLog-form" inline>

                    <FormItem className="time-div" label="选择时间">
                        <RangePicker name="time" />
                    </FormItem>
                    <FormItem label="操作菜单">
                        <Select
                            name="type"
                        >
                            <Option value="0">全部</Option>
                            <Option value="1">人员信息</Option>
                            <Option value="2">人员分组</Option>
                            <Option value="3">资产信息</Option>
                            <Option value="4">指标分组</Option>
                            <Option value="5">指标统计</Option>
                            <Option value="6">角色管理</Option>
                            <Option value="7">人员授权</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="帐号">
                        <Input name="account" style={{ width: 248 }} placeholder="" />
                    </FormItem>
                    <FormItem>
                        <Form.Submit validate type="primary" onClick={this.submitHandler}>查询</Form.Submit>
                        <Form.Reset style={{ marginLeft: 10 }}>清除查询条件</Form.Reset>
                    </FormItem>
                </Form>

                {/* {操作项} */}
                <div className="btn-cnt">
                    <Button onClick={this.exportClk} type="primary">导出</Button>
                </div>

                {/* {访客信息表格} */}
                <Table
                    hasBorder={false}
                    className="table"
                    dataSource={tableList}
                >
                    <Table.Column title="序号" dataIndex="id" />
                    <Table.Column title="帐号" dataIndex="userId" />
                    <Table.Column title="员工姓名" dataIndex="name" />
                    <Table.Column title="登录时间" dataIndex="time" />
                </Table>
                <Pagination totalRender={total => `总数: ${total} `} pageSize={size} current={page} total={total} shape="arrow-only" showJump={false} onChange={this.pageChange} className="page" />
            </div>
        )
    }
}

export default LoginLog;
