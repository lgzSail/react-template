import React from 'react';
import { Form, Table, Pagination, Select, Button, Switch, Message } from '@alifd/next';
import AxiosList from '../../require/require';
import CreateAppletImg from '../../component/create-applet-img-dialog';
import './index.scss';

const FormItem = Form.Item;

class AppletImg extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabKey: 0,
            size: 10,
            page: 1
        }
    }
    componentDidMount() {
        this.appletImg();
    }

    // 获取列表接口调用
    appletImg = (query, bol) => {
        const { size, page } = this.state;
        const data = {
            size,
            page,
            ...query
        };
        AxiosList.appletImg(data, this.props.history, bol).then((res) => {
            const { data = {} } = res;
            this.setState({
                total: data.totalElements,
                tableList: data.content
            });
        })
    }

    // 提交查询信息
    submitHandler = (value) => {
        this.appletImg(value);
    }

    // 操作项渲染
    operation = (value, bol, item) => {
        return <div onClick={() => this.editAppletImg(item)} className="font-color-blue">编辑</div>
    }

    // 编辑小程序头图
    editAppletImg = (item) => {
        const data = JSON.parse(JSON.stringify(item));
        this.setState({
            editAppletData: data,
            uploadImgVisible: true
        })
    }

    // 小程序头图状态
    imgType = (value, index, item) => {
        return <Switch
            checked={value === 1}
            size="small"
            onChange={(bol) => this.imgTypeChange(bol, item.id)}
        />
    }

    // 小程序状态改变
    imgTypeChange = (bol, id) => {
        const arr = [];
        arr.push(id);
        if (bol) {
            AxiosList.stateAppletImg(arr, this.props.history).then(() => {
                this.appletImg(null, true);
            })
        } else {
            AxiosList.stopAppletImg(arr, this.props.history).then(() => {
                this.appletImg(null, true);
            })
        }
    }

    // 批量启动小程序头图
    stateAppletImgs = () => {
        const { selectArr = [] } = this.state;
        if (selectArr.length === 0) {
            Message.error('请至少选择一个选项');
            return null;
        }
        AxiosList.stateAppletImg(selectArr, this.props.history).then(() => {
            this.appletImg(null, true);
        })
    }

    // 批量停用小程序头图
    stopAppletImgs = () => {
        const { selectArr = [] } = this.state;
        if (selectArr.length === 0) {
            Message.error('请至少选择一个选项');
            return null;
        }
        AxiosList.stopAppletImg(selectArr, this.props.history).then(() => {
            this.appletImg(null, true);
        })
    }

    // table 复选框选择
    selectChange = (...args) => {
        console.log(args)
        this.setState({
            selectArr: args[0]
        })
    }

    // 分页选择
    pageChange = () => {
        this.setState({
            selectArr: null
        })
    }

    // 图标Icon渲染
    imgRender = (value) => {
        return <div>
            <img className="icon-img-size" src={value} alt="" />
        </div>
    }

    // 显示创建弹窗
    addImg = () => {
        this.setState({
            uploadImgVisible: true
        })
    }

    // 关闭创建弹窗
    CreateAppletImgDialogClose = () => {
        this.setState({
            uploadImgVisible: false,
            editAppletData: undefined
        })
    }

    // 分页选择
    pageChange = (value) => {
        this.setState({
            page: value,
            selectArr: undefined
        }, () => {
            this.appletImg();
        })
    }

    render() {
        const { selectArr, page, size, total, tableList = [], uploadImgVisible, editAppletData } = this.state;
        const carouselPictureState = JSON.parse(window.localStorage.getItem('visitor_carousel_picture_state')) || [];
        return (
            <div className="AppletImg">
                <div className="AppletImg-header">
                    <div className="blue-div" />
                    <div className="header-text">小程序头图</div>
                </div>

                {/* {查询表单} */}
                <Form className="AppletImg-form" inline>
                    <FormItem label="状态">
                        <Select
                            name="state"
                            defaultValue={0}
                            dataSource={[
                                { label: '全部', value: 0 },
                                ...carouselPictureState
                            ]}
                        />
                    </FormItem>
                    <FormItem>
                        <Form.Submit validate type="primary" onClick={this.submitHandler}>查询</Form.Submit>
                        <Form.Reset style={{ marginLeft: 10 }}>清除查询条件</Form.Reset>
                    </FormItem>
                </Form>

                <div className="btn-cnt">
                    <Button onClick={this.addImg} type="primary">新增</Button>
                    <Button onClick={this.stateAppletImgs} className="btn-item" type="primary">启用</Button>
                    <Button onClick={this.stopAppletImgs} type="primary" warning>停用</Button>
                </div>
                {/* {小程序头图表格} */}
                <Table
                    className="table"
                    hasBorder={false}
                    dataSource={tableList}
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
                    <Table.Column title="标题" dataIndex="description" />
                    <Table.Column title="图片" cell={this.imgRender} dataIndex="picture" />
                    <Table.Column title="创建日期" dataIndex="createDate" />
                    <Table.Column title="状态" cell={this.imgType} dataIndex="state" />
                    <Table.Column title="操作" cell={this.operation} />
                </Table>
                <Pagination totalRender={total => `总数: ${total} `} pageSize={size} current={page} total={total} shape="arrow-only" showJump={false} onChange={this.pageChange} className="page" />
                <CreateAppletImg formData={editAppletData} uploadData={() => this.appletImg(null, true)} history={this.props.history} visible={uploadImgVisible} onClose={this.CreateAppletImgDialogClose} />
            </div>
        )
    }
}

export default AppletImg;
