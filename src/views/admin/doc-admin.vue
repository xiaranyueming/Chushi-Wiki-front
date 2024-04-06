<script setup>
import {onMounted, ref} from 'vue';
import {deleteDocApi, getDocListApi, saveDocApi, searchDocApi} from "@/apis/doc.js";
import dayjs from "dayjs";
import {notification} from 'ant-design-vue';
import {copy, isEmptyObject, setDisabled, toTree} from "@/utils/Tool.js";
import {useRoute} from "vue-router";

const loading = ref(false);
const route = useRoute();

// 表格列
const columns = [
    {
        title: '文档名称',
        dataIndex: 'docName',
        align: 'center',
    },
    {
        title: '父文档',
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
const getDocList = async () => {
    loading.value = true;
    const res = await getDocListApi();
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
const treeData = ref([]);
const edit = (record) => {
    open.value = true;
    form.value = copy(record);
    
    // 设置节点及其子节点不可选
    treeData.value = copy(data.value);
    setDisabled(treeData.value, record.id);
    
    treeData.value.unshift({id: 0, docName: '无'});
};
// 确认
const handleOk = async () => {
    confirmLoading.value = true;
    form.value.bookId = route.params.id;
    const res = await saveDocApi(form.value);
    if (res.code === 200) {
        notification.success({
            message: '成功',
            description: '修改成功'
        });
        confirmLoading.value = false;
        open.value = false;
        await getDocList()
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
    
    // 复制数据
    treeData.value = copy(data.value);
    
    treeData.value.unshift({id: 0, docName: '无'});
};


// 获取删除的id
const ids = ref([]);
const getDeleteIds = (list, id) => {
    for (let i = 0; i < list.length; i++) {
        const node = list[i];
        if (node.id === id) {
            // 设置为disabled
            ids.value.push(node.id);
            
            const children = node.children;
            if (!isEmptyObject(children)) {
                // 递归设置子孙节点为disabled
                for (let j = 0; j < children.length; j++) {
                    getDeleteIds(children, children[j].id);
                }
            }
        } else {
            const children = node.children;
            if (!isEmptyObject(children)) {
                getDeleteIds(children, id);
            }
        }
    }
};
// 删除
const del = async (id) => {
    getDeleteIds(data.value, id)
    const res = await deleteDocApi(ids.value);
    if (res.code === 200) {
        notification.success({
            message: '成功',
            description: '删除成功'
        });
        await getDocList()
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
    const res = await searchDocApi(keyWord.value);
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
    getDocList();
});
</script>

<template>
    <div class="hd">
        <div class="search">
            <a-input v-model:value="keyWord" allow-clear placeholder="请输入文档名" style="width: 200px" />
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
    
    <a-modal v-model:open="open" title="编辑文档" centered
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
                label="文档名"
                name="docName"
                :rules="[{ required: true, message: '请输入文档名!' }]"
            >
                <a-input v-model:value="form.docName" />
            </a-form-item>
            
            <a-form-item
                label="父文档"
                name="parentId"
                :rules="[{ required: true, message: '请选择父文档!' }]"
            >
                <a-tree-select
                    v-model:value="form.parentId"
                    show-search
                    style="width: 100%"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    placeholder="请选择父文档"
                    allow-clear
                    tree-default-expand-all
                    :tree-data="treeData"
                    tree-node-filter-prop="label"
                    :field-names="{ label: 'docName', value: 'id', key: 'id' }"
                >
                </a-tree-select>
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
