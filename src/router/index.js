import {createRouter, createWebHistory} from 'vue-router'
import {defineAsyncComponent} from "vue";

const ifAuthorized = (from, to, next) => {
    if (localStorage.getItem('tt_accessToken') !== null) {
        next()
    } else {
        next({ name: 'home'})
    }
}

const ifNotAuthorized = (to, from, next) => {
    if (localStorage.getItem('tt_accessToken') === null) {
        next()
    } else {
        next({ name: 'home' })
    }
}


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            meta: {
                layout: defineAsyncComponent(() => import('@/layout/BlankLayout.vue'))
            },
            component: () => import('@/views/HomeView.vue'),
        },
        {
            path: '/admin',
            name: 'admin',
            meta: {
                layout: defineAsyncComponent(() => import('@/layout/MainLayout.vue'))
            },
            component: () => import('@/views/AdminView.vue'),
            redirect: { name: 'submissions'},
            beforeEnter: ifAuthorized
        },
        {
            path: '/admin/submissions',
            name: 'submissions',
            meta: {
                layout: defineAsyncComponent(() => import('@/layout/MainLayout.vue'))
            },
            component: () => import('@/views/SubmissionsView.vue'),
            beforeEnter: ifAuthorized
        },
        {
            path: '/admin/organizations',
            name: 'organizations',
            meta: {
                layout: defineAsyncComponent(() => import('@/layout/MainLayout.vue'))
            },
            component: () => import('@/views/OrganizationsView.vue'),
            beforeEnter: ifAuthorized
        },
        {
            path: '/login',
            name: 'login',
            meta: {
                layout: defineAsyncComponent(() => import('@/layout/BlankLayout.vue'))
            },
            component: () => import('@/views/LoginView.vue'),
            beforeEnter: ifNotAuthorized
        }
    ],
})

export default router
