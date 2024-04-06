<script setup>
import {LikeOutlined, MessageOutlined, StarOutlined} from '@ant-design/icons-vue';
import {onMounted, ref} from "vue";
import {getBooksListApi} from "@/apis/books.js";


// 获取书籍列表
const listData = ref([]);
const getBooksList = async () => {
    const res = await getBooksListApi();
    listData.value = res.data;
};

const pagination = {
    onChange: (page) => {
        console.log(page);
    },
    pageSize: 6,
};
const actions = [
    { icon: StarOutlined, text: '156' },
    { icon: LikeOutlined, text: '156' },
    { icon: MessageOutlined, text: '2' },
];


onMounted(() => {
    getBooksList();
});
</script>

<template>
    <a-list item-layout="vertical" size="default" :grid="{ gutter: 20, column: 3 }"
            :pagination="pagination" :data-source="listData"
    >
        <template #renderItem="{ item }">
            <a-list-item key="item.title">
                <template #actions>
                  <span v-for="{ icon, text } in actions" :key="icon">
                    <component :is="icon" style="margin-right: 8px" />
                    {{ text }}
                  </span>
                </template>
                <a-list-item-meta :description="item.description">
                    <template #title>
                        <RouterLink :to="'/doc?bookId=' + item.id">
                            {{ item.bookName }}
                        </RouterLink>
                    </template>
                    <template #avatar><a-avatar :src="item.cover" /></template>
                </a-list-item-meta>
            </a-list-item>
        </template>
    </a-list>
</template>

<style scoped>
.ant-avatar {
    width: 50px;
    height: 50px;
    margin: 5px 0;
    line-height: 50px;
    border-radius: 8%;
}
</style>
