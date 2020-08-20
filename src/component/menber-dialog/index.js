import React from 'react';
import { Input, Dialog, Button, Select, Message } from '@alifd/next';
import AxiosList from '../../require/require';
import fun from '../../unil';
import './index.scss';




class MenberDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            formData: {
                name: null,
                phone: null,
                type: null,
            }
        }
    }

    componentWillReceiveProps(next) {
        if (next.addressId) {
            this.setState({
                addressId: next.addressId
            }, () => {
                this.viewMenber();
            })
        }
    }

    // 查看家庭成员
    viewMenber = () => {
        const { addressId } = this.state;
        const data = {
            addressId
        }
        AxiosList.toMenberData(data, this.props.history).then((res) => {
            const { data = {} } = res;
            const newMenberList = this.sortList(data.content)

            this.setState({
                menberList: newMenberList
            })
        })
    }

    // 删除家庭成员
    deleteMenber = (addressId, id) => {
        console.log(1)
        Dialog.show({
            title: '删除家庭成员',
            content: <div style={{ minWidth: 180 }}>
                是否删除该成员？
            </div>,
            onOk: () => this.deleteMenberOk(addressId, id)
        })
    }

    deleteMenberOk = (addressId, id) => {
        const data = {
            addressId,
            id
        }
        AxiosList.deleteMenber(data, this.props.history).then((res) => {
            this.viewMenber();
        })
    }

    // 添加家庭成员
    addMenber = () => {
        const { menberList } = this.state;
        menberList.unshift({
            add: true
        });
        this.setState({
            menberList
        })
    }

    // 调用添加成员接口
    addMenberAjax = (index) => {
        const { formData = {}, addressId } = this.state;
        const form = {
            name: formData[`name${index}`],
            phone: formData[`phone${index}`],
            idCardNo: formData[`idCardNo${index}`],
            type: formData[`type${index}`]
        }
        if (!this.testNull(form)) return null;
        if (form.idCardNo && form.idCardNo.length === 0) {
            form.idCardNo = undefined;
        }

        const data = {
            addressId,
            data: form
        }

        AxiosList.addMenber(data, this.props.history).then((res) => {
            formData[`name${index}`] = undefined;
            formData[`phone${index}`] = undefined;
            formData[`idCardNo${index}`] = undefined;
            formData[`type${index}`] = undefined;
            this.setState({
                formData
            }, () => {
                this.viewMenber();
            })

        })
    }

    // 为空校验
    testNull = (obj) => {
        console.log(obj)
        for (const item in obj) {
            if (!obj[item] && item !== 'idCardNo') {
                Message.error('输入框不能为空。');
                return false;
            }
        }
        return true;
    }

    // 编辑成员
    editMenber = (index, id) => {
        const { menberList, editObj = {} } = this.state;
        editObj[id] = true
        const item = menberList[index];
        let { formData } = this.state;
        formData[`id${id}`] = item.id;
        formData[`name${id}`] = item.name;
        formData[`phone${id}`] = item.phone;
        formData[`idCardNo${id}`] = item.idCardNo;
        formData[`type${id}`] = item.type;
        console.log(editObj)
        this.setState({
            menberList,
            formData,
            editObj
        })
    }

    // 编辑成员ajax
    editMenberAjax = (id) => {
        const { addressId, formData, editObj } = this.state;
        const form = {
            id: formData[`id${id}`],
            name: formData[`name${id}`],
            phone: formData[`phone${id}`],
            idCardNo: formData[`idCardNo${id}`],
            type: formData[`type${id}`]
        }
        form.addressId = addressId;
        AxiosList.editMenber(form, this.props.history).then((res) => {
            formData[`name${id}`] = undefined;
            formData[`phone${id}`] = undefined;
            formData[`idCardNo${id}`] = undefined;
            formData[`type${id}`] = undefined;
            editObj[id] = false;
            this.setState({
                formData,
                editObj
            }, () => {
                this.viewMenber();
            })
        })
    }

    // 排序
    sortList = (arr = []) => {
        const clone = JSON.parse(JSON.stringify(arr));
        const newArr = [];
        clone.map(item => {
            if (item.type === 1) {
                newArr.unshift(item)
            } else {
                newArr.push(item)
            }
            return null;
        })
        return newArr;
    }

    render() {
        const { visible } = this.props;
        const { menberList = [], addressId, editObj = {} } = this.state;
        let { formData = {} } = this.state;
        const familyMemberType = JSON.parse(window.localStorage.getItem('sys_owner_family_member_type')) || [];
        const familyMemberTypeArr = fun.deleteType(familyMemberType);
        return (
            <Dialog
                title="查看家庭成员"
                footer={false}
                visible={visible}
                onClose={() => {
                    this.setState({
                        editObj: {}
                    }, () => {
                        this.props.onClose()
                    })
                }}
            >
                <div className="menberCardDialog">
                    <div className="btn-cnt">
                        <Button onClick={this.addMenber} type="secondary">添加</Button>
                    </div>
                    {
                        menberList.length > 0 ?
                            menberList.map((item, index) => {
                                if (editObj[item.id] || item.add) {
                                    return (
                                        <div key={index} className="menberCard-cnt menberCard-edit">
                                            <div className="card-img">
                                                <img src={require('../../img/menberIcon.png')} alt="" />
                                            </div>
                                            <div className="card-cnt">
                                                <div className="cntItem-top">
                                                    <div className="cntItem-top-item">
                                                        <span>姓名：</span>
                                                        <Input
                                                            value={formData[`name${item.id}`] || undefined}
                                                            onChange={value => {
                                                                formData[`name${item.id}`] = value
                                                                this.setState({ formData })
                                                            }}
                                                            style={{ width: 100 }}
                                                        />
                                                    </div>
                                                    <div className="cntItem-top-item">
                                                        <span>电话：</span>
                                                        <Input
                                                            value={formData[`phone${item.id}`] || undefined}
                                                            maxLength={11}
                                                            onChange={value => {
                                                                formData[`phone${item.id}`] = value
                                                                this.setState({ formData })
                                                            }}
                                                            style={{ width: 180 }}
                                                        />
                                                    </div>
                                                    <div className="cntItem-top-item">
                                                        <span>添加时间：</span>
                                                        <span>{item.createDate}</span>
                                                    </div>
                                                </div>
                                                <div className="cntItem-bottom">
                                                    <div className="cntItem-top-item">
                                                        <span>身份证号：</span>
                                                        <Input
                                                            maxLength={18}
                                                            value={formData[`idCardNo${item.id}`] || undefined}
                                                            onChange={value => {
                                                                formData[`idCardNo${item.id}`] = value
                                                                this.setState({ formData })
                                                            }}
                                                            style={{ width: 180 }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <span>类型：</span>
                                                        <Select
                                                            value={formData[`type${item.id}`] || undefined}
                                                            onChange={value => {
                                                                formData[`type${item.id}`] = value
                                                                this.setState({ formData })
                                                            }}
                                                            dataSource={familyMemberTypeArr}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="btn-icon">
                                                <div className="brnCur" onClick={item.add ? () => this.addMenberAjax(item.id) : () => this.editMenberAjax(item.id)}>
                                                    <img className="icon" src={require('../../img/editIcon.png')} alt="" />
                                                    <span>保存</span>
                                                </div>
                                                <div
                                                    className="brnCur"
                                                    onClick={() => {
                                                        formData[`name${item.id}`] = undefined;
                                                        formData[`phone${item.id}`] = undefined;
                                                        formData[`idCardNo${item.id}`] = undefined;
                                                        formData[`type${item.id}`] = undefined;
                                                        if (item.add) {
                                                            menberList.splice(index, 1);
                                                        } else {
                                                            editObj[item.id] = false
                                                        }
                                                        this.setState({
                                                            formData,
                                                            menberList,
                                                            editObj
                                                        })
                                                    }}>
                                                    <img className="icon-bottom" src={require('../../img/deleteIcon.png')} alt="" />
                                                    <span>取消</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={index} className="menberCard-cnt">
                                            <div className="card-img">
                                                <img src={require('../../img/menberIcon.png')} alt="" />
                                            </div>
                                            <div className="card-cnt">
                                                <div className="cntItem-top">
                                                    <div className="cntItem-top-item">
                                                        <span>姓名：</span>
                                                        <span>{item.name}</span>
                                                    </div>
                                                    <div className="cntItem-top-item">
                                                        <span>电话：</span>
                                                        <span>{item.phone}</span>
                                                    </div>
                                                    <div className="cntItem-top-item">
                                                        <span>添加时间：</span>
                                                        <span>{item.createDate}</span>
                                                    </div>
                                                </div>
                                                <div className="cntItem-bottom">
                                                    {
                                                        item.idCardNo ?
                                                            <div className="cntItem-top-item">
                                                                <span>身份证号：</span>
                                                                <span>{item.idCardNo}</span>
                                                            </div>
                                                            :
                                                            <div />
                                                    }
                                                    <div style={{ cursor: 'pointer' }}>
                                                        查看凭证
                                                    </div>
                                                    <div>
                                                        {fun.returnValue(item.type, familyMemberType)}
                                                    </div>
                                                </div>

                                            </div>
                                            {
                                                item.type !== 1 ?
                                                    <div className="btn-icon">
                                                        <div className="brnCur" onClick={() => this.editMenber(index, item.id)}>
                                                            <img className="icon" src={require('../../img/editIcon.png')} alt="" />
                                                            <span>编辑</span>
                                                        </div>
                                                        <div className="brnCur" onClick={() => this.deleteMenber(addressId, item.id)} >
                                                            <img className="icon-bottom" src={require('../../img/deleteIcon.png')} alt="" />
                                                            <span>删除</span>
                                                        </div>
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </div>

                                    );
                                }
                            })
                            :
                            <div className="no-data"> 无记录</div>
                    }

                </div>
            </Dialog>
        )
    }
}

export default MenberDialog;
