<script setup>
import {onMounted, ref} from 'vue';
import {deleteCategoryApi, getCategoryListApi, saveCategoryApi, searchCategoryApi} from "@/apis/category.js";
import dayjs from "dayjs";
import {notification} from 'ant-design-vue';
import {copy, toTree} from "@/utils/Tool.js";

const loading = ref(false);

// 表格列
const columns = [
    {
        title: '分类名称',
        dataIndex: 'categoryName',
        align: 'center',
    },
    {
        title: '父分类',
        dataIndex: 'parentId',
        align: 'center',
    },
    {
        title: '排序',
        dataIndex: 'sort',
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
const getCategoryList = async () => {
    loading.value = true;
    const res = await getCategoryListApi();
    if (res.code !== 200) {
        loading.value = false;
        return;
    }
    data.value = toTree(res.data, 0);
    loading.value = false;
};


// 弹出框
const open = ref(false);
const confirmLoading = ref(false);
const form = ref({})
const edit = (record) => {
    open.value = true;
    form.value = copy(record);
};
// 确认
const handleOk = async () => {
    confirmLoading.value = true;
    const res = await saveCategoryApi(form.value);
    if (res.code === 200) {
        notification.success({
            message: '成功',
            description: '修改成功'
        });
        confirmLoading.value = false;
        open.value = false;
        await getCategoryList()
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
    const res = await deleteCategoryApi(id);
    if (res.code === 200) {
        notification.success({
            message: '成功',
            description: '删除成功'
        });
        await getCategoryList()
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
    const res = await searchCategoryApi(keyWord.value);
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
    getCategoryList();
});
</script>

<template>
    <div class="hd">
        <div class="search">
            <a-input v-model:value="keyWord" allow-clear placeholder="请输入分类名" style="width: 200px" />
            <a-button class="search-btn" type="primary" ghost @click="search">查询</a-button>
        </div>
        <a-button class="btn" type="primary" ghost @click="add">新增</a-button>
    </div>
    
    
    <a-table :columns="columns" :data-source="data"
             :loading="loading" :pagination="false"
    >
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'createTime'">
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
    
    <a-modal v-model:open="open" title="编辑分类" centered
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
                label="分类名"
                name="categoryName"
                :rules="[{ required: true, message: '请输入分类名!' }]"
            >
                <a-input v-model:value="form.categoryName" />
            </a-form-item>
            
            <a-form-item
                label="父分类"
                name="parentId"
                :rules="[{ required: true, message: '请选择父分类!' }]"
            >
                <a-select ref="select"
                          v-model:value="form.parentId"
                >
                    <a-select-option value="0">无</a-select-option>
                    <a-select-option v-for="item in data" :key="item.id"
                                     :value="item.id" :disabled="form.id === item.id"
                    >
                        {{ item.categoryName }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            
            <a-form-item
                label="排序"
                name="sort"
            >
                <a-input v-model:value="form.sort" />
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
