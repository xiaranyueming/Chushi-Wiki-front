<script setup>
import {onMounted, ref} from 'vue';
import {deleteBooksApi, getBooksListApi, saveBooksApi, searchBooksApi} from "@/apis/books.js";
import dayjs from "dayjs";
import {notification} from 'ant-design-vue';
import {copy, toTree} from "@/utils/Tool.js";
import {getCategoryListApi} from "@/apis/category.js";

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
        title: '分类',
        dataIndex: 'category',
        align: 'center',
        key: 'category',
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
const getCategoryName = (id) => {
    let name = '';
    categorys.value.forEach(item => {
        if (item.id === id) {
            name = item.categoryName;
        }
    });
    return name;
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
const categoryIds = ref([]);
// 获取分类数据
let categorys = ref([]);
const categoryList = ref([]);
const getCategoryList = async () => {
    const res = await getCategoryListApi();
    if (res.code === 200) {
        categorys.value = res.data;
        categoryList.value = toTree(res.data, 0);
    }
};
const edit = (record) => {
    open.value = true;
    form.value = copy(record);
    categoryIds.value = [form.value.category1Id, form.value.category2Id];
};
// 确认
const handleOk = async () => {
    confirmLoading.value = true;
    form.value.category1Id = categoryIds.value[0];
    form.value.category2Id = categoryIds.value[1];
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
    form.value = {};
};


// 删除
const del = async (id) => {
    const res = await deleteBooksApi(id);
    if (res.code === 200) {
        notification.success({
            message: '成功',
            description: '删除成功'
        });
        await getBooksList()
    } else {
        notification.error({
            message: '失败',
            description: '删除失败'
        });
    }
};


// 搜索
const keyWord = ref('');
const search = async () => {
    const res = await searchBooksApi(keyWord.value);
    if (res.code === 200) {
        data.value = res.data;
    } else {
        notification.error({
            message: '失败',
            description: '搜索失败'
        });
    }
}


onMounted(() => {
    getBooksList();
    getCategoryList()
});
</script>

<template>
    <div class="hd">
        <div class="search">
            <a-input v-model:value="keyWord" allow-clear placeholder="请输入书名" style="width: 200px" />
            <a-button class="search-btn" type="primary" ghost @click="search">查询</a-button>
        </div>
        <a-button class="btn" type="primary" ghost @click="add">新增</a-button>
    </div>
    
    
    <a-table :columns="columns" :data-source="data"
             :loading="loading" :pagination="pagination"
    >
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'cover'">
                <img class="img" :src="record.cover"  alt="avatar" />
            </template>
            <template v-else-if="column.key === 'category'">
                {{ getCategoryName(record.category1Id) }}/{{ getCategoryName(record.category2Id) }}
            </template>
            <template v-else-if="column.key === 'createTime'">
                {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template v-else-if="column.key === 'action'">
                <a-space size="middle">
                    <a-button type="primary" ghost @click="edit(record)">编辑</a-button>
                    <a-popconfirm
                        title="删除后不可恢复哦，确认删除吗?"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="del(record.id)"
                    >
                        <a-button type="primary" danger ghost>
                            删除
                        </a-button>
                    </a-popconfirm>
                </a-space>
            </template>
        </template>
    </a-table>
    
    <a-modal v-model:open="open" title="编辑书单" centered
             :body-style="{'margin-left': '-90px'}"
             :confirm-loading="confirmLoading"
             cancel-text="取消" ok-text="确定"
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
                label="分类"
            >
                <a-cascader v-model:value="categoryIds"
                            :options="categoryList"
                            :field-names="{ label: 'categoryName', value: 'id', children: 'children' }"
                            placeholder="请选择分类"
                />
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
.hd {
    display: flex;
    align-items: center;
    justify-content: right;
    margin-right: 150px;
}
.search-btn {
    margin-left: 10px;
}
.btn {
    margin: 5px 0 5px 50px;
}
.img {
    width: 50px;
    height: 50px;
    border-radius: 8%;
}
</style>
