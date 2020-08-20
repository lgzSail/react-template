import React from 'react';
import { Form, Input, Dialog, Button, Upload } from '@alifd/next';
import AxiosList from '../../require/require';
import './index.scss';

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        fixedSpan: 8
    },
    wrapperCol: {
        span: 12
    }
};


class EditEntConfigDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            formData: {
            }
        }
    }

    componentWillReceiveProps(next) {
        const { formData = {} } = next
        const data = JSON.parse(JSON.stringify(formData));
        this.setState({
            formData: data,
        })
    }

    // 上传图片
    uploadImgSuccess = (res) => {
        const { response = {} } = res;
        const { data = {} } = response;
        const { previewUrl } = data;
        const { formData } = this.state;
        formData.icon = previewUrl
        this.setState({
            formData
        });
    }

    // 编辑提交
    edit = (value, error) => {
        if (error) return null;
        const { formData } = this.state;
        AxiosList.editEntConfig(formData, this.props.history).then((res) => {
            this.props.onClose();
            this.props.uploadData();
        })
    }

    // 关闭弹窗
    closeDialog = () => {
        this.setState({
            uploadImgVisible: false, uploadImg: undefined
        }, () => {
            this.props.onClose();
        })
    }

    render() {
        const { formData } = this.state;
        const { icon } = formData;
        const { visible } = this.props;
        return (
            <Dialog
                title="编辑入口"
                footer={false}
                visible={visible}
                onClose={this.closeDialog}
            >
                <Form
                    value={formData}
                    className="EditEntConfigDialog"
                    onChange={(value) => this.setState({ formData: value })}
                    {...formItemLayout}
                >
                    <FormItem label="入口名称">
                        <Input required name="name" style={{ width: 400 }} placeholder="" />
                    </FormItem>
                    <FormItem label="排序">
                        <Input required name="sort" style={{ width: 50 }} placeholder="" />
                    </FormItem>
                    <FormItem label="入口图标">
                        <Upload
                            accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                            action="//jh.upk.net:12080/sys/file"
                            method="post"
                            data={{
                                typeKey: 'visitor'
                            }}
                            headers={{
                                'Auth-Token': window.localStorage.getItem('token')
                            }}
                            onSuccess={this.uploadImgSuccess}
                        >
                            <div className="upImg">
                                {
                                    icon ?
                                        <img className="icon" src={icon} alt="" />
                                        : null
                                }
                                <span>
                                    {
                                        icon ?
                                            '重新上传'
                                            :
                                            '点击上传图片'
                                    }
                                </span>
                            </div>
                        </Upload>
                        <FormItem className="dialog-footer" wrapperCol={{ offset: 8 }} >
                            <Form.Submit onClick={this.edit} validate type="primary">提交</Form.Submit>
                            <Button
                                className="cancel"
                                onClick={this.closeDialog}>取消</Button>
                        </FormItem>
                    </FormItem>
                </Form>
            </Dialog>
        )
    }
}

export default EditEntConfigDialog;
