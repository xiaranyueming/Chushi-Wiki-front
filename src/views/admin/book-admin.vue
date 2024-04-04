<script setup>
import {onMounted, ref} from 'vue';
import {getBooksListApi, saveBooksApi} from "@/apis/books.js";
import dayjs from "dayjs";
import {notification} from 'ant-design-vue';

const loading = ref(false);

// 表格列
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
        key: 'createTime'
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
    },
];
// 获取数据
const data = ref([]);
const getBooksList = async () => {
    loading.value = true;
    const res = await getBooksListApi();
    if (res.code !== 200) {
        loading.value = false;
        return;
    }
    data.value = res.data;
    loading.value = false;
};

// 分页
const pagination = {
    onChange: (page) => {
        console.log(page);
    },
    pageSize: 6,
};


// 弹出框
const open = ref(false);
const confirmLoading = ref(false);
const form = ref({})
const edit = (record) => {
    open.value = true;
    form.value = record;
};
// 确认
const handleOk = async () => {
    confirmLoading.value = true;
    const res = await saveBooksApi(form.value);
    if (res.code === 200) {
        notification.success({
            message: '成功',
            description: '修改成功'
        });
        confirmLoading.value = false;
        open.value = false;
        await getBooksList()
    } else {
        notification.error({
            message: '失败',
            description: '修改失败'
        });
        confirmLoading.value = false;
        open.value = false;
    }
};


// 新增
const add = () => {
    open.value = true;
};



onMounted(() => {
    getBooksList();
});
</script>

<template>
    <a-button class="btn" type="primary" ghost @click="add">新增</a-button>
    
    <a-table :columns="columns" :data-source="data"
             :loading="loading" :pagination="pagination"
    >
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'cover'">
                <img class="img" :src="record.cover"  alt="avatar" />
            </template>
            <template v-else-if="column.key === 'createTime'">
                {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template v-else-if="column.key === 'action'">
                <a-space size="middle">
                    <a-button type="primary" ghost @click="edit(record)">编辑</a-button>
                    <a-button type="primary" danger ghost @click="del(record)">删除</a-button>
                </a-space>
            </template>
        </template>
    </a-table>
    
    <a-modal v-model:open="open" title="编辑书单" centered
             :body-style="{'margin-left': '-90px'}"
             :confirm-loading="confirmLoading"
             @ok="handleOk"
    >
        <a-form
            :model="form"
            name="basic"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
            autocomplete="off"
        >
            <a-form-item
                label="书名"
                name="bookName"
                :rules="[{ required: true, message: '请输入书名!' }]"
            >
                <a-input v-model:value="form.bookName" />
            </a-form-item>
            
            <a-form-item
                label="封面"
                name="cover"
                :rules="[{ required: true, message: '请输入封面地址!' }]"
            >
                <a-input v-model:value="form.cover" />
            </a-form-item>
            
            <a-form-item
                label="分类一"
                name="category1Id"
                :rules="[{ required: true, message: '请输入分类一!' }]"
            >
                <a-input v-model:value.number="form.category1Id" />
            </a-form-item>
            
            <a-form-item
                label="分类二"
                name="category2Id"
                :rules="[{ required: true, message: '请输入分类二!' }]"
            >
                <a-input v-model:value.number="form.category2Id" />
            </a-form-item>
            
            <a-form-item
                label="描述"
                name="description"
            >
                <a-textarea :auto-size="{ minRows: 2, maxRows: 5 }" v-model:value="form.description" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<style scoped>
.img {
    width: 50px;
    height: 50px;
    border-radius: 8%;
}
.btn {
    margin: 5px 0 5px 1300px;
}
</style>
