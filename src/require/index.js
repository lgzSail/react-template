import axios from 'axios';
import { Message } from '@alifd/next';

// axios 数据封装 外围封装
const AxiosFun = (obj, pushFun, messegeBol) => {
    return new Promise((reslove, reject) => {
        axios(obj).then((res) => {
            const { data } = res;
            if (data.status === 401) {
                Message.error(data.info);
                pushFun.push('/login');
            } else if (data.status === 200) {
                if (!messegeBol && data.info !== '获取成功') {
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
export const cancatStr = (obj) => {
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

export default AxiosFun;