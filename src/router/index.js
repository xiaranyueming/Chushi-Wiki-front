import {createRouter, createWebHistory} from 'vue-router'
import Layout from "@/views/layout/index.vue";
import Index from "@/views/index/index.vue";
import BookAdmin from "@/views/admin/book-admin.vue";
import CategoryAdmin from "@/views/admin/category-admin.vue";

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
      }
  ]
})

export default router
