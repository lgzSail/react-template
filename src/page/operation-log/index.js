import React from 'react';
import { Form, Input, Table, Pagination, Select, DatePicker } from '@alifd/next';
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

const { RangePicker } = DatePicker;

class OperationLog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            size: 10,
            page: 1,
        }
    }

    componentDidMount() {
        this.operationLogList();
    }

    // 获取列表接口调用
    operationLogList = (query) => {
        const { size, page } = this.state;
        const data = {
            size,
            page,
            ...query
        };
        AxiosList.operationLog(data, this.props.history).then((res) => {
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
            this.operationLogList();
        })
    }

    render() {
        const { page, size, total, tableList = [] } = this.state;
        const operationLogArr = JSON.parse(window.localStorage.getItem('sys_operate_log_type')) || [];
        
        return (
            <div className="OperationLog">
                <div className="OperationLog-header">
                    <div className="blue-div" />
                    <div className="header-text">操作日志</div>
                </div>

                {/* {查询表单} */}
                <Form className="OperationLog-form" inline>

                    <FormItem className="time-div" label="选择时间">
                        <RangePicker name="time" />
                    </FormItem>
                    <FormItem label="操作菜单">
                        <Select
                            name="type"
                            dataSource={operationLogArr}
                        />
                    </FormItem>
                    <FormItem label="帐号">
                        <Input name="account" style={{ width: 248 }} placeholder="" />
                    </FormItem>
                    <FormItem>
                        <Form.Submit validate type="primary" onClick={this.submitHandler}>查询</Form.Submit>
                        <Form.Reset style={{ marginLeft: 10 }}>清除查询条件</Form.Reset>
                    </FormItem>
                </Form>

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
                    <Table.Column title="操作菜单" dataIndex="operation" />
                    <Table.Column title="操作行为" dataIndex="behavior" />
                </Table>
                <Pagination totalRender={total => `总数: ${total} `} pageSize={size} current={page} total={total} shape="arrow-only" showJump={false} onChange={this.pageChange} className="page" />
            </div>
        )
    }
}

export default OperationLog;
