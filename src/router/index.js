import {createRouter, createWebHistory} from 'vue-router'
import Layout from "@/views/layout/index.vue";
import Index from "@/views/index/index.vue";
import BookAdmin from "@/views/admin/book-admin.vue";
import CategoryAdmin from "@/views/admin/category-admin.vue";
import Book from "@/views/book/index.vue";
import DocAdmin from "@/views/admin/doc-admin.vue";
import Doc from "@/views/doc/index.vue";

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

export default router
