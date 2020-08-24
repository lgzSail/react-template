import React from 'react';
import { Form, Input, Table, Pagination, Select, Button, Dialog, Message } from '@alifd/next';
import AddOwnerDialog from '../../component/add-owner-dialog';
import MenberDialog from '../../component/menber-dialog';
import AxiosList from '../../require/require';
import { importsExcel } from '../../xlsx';
import './index.scss';
import fun from '../../unil';

const FormItem = Form.Item;

class OwnerInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            size: 10,
            page: 1,
        }
    }

    componentDidMount() {
        this.ownerInfoList();
    }

    // 获取列表接口调用
    ownerInfoList = (query, bol) => {
        const { size, page } = this.state;
        const data = {
            size,
            page,
            ...query
        };
        AxiosList.ownerInfoList(data, this.props.history, bol).then((res) => {
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
            this.ownerInfoList(value)
        });
    }

    // 添加业主信息点击事件
    addOwner = () => {
        this.setState({
            addOwnerVisible: true
        })
    }

    // 添加业主信息弹窗关闭
    addOwnerClose = () => {
        this.setState({
            addOwnerVisible: false,
            editItem: undefined,
            editOwnerFormData: undefined
        })
    }

    // 家庭成员
    menberBtn = (value, key, item) => {
        return <Button disabled={item.type === 1 ? false : true} onClick={() => this.menberClk(value)} type="secondary">查看</Button>
    }

    // 访客操作Btn
    visitorBtn = (value, key, item) => {
        return <Button onClick={() => this.visitorClk(value)} type="secondary">查看</Button>
    }

    // 查看家庭成员
    menberClk = (value) => {
        this.setState({
            addressId: value,
            menberDialogVisible: true
        })
    }

    // 关闭查看家庭成员弹窗
    menberDialogClose = () => {
        this.setState({
            addressId: null,
            menberDialogVisible: false
        })
    }

    // 查看访客记录
    visitorClk = (value) => {
        const data = {
            addressId: value
        }
        AxiosList.toVisitorData(data, this.props.history).then((res) => {
            const { data = {} } = res;
            const arr = data.content || [];
            const visitRecordState = JSON.parse(window.localStorage.getItem('visitor_visit_record_state')) || [];
            Dialog.show({
                title: '访客记录',
                content: <div className="menberCardDialog">
                    {
                        arr.length > 0 ?
                            arr.map((item) => {
                                return (
                                    <div key={item.id} className="menberCard">
                                        <div className="card-img">
                                            <img src={require('../../img/menberIcon.png')} alt="" />
                                        </div>
                                        <div className="card-cnt">
                                            <div className="cntItem-top">
                                                <div className="cntItem-top-item">
                                                    <span>姓名：</span>
                                                    <span>{item.visitorName}</span>
                                                </div>
                                                <div className="cntItem-top-item">
                                                    <span>电话：</span>
                                                    <span>{item.visitorPhone}</span>
                                                </div>
                                                <div className="cntItem-top-item">
                                                    <span>访问时间：</span>
                                                    <span>{item.visitStartDate}</span>
                                                </div>
                                            </div>
                                            <div className="cntItem-bottom">
                                                {
                                                    item.visitorIdCardNo ?
                                                        <div className="cntItem-top-item">
                                                            <span>身份证号：</span>
                                                            <span>{item.visitorIdCardNo}</span>
                                                        </div>
                                                        :
                                                        <div />
                                                }
                                                <div>
                                                    {fun.returnValue(item.state, visitRecordState)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                            :
                            <div className="no-data">无访客记录</div>
                    }

                </div>
                ,
                footer: false
            });
        })
    }


    // 分页选择
    pageChange = (value) => {
        this.setState({
            page: value,
        }, () => {
            this.ownerInfoList();
        })
    }

    // 选择上传文件
    fileSelect = (value) => {
        importsExcel(value).then((res) => {
            console.log(res)
        })
    }

    // 操作
    operation = (value, key, item) => {
        return <Button onClick={() => this.editClick(item)} type="primary">编辑</Button>
    }

    // 编辑业主信息
    editClick = (item) => {
        this.setState({
            editOwnerFormData: item,
            addOwnerVisible: true
        })

    }

    editOwnerSub = (value) => {
        AxiosList.editOwner(value, this.props.history)
    }

    // 刷脸凭证渲染
    imgRender = (value, bol, item) => {
        return <div className="imgRender">
            <div onClick={() => this.imgView(item)} >
                查看凭证
            </div>
        </div>
    }

    imgView = (item, bol) => {
        if (bol) {
            AxiosList.viewMenberImg(item, this.props.history).then((res) => {
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
        } else {
            const data = {
                name: item.ownerName,
                phone: item.ownerPhone
            }
            AxiosList.viewOwnerImg(data, this.props.history).then((res) => {
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
    }

    render() {
        const { addOwnerVisible, page, size, total, tableList = [], editOwnerFormData, menberDialogVisible, addressId, viewImg, imgVisible } = this.state;
        const addressType = JSON.parse(window.localStorage.getItem('visitor_address_type')) || [];
        const typeRender = (value) => {
            return <span>{fun.returnValue(value, addressType)}</span>
        }
        return (
            <div className="ownerInfo">
                <div className="ownerInfo-header">
                    <div className="blue-div" />
                    <div className="header-text">业主信息</div>
                </div>

                {/* {查询表单} */}
                <Form className="ownerInfo-form" inline>
                    <FormItem label="业主姓名">
                        <Input name="ownerName" style={{ width: 248 }} placeholder="" />
                    </FormItem>
                    <FormItem label="业主电话">
                        <Input name="ownerPhone" style={{ width: 248 }} placeholder="" />
                    </FormItem>
                    <FormItem label="类型">
                        <Select
                            name="type"
                            defaultValue={0}
                            dataSource={[
                                { value: 0, label: '全部' },
                                ...addressType,
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
                    <Button onClick={this.addOwner} type="primary">添加业主信息</Button>
                    <Button className="btn-item btn-item-right" type="primary">
                        <span>导入业主信息</span>
                        <input type="file" onChange={this.fileSelect} />
                    </Button>

                </div>
                {/* {访客信息表格} */}
                <Table
                    hasBorder={false}
                    className="table"
                    dataSource={tableList}
                >
                    <Table.Column title="序号" dataIndex="id" />
                    <Table.Column title="业主姓名" dataIndex="ownerName" />
                    <Table.Column title="业主电话" dataIndex="ownerPhone" />
                    <Table.Column title="身份证号码" dataIndex="ownerIdCardNo" />
                    <Table.Column title="住址信息" dataIndex="address" />
                    <Table.Column title="刷脸凭证" cell={this.imgRender} />
                    <Table.Column title="类型" cell={typeRender} dataIndex="type" />
                    <Table.Column title="家庭成员" cell={this.menberBtn} dataIndex="id" />
                    <Table.Column title="访客记录" cell={this.visitorBtn} dataIndex="id" />
                    <Table.Column title="操作" cell={this.operation} />
                </Table>
                <Pagination totalRender={total => `总数: ${total} `} pageSize={size} current={page} total={total} shape="arrow-only" showJump={false} onChange={this.pageChange} className="page" />
                <AddOwnerDialog editFormData={editOwnerFormData} updataList={this.ownerInfoList} history={this.props.history} addOwnerVisible={addOwnerVisible} addOwnerClose={this.addOwnerClose} />
                <MenberDialog viewImg={(item) => {this.imgView(item, true)}} addressId={addressId} history={this.props.history} visible={menberDialogVisible} onClose={this.menberDialogClose} />
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

export default OwnerInfo;
