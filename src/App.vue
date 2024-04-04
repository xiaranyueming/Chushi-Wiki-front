<script setup>
import {RouterView} from 'vue-router'
</script>

<template>
    <a-layout>
        <a-layout-header class="header">
            <div class="logo" />
            <a-menu
                v-model:selectedKeys="selectedKeys1"
                theme="dark"
                mode="horizontal"
                :style="{ lineHeight: '64px' }"
            >
                <a-menu-item key="index">
                    <RouterLink to="/">首页</RouterLink>
                </a-menu-item>
                <a-menu-item key="admin">
                    <RouterLink to="/admin/book">管理</RouterLink>
                </a-menu-item>
                <a-menu-item key="about">
                    <RouterLink to="/about">关于我们</RouterLink>
                </a-menu-item>
            </a-menu>
        </a-layout-header>
        <a-layout-content>
               <RouterView />
        </a-layout-content>
        <a-layout-footer style="text-align: center">
            ChuShi Wiki ©2024 Created by Little Monster
        </a-layout-footer>
    </a-layout>
</template>

<style scoped>
#components-layout-demo-top-side .logo {
    float: left;
    width: 120px;
    height: 31px;
    margin: 16px 24px 16px 0;
    background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side .logo {
    float: right;
    margin: 16px 0 16px 24px;
}

.site-layout-background {
    background: #fff;
}
</style>
