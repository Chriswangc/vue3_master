/**
 * @file 路由配置文件
 * @description 配置应用的路由规则和导航守卫
 */

import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import menuTab from '@/util/menuTab.js'

/**
 * @description 路由配置数组
 * @type {Array<Object>}
 */
const routes = [
    {
        path: '/',
        redirect: '/login', // 根路径重定向到登录页
    },
    {
        path: '/login',
        component: () => import('@/components/Login.vue') // 登录页面
    },
    {
        path: '/home',
        redirect: '/homeShow', // 首页重定向
        component: () => import('@/components/Layout.vue'), // 主布局组件
        children: [
            ...menuTab // 从菜单配置导入子路由
        ]
    },
    { 
        path: '/:catchAll(.*)', 
        component: () => import('@/components/NotFound.vue') // 404页面
    },
]

/**
 * @description 创建路由实例
 * @type {Router}
 */
const router = createRouter({
    history: createWebHistory(), // 使用HTML5 History模式
    routes
})

/**
 * @description 全局前置守卫
 * @function
 * @param {Route} to - 目标路由对象
 * @param {Route} from - 来源路由对象
 * @param {Function} next - 路由控制函数
 * @returns {void}
 * 
 * @example
 * // 路由跳转前的处理
 * router.beforeEach((to, from, next) => {
 *   // 处理逻辑
 *   next()
 * })
 */
router.beforeEach((to, from, next) => {
    NProgress.start() // 开始加载进度条
    
    // 获取token
    const token = localStorage.getItem('token')
    
    // 登录页面直接放行
    if (to.path === '/login') {
        next()
        return
    }
    
    // 未登录时重定向到登录页
    if (!token) {
        console.log('未登录，重定向到登录页面')
        next('/login')
        return
    }
    
    // 已登录，允许访问
    next()
})

/**
 * @description 全局后置守卫
 * @function
 * @returns {void}
 * 
 * @example
 * // 路由跳转后的处理
 * router.afterEach(() => {
 *   // 处理逻辑
 * })
 */
router.afterEach(() => {
    NProgress.done() // 完成加载进度条
})

export default router