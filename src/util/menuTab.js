/**
 * @description 菜单配置数组
 * @type {Array<{
 *   type: string,
 *   icon: string,
 *   path: string,
 *   name: string,
 *   component?: Function,
 *   redirect?: string,
 *   children?: Array
 * }>}
 */
export default [
  {
    type: "menuItem",
    icon: "HomeFilled",
    path: "/homeShow",
    name: "首页",
    component: () => import("@/views/home/index.vue"),
  },
  {
    type: "subMenu",
    icon: "Histogram",
    path: "/mainTest",
    name: "功能",
    component: () => import("@/views/mainTest/index.vue"),
    redirect: "/mainTest/mainTestIndex",
    children: [
      {
        icon: "Lock",
        path: "/mainTestIndex",
        name: "加锁",
        meta:{parent:"功能"},
        component: () => import("@/views/mainTest/mainTestIndex/index.vue"),
      },
      {
        icon: "Refresh",
        path: "/htmlTwoCanvas",
        name: "html转canvas",
        meta:{parent:"功能"},
        component: () => import("@/views/mainTest/htmlTwoCanvas/index.vue"),
      },
    ],
  },
  {
    type: "subMenu",
    icon: "Histogram",
    path: "/dataFile",
    name: "数据",
    component: () => import("@/views/dataFile/index.vue"),
    redirect: "/dataFile/dataIndex",
    children: [
      {
        icon: "HelpFilled",
        path: "/dataFile",
        name: "数据源",
        meta:{parent:"数据"},
        component: () => import("@/views/dataFile/dataIndex/index.vue"),
      },
      {
        type: "el-icon-menu",
        icon: "DataLine",
        path: "/dataFile/mockDemo",
        name: "Mock数据示例",
        meta:{parent:"数据"},
        component: () => import("@/views/dataFile/mockDemo/index.vue"),
      },
    ],
  },
  {
    type: "menuItem",
    icon: "Setting",
    path: "/set",
    name: "设置",
    component: () => import("@/views/set/index.vue"),
  },
  {
    type: "menuItem",
    icon: "Document",
    path: "/about",
    name: "关于",
    component: () => import("@/views/about/index.vue"),
  },
]