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


class CreateAppletImg extends React.Component {
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
        formData.picture = previewUrl
        this.setState({
            formData
        });
    }

    // 创建头图
    createApplet = (value, error) => {
        if (error) return null;
        let { formData } = this.state;
        if (this.props.formData) {
            AxiosList.editApplet(formData, this.props.history,).then((res) => {
                this.props.onClose();
                this.props.uploadData();
            })
        } else {
            formData.type = 1;
            formData.state = 1;
            AxiosList.createApplet(formData, this.props.history).then((res) => {
                this.props.onClose();
                this.props.uploadData();
            })
        }
    }

    // 关闭弹窗
    closeDialog = () => {
        this.setState({
            uploadImgVisible: false,
            uploadImg: undefined,
            formData: {}
        }, () => {
            this.props.onClose();
        })
    }

    render() {
        const { formData } = this.state;
        const { picture } = formData;
        const { visible } = this.props;
        console.log(picture)
        return (
            <Dialog
                title="新建头图"
                footer={false}
                visible={visible}
                onClose={this.closeDialog}
            >
                <Form
                    value={formData}
                    className="addImg"
                    onChange={(value) => this.setState({ formData: value })}
                    {...formItemLayout}
                >
                    <FormItem requiredMessage="该字段不可为空" required label="头图名称">
                        <Input name="description" style={{ width: 400 }} placeholder="" />
                    </FormItem>
                    <FormItem label="头图图片">
                        <Upload
                            action="//jh.upk.net:12080/sys/file"
                            method="post"
                            accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
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
                                    picture ?
                                        <img className="upImg-icon" src={picture} alt="" />
                                        : null
                                }
                                <span>
                                    {
                                        picture ?
                                            '重新上传'
                                            :
                                            '点击上传图片'
                                    }
                                </span>
                            </div>
                        </Upload>
                        <FormItem className="dialog-footer" wrapperCol={{ offset: 8 }} >
                            <Form.Submit onClick={this.createApplet} validate type="primary">提交</Form.Submit>
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

export default CreateAppletImg;
