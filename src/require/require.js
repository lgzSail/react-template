import axios from 'axios';
import { Message } from '@alifd/next';

// axios 外围封装
function fun(obj, pushFun, messegeBol) {
    return new Promise((reslove, reject) => {
        axios(obj).then((res) => {
            const { data } = res;
            if (data.status === 401) {
                Message.error(data.info);
                pushFun.push('/login');
            } else if (data.status === 200) {
                if (!messegeBol) {
                    Message.success(data.info)
                }
                reslove(data);
            } else {
                Message.error(data.info)
            }
        }).catch((res) => {
            console.log(res)
            Message.error('系统错误')
        })
    })
}

// get url拼接
function cancatStr(obj) {
    let str = '';
    for (const key in obj) {
        if (!obj[key]) continue;
        if (key === 'page') {
            str += `page=${obj[key] - 1}&`
        } else if (key === 'type' || key === 'state') {
            if (obj[key] > 0) {
                str += `${key}=${obj[key]}&`
            }
        } else {
            str += `${key}=${obj[key]}&`
        }
    }
    return str.slice(0, str.length - 1);
}

// 接口
const AxiosList = {
    // 字典配置
    dataList: () => {
        const obj = {
            method: 'get',
            url: '//jh.upk.net:12080/sys/dictionary',
        }
        return axios(obj)
    },
    // 获取md5
    getMd5: () => {
        const obj = {
            method: 'get',
            url: '//jh.upk.net:12080/sys/dictionary/md5',
        }
        return axios(obj)
    },
    // 帐号密码登录
    login: (data) => {
        const obj = {
            method: 'post',
            url: '//jh.upk.net:12080/user/login/admin',
            data,
        }
        return axios(obj)
    },
    // 手机验证码登录
    phoneLogin: (data) => {
        const obj = {
            method: 'post',
            url: `//jh.upk.net:12080/user/login/admin/phone/${data.phone}/code/${data.code}`,
            data
        }
        return axios(obj)
    },
    // 获取手机验证码
    getCode: (data) => {
        const obj = {
            method: 'post',
            url: `//jh.upk.net:12080/user/login/admin/phone/${data.phone}/code`,
            data
        }
        return axios(obj)
    },
    // 退出登录
    loginOut: () => {
        const obj = {
            method: 'get',
            url: '//jh.upk.net:12080/user/logout',
        }
        return axios(obj)
    },
    // 获取访客信息
    getVisitorList: (data, pushFun) => {
        data.state = 1;
        const str = cancatStr(data);
        const obj = {
            method: 'get',
            url: `//jh.upk.net:12080/sys/visitor?${str}&sort=asc`,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token')
            }
        }
        return fun(obj, pushFun)
    },
    // 获取访客黑名单列表
    visitorsBlock: (data, pushFun) => {
        data.state = 2;
        const str = cancatStr(data);
        const obj = {
            method: 'get',
            url: `//jh.upk.net:12080/sys/visitor?${str}&sort=asc`,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token')
            }
        }
        return fun(obj, pushFun)
    },
    // 添加访客黑名单
    addBlack: (data, pushFun) => {
        const obj = {
            method: 'put',
            url: `//jh.upk.net:12080/sys/visitor/add/black`,
            data,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token'),
                'content-type': 'application/json'
            }
        }
        return fun(obj, pushFun)
    },
    // 移除访客黑名单
    removeBlack: (data, pushFun) => {
        const obj = {
            method: 'put',
            url: `//jh.upk.net:12080/sys/visitor/${data}/remove/black`,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token'),
            }
        }
        return fun(obj, pushFun)
    },
    // 获取业主信息列表
    ownerInfoList: (data, pushFun, messegeBol) => {
        const str = cancatStr(data);
        const obj = {
            method: 'get',
            url: `//jh.upk.net:12080/sys/owner/address?${str}&sort=asc`,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token')
            }
        }
        return fun(obj, pushFun, messegeBol)
    },
    // 获取访客记录列表
    visitorsRecord: (data, pushFun) => {
        const str = cancatStr(data);
        const obj = {
            method: 'get',
            url: `//jh.upk.net:12080/sys/visit/record?${str}&sort=asc`,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token')
            }
        }
        return fun(obj, pushFun)
    },
    // 活动人员帐号列表
    userAdmin: (data, pushFun, bol) => {
        const str = cancatStr(data);
        const obj = {
            method: 'get',
            url: `//jh.upk.net:12080/user/admin?${str}`,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token')
            }
        }
        return fun(obj, pushFun, bol)
    },
    // 获取访客记录
    toVisitorData: (data, pushFun) => {
        const obj = {
            method: 'get',
            url: `//jh.upk.net:12080/sys/visit/address/${data.addressId}/record`,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token')
            }
        }
        return fun(obj, pushFun)
    },
    // 获取家庭成员
    toMenberData: (data, pushFun) => {
        const obj = {
            method: 'get',
            url: `//jh.upk.net:12080/sys/owner/address/${data.addressId}/family/member`,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token')
            }
        }
        return fun(obj, pushFun)
    },
    // 添加业主
    createOwner: (data, pushFun) => {
        const obj = {
            method: 'post',
            url: `//jh.upk.net:12080/sys/owner/address`,
            data,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token')
            }
        }
        return fun(obj, pushFun)
    },
    // 编辑业主信息
    editOwner: (data, pushFun) => {
        const obj = {
            method: 'put',
            url: `//jh.upk.net:12080/sys/owner/address/${data.id}`,
            data: {
                address: data.address
            },
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token')
            }
        }
        return fun(obj, pushFun)
    },
    // 获取系统配置
    getSysConfig: (pushFun, bol) => {
        const obj = {
            method: 'get',
            url: `//jh.upk.net:12080/sys/config`,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token')
            }
        }
        return fun(obj, pushFun, bol)
    },
    // 修改系统配置
    setSysConfig: (data, pushFun) => {
        const obj = {
            method: 'put',
            url: `//jh.upk.net:12080/sys/config`,
            data,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token')
            }
        }
        return fun(obj, pushFun)
    },
    // 获取系统配置
    getConfig: () => {
        const obj = {
            method: 'get',
            url: `//jh.upk.net:12080/sys/config`,
        }
        return axios(obj);
    },
    // 重置密码
    resetPassword: (data, pushFun) => {
        console.log(data.password)
        const obj = {
            method: 'post',
            url: `//jh.upk.net:12080/user/reset/${data.id}/password`,
            data: data.password,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token'),
                'content-type': 'application/json'
            }
        }
        return fun(obj, pushFun)
    },
    // 创建帐号
    createAdmin: (data, pushFun) => {
        const obj = {
            method: 'post',
            url: `//jh.upk.net:12080/user/create/admin`,
            data,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token')
            }
        }
        return fun(obj, pushFun)
    },
    // 编辑帐号
    editAdmin: (data, pushFun) => {
        const obj = {
            method: 'put',
            url: `//jh.upk.net:12080/user/save/admin/${data.id}`,
            data,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token'),
                'content-type': 'application/json'
            }
        }
        return fun(obj, pushFun)
    },
    // 启用帐号
    stateAdmin: (data, pushFun) => {
        const arr = [];
        arr.push(data);
        const obj = {
            method: 'put',
            url: `//jh.upk.net:12080/user/state/normal`,
            data: arr,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token'),
                'content-type': 'application/json'
            }
        }
        return fun(obj, pushFun)
    },
    // 停用帐号
    stopAdmin: (data, pushFun) => {
        const arr = [];
        arr.push(data);
        const obj = {
            method: 'put',
            url: `//jh.upk.net:12080/user/state/disabled`,
            data: arr,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token'),
                'content-type': 'application/json'
            }
        }
        return fun(obj, pushFun)
    },
    // 登录日志
    loginLog: (data, pushFun) => {
        const str = cancatStr(data);
        const obj = {
            method: 'get',
            url: `//jh.upk.net:12080/sys/log?${str}`,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token')
            }
        }
        return fun(obj, pushFun)
    },
    // 操作日志
    operationLog: (data, pushFun) => {
        const str = cancatStr(data);
        const obj = {
            method: 'get',
            url: `//jh.upk.net:12080/sys/operate/log?${str}`,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token')
            }
        }
        return fun(obj, pushFun)
    },
    // 小程序头图
    appletImg: (data, pushFun, bol) => {
        const str = cancatStr(data);
        const obj = {
            method: 'get',
            url: `//jh.upk.net:12080/carousel/picture?${str}`,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token')
            }
        }
        return fun(obj, pushFun, bol)
    },
    // 启用小程序头图
    stateAppletImg: (data, pushFun) => {
        const obj = {
            method: 'put',
            url: `//jh.upk.net:12080/carousel/picture/state/normal`,
            data,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token'),
                'content-type': 'application/json'
            }
        }
        return fun(obj, pushFun)
    },
     // 停用小程序头图
     stopAppletImg: (data, pushFun) => {
        const obj = {
            method: 'put',
            url: `//jh.upk.net:12080/carousel/picture/state/disabled`,
            data,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token'),
                'content-type': 'application/json'
            }
        }
        return fun(obj, pushFun)
    },
    // 创建小程序头图
    createApplet: (data, pushFun) => {
        console.log(data)
        const obj = {
            method: 'post',
            url: `//jh.upk.net:12080/carousel/picture`,
            data,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token'),
            }
        }
        return fun(obj, pushFun)
    },
    // 编辑小程序头图
    editApplet: (data, pushFun) => {
        const obj = {
            method: 'put',
            url: `//jh.upk.net:12080/carousel/picture/${data.id}`,
            data,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token'),
                'content-type': 'application/json'
            }
        }
        return fun(obj, pushFun)
    },
    // 入口配置列表
    entConfigList: (data, pushFun, bol) => {
        const str = cancatStr(data);
        const obj = {
            method: 'get',
            url: `//jh.upk.net:12080/app/entrance/config?${str}`,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token')
            }
        }
        return fun(obj, pushFun, bol)
    },
    // 启用入口
    stateEntConfig: (data, pushFun) => {
        const obj = {
            method: 'put',
            url: `//jh.upk.net:12080/app/entrance/config/state/normal`,
            data,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token'),
                'content-type': 'application/json'
            }
        }
        return fun(obj, pushFun)
    },
     // 停用入口
     stopEntConfig: (data, pushFun) => {
        const obj = {
            method: 'put',
            url: `//jh.upk.net:12080/app/entrance/config/state/disabled`,
            data,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token'),
                'content-type': 'application/json'
            }
        }
        return fun(obj, pushFun)
    },
    // 编辑入口
    editEntConfig: (data, pushFun) => {
        const obj = {
            method: 'put',
            url: `//jh.upk.net:12080/app/entrance/config/${data.id}`,
            data,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token'),
                'content-type': 'application/json'
            }
        }
        return fun(obj, pushFun)
    },
    // 删除家庭成员
    deleteMenber: (data, pushFun) => {
        const obj = {
            method: 'delete',
            url: `//jh.upk.net:12080/sys/owner/address/${data.addressId}/family/member/${data.id}`,
            data,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token'),
                'content-type': 'application/json'
            }
        }
        return fun(obj, pushFun)
    },
    // 添加家庭成员
    addMenber: (data, pushFun) => {
        const obj = {
            method: 'post',
            url: `//jh.upk.net:12080/sys/owner/address/${data.addressId}/family/member`,
            data: data.data,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token'),
                'content-type': 'application/json'
            }
        }
        return fun(obj, pushFun)
    },
    // 编辑家庭成员
    editMenber: (data, pushFun) => {
        const obj = {
            method: 'put',
            url: `//jh.upk.net:12080/sys/owner/address/${data.addressId}/family/member/${data.id}`,
            data,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token'),
                'content-type': 'application/json'
            }
        }
        return fun(obj, pushFun)
    },
    // 查看用户人脸图片
    viewVisitorImg: (id, pushFun) => {
        const obj = {
            method: 'get',
            url: `//jh.upk.net:12080/user/real/name/certification/${id}/face/photo`,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token'),
            }
        }
        return axios(obj, pushFun)
    },
    // 查看业主人脸图片
    viewOwnerImg: (data, pushFun) => {
        const str = cancatStr(data);
        const obj = {
            method: 'get',
            url: `//jh.upk.net:12080/user/real/name/certification/owner/face/photo?${str}`,
            data,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token'),
            }
        }
        return axios(obj, pushFun)
    },
    // 查看家庭成员人脸图片
    viewMenberImg: (data, pushFun) => {
        const str = cancatStr(data);
        const obj = {
            method: 'get',
            url: `//jh.upk.net:12080/user/real/name/certification/visitor/face/photo?${str}`,
            headers: {
                'Auth-Token': window.localStorage.getItem('visitor_token'),
            }
        }
        return axios(obj, pushFun)
    },
}

export default AxiosList;