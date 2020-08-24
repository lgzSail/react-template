import React from 'react';
import { Table, Pagination, Button, Switch } from '@alifd/next';
import AxiosList from '../../require/require';
import EditEntConfigDialog from '../../component/edit-ent-config-dialog';
import './index.scss';
import fun from '../../unil';


class EntranceConfig extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            size: 10,
            page: 1
        }
    }
    componentDidMount() {
        this.entConfigList();
    }

    // 获取列表接口调用
    entConfigList = (query, bol) => {
        const { size, page } = this.state;
        const data = {
            size,
            page,
            ...query
        };
        AxiosList.entConfigList(data, this.props.history, bol).then((res) => {
            const { data = {} } = res;
            this.setState({
                total: data.totalElements,
                tableList: data.content
            });
        })
    }

    // 操作项渲染
    operation = (value, bol, item) => {
        return <Button type="secondary" onClick={() => this.editConfigImg(item)} className="font-color-blue">编辑</Button>
    }

    // 编辑入口
    editConfigImg = (item) => {
        this.setState({
            EditEntConfigData: item,
            EditEntConfigVisible: true
        })
    }

    // 关闭编辑弹窗
    EditEntConfigClose = () => {
        this.setState({
            EditEntConfigVisible: false
        })
    }

    // 状态渲染
    imgType = (value, index, item) => {
        // console.log(record)
        return <Switch
            checked={value === 1}
            size="small"
            onChange={(bol) => this.imgTypeChange(bol, item.id)}
        />
    }

    // 状态改变
    imgTypeChange = (bol, id) => {
        console.log(bol, id)
        const arr = [];
        arr.push(id);
        if (bol) {
            AxiosList.stateEntConfig(arr, this.props.history).then(() => {
                this.entConfigList(null, true);
            })
        } else {
            AxiosList.stopEntConfig(arr, this.props.history).then(() => {
                this.entConfigList(null, true);
            })
        }
    }

    // 分页选择
    pageChange = (value) => {
        this.setState({
            page: value,
        }, () => {
            this.entConfigList();
        })
    }

    // 图标渲染
    imgRender = (value) => {
        return <div>
            <img className="icon-img-size" src={value} alt="" />
        </div>
    }

    render() {
        const { page, size, total, tableList = [], EditEntConfigVisible, EditEntConfigData } = this.state;
        const typeDataSoure = JSON.parse(window.localStorage.getItem('visitor_app_agent_type'))
        const typeRender = (value) => {
            return <span>{fun.returnValue(value, typeDataSoure)}</span>
        }
        return (
            <div className="EntranceConfig">
                <div className="EntranceConfig-header">
                    <div className="blue-div" />
                    <div className="header-text">入口配置</div>
                </div>

                {/* {入口配置表格} */}
                <Table
                    className="table"
                    hasBorder={false}
                    dataSource={tableList}
                >
                    <Table.Column title="序号" dataIndex="id" />
                    <Table.Column title="排序" dataIndex="sort" />
                    <Table.Column cell={typeRender} title="类型" dataIndex="type" />
                    <Table.Column title="入口名称" dataIndex="name" />
                    <Table.Column title="入口图标" cell={this.imgRender} dataIndex="icon" />
                    <Table.Column title="状态" cell={this.imgType} dataIndex="state" />
                    <Table.Column title="操作" cell={this.operation} />
                </Table>
                <Pagination totalRender={total => `总数: ${total} `} pageSize={size} current={page} total={total} shape="arrow-only" showJump={false} onChange={this.pageChange} className="page" />
                <EditEntConfigDialog formData={EditEntConfigData} history={this.props.history} visible={EditEntConfigVisible} uploadData={() => this.entConfigList(null, true)} onClose={this.EditEntConfigClose} />
            </div>
        )
    }
}

export default EntranceConfig;
