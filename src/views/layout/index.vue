<script setup>
import {RouterView, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {toTree} from "@/utils/Tool.js";
import {getCategoryListApi} from "@/apis/category.js";

const router = useRouter();

// 获取数据
const categoryList = ref([]);
const getCategoryList = async () => {
    const res = await getCategoryListApi();
    if (res.code === 200) {
        categoryList.value = toTree(res.data, 0);
    }
};


const toBook = (id) => {
    router.push({path: `/book/${id}`});
};



onMounted(() => {
    getCategoryList();
});
</script>

<template>
    <a-layout style="padding: 20px 20px; background: #fff">
        <a-layout-sider width="200" style="background: #fff">
            <a-menu
                mode="inline"
                style="height: 100%"
            >
                <a-menu-item key="home">
                    <span>
                        <RouterLink to="/">
                            首页
                        </RouterLink>
                    </span>
                </a-menu-item>
                <a-sub-menu v-for="item in categoryList" :key="item.id">
                    <template #title>
                        <span>
                          {{ item.categoryName }}
                        </span>
                    </template>
                    <a-menu-item v-for="i in item.children" :key="i.id" @click="toBook(i.id)">
                            {{ i.categoryName }}
                    </a-menu-item>
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
