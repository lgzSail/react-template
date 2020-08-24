const data = {
    list: [
        {
            value: '人员管理', iconAction: 'personnel', icon: 'personnel2', label: 'personnel', childrenList: [
                { value: '访客信息', label: 'visitorInfo' },
                { value: '业主信息', label: 'ownerInfo' }
            ]
        },
        {
            value: '访客管理', iconAction: 'visitorManagement', icon: 'visitorManagement2', label: 'visitorManagement', childrenList: [
                { value: '访客记录', label: 'visitorsRecord' },
                { value: '访客黑名单', label: 'visitorsBlack' }
            ]
        },
        {
            value: '帐号管理', iconAction: 'userManagement', icon: 'userManagement2', label: 'userManagement', childrenList: [
                { value: '人员帐号', label: 'personnelAccount' },
            ]
        },
        {
            value: 'CMS内容配置', iconAction: 'configIcon', icon: 'configIcon2', label: 'CMSConfig', childrenList: [
                { value: '小程序头图', label: 'appletImg' },
                { value: '入口配置', label: 'entranceConfig' }
            ]
        },
        {
            value: '系统配置', iconAction: 'CMSConfig', icon: 'CMSConfig2', label: 'systemConfig', childrenList: [
                { value: '参数配置', label: 'parameterConfig' },
                { value: '登录日志', label: 'signLog' },
                { value: '操作日志', label: 'operationLog' },
            ]
        },
    ]
}

export default data;