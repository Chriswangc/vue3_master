
# 使用文档

export default [
    // subMenu
    {
        icon: 'location', // 主菜单icon
        type: 'subMenu',  // 类型
        name:'测试菜单',   // 主菜单名称
        path:''           // 路径
        component:
        children: [      // 子菜单
            {
                path: '/test', // 路径
                name: '测试',  // 子菜单名
            }
        ]
    },
    // menuItem
    {
        type: 'menuItem',
        icon: 'location',
        path: '/test',
        name: '测试',
    }
]