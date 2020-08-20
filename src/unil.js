const fun = {
    createArr: (num) => {
        let arr = [];
        for (let i = 0; i < num; i++) {
            arr.push(i)
        }
        return arr;
    },
    test: (name, value) => {
        switch (name) {
            case 'phone':
                if (/^1[3456789]\d{9}$/.test(value)) {
                    return false;
                } else {
                    return true;
                }
            case 'cardNo':
                if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
                    return false;
                } else {
                    return true;
                }
            default:
                return true
        }
    },
    // 把数组转成fusion组件可解析格式
    parseArr: (arr = []) => {
        const newArr = [];
        for (const item of arr) {
            const obj = {
                value: item.value,
                label: item.name
            }
            newArr.push(obj)
        }
        return newArr;
    },
    // 返回数组对象指定值
    returnValue: (value, arr = []) => {
        for (const item of arr) {
            if (item.value === value) {
                return item.label;
            }
        }
        return false;
    },
    // 返回数组指定id的对象
    returnObj: (id, arr = []) => {
        for (const item of arr) {
            if (item.id === id) {
                return item;
            }
        }
        return false;
    },
    // 去除业主选项
    deleteType: (arr = []) => {
        const newArr = [];
        arr.map(item => {
            if (item.value !== 1) {
                newArr.push(item);
            }
            return null;
        })
        return newArr;
    },
    // 克隆
    clone: (obj = {}) => {
        return JSON.parse(JSON.stringify(obj));
    }
}
export default fun;