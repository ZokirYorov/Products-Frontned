import {createRouter, createWebHistory} from "vue-router";
import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        name: "Main",
        path: "/",
        redirect: "/about",
        component: () => import("@/Layouts/layout.vue"),
        children: [
            {
                path: "about",
                name: "AboutPage",
                component: () => import("@/views/about.vue"),
                meta: { requiresAuth: true },
            },
            {
                path: "/account",
                name: "AccountPage",
                component: () => import("@/views/Accounts.vue"),
                meta: { requiresAuth: true },
            },
            {
                path: '/categories',
                name: "Categories",
                component: () => import("@/views/categories.vue"),
                meta: { requiresAuth: true },
            },
            {
                name: "ProductPage",
                path: "/products",
                component: () => import("@/views/Products.vue"),
                meta: { requiresAuth: true },
            },
            {
                name: "CategoryPage",
                path: "/categories2",
                component: () => import("@/views/Categories2.vue"),
                meta: { requiresAuth: true },
            }
        ]
    },
]

const router =createRouter({
    routes,
    history: createWebHistory(),
})

export default router