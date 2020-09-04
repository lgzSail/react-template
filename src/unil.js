const fun = {
    // 校验
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
    // 克隆
    clone: (obj = {}) => {
        return JSON.parse(JSON.stringify(obj));
    },
    // 手机号脱敏
    phoneDes: (str) => {
        return `${str.substr(0, 3)}****${str.substr(7)}`
    },
    // 身份证脱敏
    userIdDes: (str) => {
        return str.replace(/^(.{5})(?:\d+)(.{4})$/, "$1****$2")
    },
}
export default fun;