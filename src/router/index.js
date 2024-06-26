import {createRouter, createWebHistory} from 'vue-router'
import Layout from "@/views/layout/index.vue";
import Index from "@/views/index/index.vue";
import BookAdmin from "@/views/admin/book-admin.vue";
import CategoryAdmin from "@/views/admin/category-admin.vue";
import Book from "@/views/book/index.vue";
import DocAdmin from "@/views/admin/doc-admin.vue";
import Doc from "@/views/doc/index.vue";
import Login from "@/views/login/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      {
            path: '/',
            name: 'layout',
            component: Layout,
            children: [
                {
                    path: '/',
                    name: 'Index',
                    component: Index
                },
                {
                    path: '/book/:id',
                    name: 'Book',
                    component: Book
                }
            ]
      },
      {
            path: '/login',
            name: 'Login',
            component: Login
      },
      {
            path: '/admin/book',
            name: 'BookAdmin',
            component: BookAdmin
      },
      {
            path: '/admin/category',
            name: 'CategoryAdmin',
            component: CategoryAdmin
      },
      {
            path: '/admin/doc/:id',
            name: 'DocAdmin',
            component: DocAdmin
      },
      {
            path: '/doc',
            name: 'Doc',
            component: Doc
      }
  ]
})

router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (to.path !== '/login' && !user) {
        next('/login')
    } else {
        next()
    }
})

export default router
