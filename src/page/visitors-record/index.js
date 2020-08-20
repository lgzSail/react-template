import React from 'react';
import { Form, Input, Table, Pagination, Select, DatePicker } from '@alifd/next';
import moment from 'moment';
import AxiosList from '../../require/require';
import './index.scss';
import fun from '../../unil';

moment.locale('zh-cn', {
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    weekdaysMin: '日_一_二_三_四_五_六'.split('_')
});

const FormItem = Form.Item;

const { RangePicker } = DatePicker;

class VisitorsRecord extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabKey: 0,
            size: 10,
            page: 1,
        }
    }

    componentDidMount() {
        this.visitorsRecordList();
    }

    // 获取列表接口调用
    visitorsRecordList = (query) => {
        const { size, page } = this.state;
        const data = {
            size,
            page,
            ...query
        };
        AxiosList.visitorsRecord(data, this.props.history).then((res) => {
            const { data = {} } = res;
            this.setState({
                total: data.totalElements,
                tableList: data.content
            });
        })
    }

    // 提交查询信息
    submitHandler = (value = {}) => {
        this.setState({
            page: 1
        }, () => {
            if (value.time) {
                value.visitStartDate = value.time[0].format('yyyy-MM-DD HH:mm');
                value.visitEndDate = value.time[1].format('yyyy-MM-DD HH:mm');
            }
            this.visitorsRecordList(value)
        });
    }

    // 分页选择
    pageChange = (value) => {
        this.setState({
            page: value,
        }, () => {
            this.visitorsRecordList();
        })
    }

    // 时间列表渲染
    timeRender = (value, bol, item) => {
        return <div>
            {`${item.visitStartDate} - ${item.visitEndDate}`}
        </div>
    }

    render() {
        const { page, size, total, tableList = [] } = this.state;
        let visitRecordState = []
        if (window.localStorage['type'] === -1) {
            visitRecordState = JSON.parse(window.localStorage.getItem('visit_record_state')) || [];
        } else {
            visitRecordState = [
                { value: 2, label: "已同意" },
                { value: 3, label: "未到访" },
                { value: 4, label: "已到访" }
            ]
        }
        const stateRender = (value) => {
            return <span>{fun.returnValue(value, visitRecordState)}</span>
        }
        return (
            <div className="VisitorsRecord">
                <div className="VisitorsRecord-header">
                    <div className="blue-div" />
                    <div className="header-text">访客记录</div>
                </div>

                {/* {查询表单} */}
                <Form className="VisitorsRecord-form" inline>
                    <FormItem label="访客姓名">
                        <Input name="visitorName" style={{ width: 248 }} placeholder="" />
                    </FormItem>
                    <FormItem label="访客电话">
                        <Input name="visitorPhone" style={{ width: 248 }} placeholder="" />
                    </FormItem>
                    <FormItem className="time-div" label="到访日期">
                        <RangePicker name="time" />
                    </FormItem>
                    <FormItem label="状态">
                        <Select
                            name="state"
                            defaultValue={0}
                            dataSource={[
                                { label: '全部', value: 0 },
                                ...visitRecordState
                            ]}
                        />
                    </FormItem>
                    <FormItem>
                        <Form.Submit validate type="primary" onClick={this.submitHandler}>查询</Form.Submit>
                        <Form.Reset style={{ marginLeft: 10 }}>清除查询条件</Form.Reset>
                    </FormItem>
                </Form>

                {/* {访客信息表格} */}
                <Table hasBorder={false} className="table" dataSource={tableList}>
                    <Table.Column title="序号" dataIndex="visitLaunchId" />
                    <Table.Column title="访客姓名" dataIndex="visitorName" />
                    <Table.Column title="访客电话" dataIndex="visitorPhone" />
                    <Table.Column title="身份证号码" dataIndex="visitorIdCardNo" />
                    <Table.Column title="状态" cell={stateRender} dataIndex="state" />
                    <Table.Column title="业主姓名" dataIndex="ownerName" />
                    <Table.Column title="业主电话" dataIndex="ownerPhone" />
                    <Table.Column title="到访时间" cell={this.timeRender} dataIndex="visitStartDate" />
                    <Table.Column title="拜访住址" dataIndex="visitAddress" />
                </Table>
                <Pagination totalRender={total => `总数: ${total} `} pageSize={size} current={page} total={total} shape="arrow-only" showJump={false} onChange={this.pageChange} className="page" />
            </div>
        )
    }
}

export default VisitorsRecord;
