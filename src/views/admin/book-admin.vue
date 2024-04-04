<script setup>
import {ref} from 'vue';

const loading = ref(false);

const columns = [
    {
        title: '封面',
        dataIndex: 'cover',
        key: 'cover',
        align: 'center',
    },
    {
        title: '书名',
        dataIndex: 'bookName',
        align: 'center',
    },
    {
        title: '分类一',
        dataIndex: 'category1Id',
        align: 'center',
    },
    {
        title: '分类二',
        dataIndex: 'category2Id',
        align: 'center',
    },
    {
        title: '文档数',
        dataIndex: 'docCount',
        align: 'center',
    },
    {
        title: '浏览量',
        dataIndex: 'viewCount',
        align: 'center',
    },
    {
        title: '点赞数',
        dataIndex: 'voteCount',
        align: 'center',
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        align: 'center',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
    },
];
const data = [
    {
        key: '1',
        cover: 'https://img.zcool.cn/community/0113295a6ed69fa80120a1232971b2.jpg@1280w_1l_2o_100sh.jpg',
        bookName: '十万个为什么',
        category1Id: '科普',
        category2Id: '科普',
        docCount: 100,
        viewCount: 100,
        voteCount: 100,
        createTime: '2021-10-10',
    },
];
</script>

<template>
    <a-table :columns="columns" :data-source="data"
             :loading="loading"
    >
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'cover'">
                <img class="img" :src="record.cover"  alt="avatar" />
            </template>
            <template v-else-if="column.key === 'action'">
                <a-space size="middle">
                    <a-button type="primary" ghost @click="edit(record)">编辑</a-button>
                    <a-button type="primary" danger ghost @click="del(record)">删除</a-button>
                </a-space>
            </template>
        </template>
    </a-table>
</template>

<style scoped>
.img {
    width: 50px;
    height: 50px;
    border-radius: 8%;
}
</style>
