<script setup>
import {LaptopOutlined, NotificationOutlined, UserOutlined} from "@ant-design/icons-vue";
import {RouterView} from "vue-router";
</script>

<template>
    <a-layout style="padding: 20px 20px; background: #fff">
        <a-layout-sider width="200" style="background: #fff">
            <a-menu
                v-model:selectedKeys="selectedKeys2"
                v-model:openKeys="openKeys"
                mode="inline"
                style="height: 100%"
            >
                <a-menu-item key="home">
                    <span>
                        <RouterLink to="/">
                            <user-outlined />
                            首页
                        </RouterLink>
                    </span>
                </a-menu-item>
                <a-sub-menu key="sub2">
                    <template #title>
                                <span>
                                  <laptop-outlined />
                                  subnav 2
                                </span>
                    </template>
                    <a-menu-item key="5">option5</a-menu-item>
                    <a-menu-item key="6">option6</a-menu-item>
                    <a-menu-item key="7">option7</a-menu-item>
                    <a-menu-item key="8">option8</a-menu-item>
                </a-sub-menu>
                <a-sub-menu key="sub3">
                    <template #title>
                                <span>
                                  <notification-outlined />
                                  subnav 3
                                </span>
                    </template>
                    <a-menu-item key="9">option9</a-menu-item>
                    <a-menu-item key="10">option10</a-menu-item>
                    <a-menu-item key="11">option11</a-menu-item>
                    <a-menu-item key="12">option12</a-menu-item>
                </a-sub-menu>
            </a-menu>
        </a-layout-sider>
        <a-layout-content :style="{ padding: '0 24px', minHeight: '550px' }">
            <RouterView />
        </a-layout-content>
    </a-layout>
</template>

<style scoped>

</style>
