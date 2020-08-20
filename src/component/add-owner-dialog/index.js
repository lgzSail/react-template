import React from 'react';
import { Form, Input, Select, Dialog, Message, Button } from '@alifd/next';
import fun from '../../unil';
import AxiosList from '../../require/require';
import './index.scss';

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        fixedSpan: 10
    },
    wrapperCol: {
        span: 12
    }
};


class AddOwner extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            addAddressNum: 0,
            formData: {
                type: 2
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const { editFormData = {} } = nextProps
        const data = JSON.parse(JSON.stringify(editFormData));
        this.setState({
            formData: data
        }, () => {
            const { formData = {} } = this.state;
            if (formData.type === 1) {
                const data = {
                    addressId: formData.id
                }
                console.log(123)
                AxiosList.toMenberData(data, this.props.history).then((res) => {
                    const { data = {} } = res;
                    const { content = [] } = data;
                    if (content.length > 1) {

                    }
                })
            }
        });
    }

    // 添加地址信息
    addAddress = () => {
        let { addAddressNum } = this.state;
        addAddressNum = addAddressNum + 1;
        this.setState({
            addAddressNum
        });
    }

    // 删除地址信息
    deleteAddress = (key) => {
        let { addAddressNum } = this.state;
        addAddressNum = addAddressNum - 1;
        this.setState({
            addAddressNum
        });
    }

    // 添加业主
    createOwner = (value, error) => {
        if (error) return null;
        const { formData = {} } = this.state;
        const { editFormData } = this.props;
        if (fun.test('phone', formData.ownerPhone)) {
            Message.error('手机格式有误');
            return null;
        } else if (formData.ownerIdCardNo && fun.test('cardNo', formData.ownerIdCardNo)) {
            Message.error('身份证格式有误');
            return null;
        }
        if (editFormData) {
            this.editOwnerFun();
        } else {
            this.createOwnerFun();
        }
    }

    // 编辑接口调用
    editOwnerFun = () => {
        const data = this.state.formData;
        data.address = {
            address: data.address,
            ownerIdCardNo: data.ownerIdCardNo,
            ownerName: data.ownerName,
            ownerPhone: data.ownerPhone,
            type: data.type,
        }
        AxiosList.editOwner(data, this.props.history).then((res) => {
            this.setState({
                formData: {},
                addAddressNum: 0
            }, () => {
                this.props.updataList(undefined, true);
                this.props.addOwnerClose();
            })
        })
    }

    // 创建接口调用
    createOwnerFun = () => {
        const { formData, addAddressNum } = this.state;
        const data = {};
        data.address = {
            address: formData.address,
            ownerIdCardNo: formData.ownerIdCardNo,
            ownerName: formData.ownerName,
            ownerPhone: formData.ownerPhone,
            type: formData.type,
        }
        if (formData.type === 1 && addAddressNum > 0) {
            const arr = [];
            for (let i = 0; i < addAddressNum; i++) {
                if (fun.test('phone', formData[`phone${i}`])) {
                    Message.error('手机格式有误');
                    return null;
                }
                let obj = {
                    idCardNo: formData[`idCardNo${i}`],
                    name: formData[`name${i}`],
                    phone: formData[`phone${i}`],
                    type: formData[`type${i}`],
                };

                arr.push(obj);
            }
            data.familyMemberList = arr;
        }
        AxiosList.createOwner(data, this.props.history).then((res) => {
            this.setState({
                formData: {},
                addAddressNum: 0
            }, () => {
                this.props.updataList(undefined, true);
                this.props.addOwnerClose();
            })
        })
    }

    render() {
        const { formData = {} } = this.state;
        let { addAddressNum } = this.state;
        const { addOwnerVisible, editFormData } = this.props;
        const { type = 2 } = formData;
        if (type === 2) {
            addAddressNum = 0
        };
        const arr = fun.createArr(addAddressNum);
        const addressType = JSON.parse(window.localStorage.getItem('address_type')) || [];
        const familyMemberType = JSON.parse(window.localStorage.getItem('sys_owner_family_member_type')) || [];
        const familyMemberTypeArr = fun.deleteType(familyMemberType);
        return (
            <Dialog
                title={editFormData ? '编辑帐号' : '创建帐号'}
                className='addOwner-dialog'
                footerAlign='center'
                visible={addOwnerVisible}
                footer={false}
                onClose={() => {
                    this.setState({
                        formData: {},
                        addAddressNum: 0
                    }, () => {
                        this.props.addOwnerClose()
                    })
                }}
            >
                <div className='addOwner-dialog-body'>
                    <div className="addOwner-header">
                        <div className="ownerInfo-header">
                            <div className="blue-div" />
                            <div className="header-text">业主信息</div>
                        </div>
                        {
                            type === 1 && !editFormData ?
                                <div onClick={this.addAddress} className="add-Cnt">
                                    <img className="icon-add" alt=" " src={require('../../img/add.png')} />
                                    <span>添加家庭成员</span>
                                </div>
                                :
                                null
                        }

                    </div>
                    <Form
                        onChange={
                            (value) => {
                                value.ownerPhone = value.ownerPhone && value.ownerPhone.replace(/[^\d]/g, '');
                                this.setState({ formData: value })
                            }
                        }
                        value={formData}
                        className="addOwner-form"
                        {...formItemLayout}
                    >
                        <FormItem requiredMessage="该字段不可为空" required label="业主姓名">
                            <Input name="ownerName" style={{ width: 340 }} placeholder="" />
                        </FormItem>
                        <FormItem requiredMessage="该字段不可为空" required label="业主电话">
                            <Input maxLength={11} name="ownerPhone" style={{ width: 340 }} placeholder="" />
                        </FormItem>
                        <FormItem label="身份证号码">
                            <Input maxLength={18} name="ownerIdCardNo" style={{ width: 340 }} placeholder="" />
                        </FormItem>
                        <FormItem requiredMessage="该字段不可为空" required label="类型">
                            <Select
                                name="type"
                                value={type}
                                disabled={editFormData ? true : false}
                                dataSource={addressType}
                            />
                        </FormItem>
                        <FormItem requiredMessage="该字段不可为空" required label="地址信息">
                            <Input.TextArea name="address" style={{ width: 340 }} placeholder="" />
                        </FormItem>
                        {arr.map((item, index) => {
                            return (
                                <div key={index} className="addOwner-top">
                                    <div key={index} className="addOwner-header">
                                        <div className="ownerInfo-header">
                                            <div className="blue-div" />
                                            <div className="header-text">家庭成员信息</div>
                                        </div>
                                        <div onClick={() => this.deleteAddress(index)} className="add-Cnt">
                                            <img className="icon-add" alt=" " src={require('../../img/delete.png')} />
                                            <span>删除</span>
                                        </div>
                                    </div>
                                    <div className="address-item">
                                        <FormItem requiredMessage="该字段不可为空" required label="成员姓名">
                                            <Input name={`name${index}`} style={{ width: 340 }} placeholder="" />
                                        </FormItem>
                                        <FormItem requiredMessage="该字段不可为空" required label="电话">
                                            <Input maxLength={11} name={`phone${index}`} style={{ width: 340 }} placeholder="" />
                                        </FormItem>
                                        <FormItem requiredMessage="该字段不可为空" label="身份证号">
                                            <Input maxLength={18} name={`idCardNo${index}`} style={{ width: 340 }} placeholder="" />
                                        </FormItem>
                                        <FormItem requiredMessage="该字段不可为空" required label="类型">
                                            <Select
                                                name={`type${index}`}
                                                dataSource={familyMemberTypeArr}
                                            />
               
                                        </FormItem>
                                    </div>
                                </div>);
                        })}
                        <FormItem wrapperCol={{ offset: 8 }} >
                            <Form.Submit onClick={this.createOwner} validate type="primary">提交</Form.Submit>
                            <Button
                                className="cancel"
                                onClick={() => {
                                    this.setState({
                                        formData: {},
                                        addAddressNum: 0
                                    }, () => {
                                        this.props.addOwnerClose()
                                    })
                                }}>取消</Button>
                        </FormItem>
                    </Form>
                </div>
            </Dialog>
        )
    }
}

export default AddOwner;
