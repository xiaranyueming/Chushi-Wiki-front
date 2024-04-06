<script setup>
import {onMounted, ref, shallowRef} from 'vue';
import {deleteDocApi, getDocListApi, saveDocApi, searchDocApi} from "@/apis/doc.js";
import {notification} from 'ant-design-vue';
import {copy, isEmptyObject, setDisabled, toTree} from "@/utils/Tool.js";
import {useRoute} from "vue-router";
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'

const loading = ref(false);
const route = useRoute();

// 表格列
const columns = [
    {
        title: '文档名称',
        dataIndex: 'docName',
        align: 'center',
        key: 'docName'
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

// 富文本编辑器
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
// 内容 HTML
const valueHtml = ref('<p>hello</p>')
const mode = 'default'
const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }

const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

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
        data.value = toTree(res.data, 0)
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
    <a-row :gutter="24">
        <a-col :span="6">
            <div class="hd">
                <div class="search">
                    <a-input v-model:value="keyWord" allow-clear placeholder="请输入文档名" style="width: 200px" />
                    <a-button class="search-btn" type="primary" ghost @click="search">查询</a-button>
                </div>
                <a-button class="btn" type="primary" ghost @click="add">新增</a-button>
            </div>
            
            <a-table v-if="data.length > 0"
                     :columns="columns" default-expand-all-rows
                     :data-source="data"
                     :loading="loading" :pagination="false"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'docName'">
                        {{ record.sort }} {{ record.docName }}
                    </template>
                    <template v-else-if="column.key === 'action'">
                        <a-space size="middle">
                            <a-button type="primary" ghost @click="edit(record)"
                                        size="small"
                            >
                                编辑
                            </a-button>
                            <a-popconfirm
                                title="删除后不可恢复哦，确认删除吗?"
                                ok-text="确定"
                                cancel-text="取消"
                                @confirm="del(record.id)"
                            >
                                <a-button type="primary" danger ghost size="small">
                                    删除
                                </a-button>
                            </a-popconfirm>
                        </a-space>
                    </template>
                </template>
            </a-table>
        </a-col>
        <a-col :span="18">
            <div class="save-btn">
                <a-button type="primary" ghost @click="handleOk">
                    保存
                </a-button>
            </div>
            <a-form class="form" layout="vertical"
                :model="form"
                name="basic"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }"
                autocomplete="off"
            >
                <a-form-item name="docName"
                    :rules="[{ required: true, message: '请输入文档名!' }]"
                >
                    <a-input v-model:value="form.docName" placeholder="文档名" />
                </a-form-item>
                
                <a-form-item name="parentId"
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
                
                <a-form-item name="sort">
                    <a-input v-model:value="form.sort" placeholder="排序" />
                </a-form-item>
                
                <a-form-item>
                    <div style="border: 1px solid #ccc">
                        <Toolbar
                            style="border-bottom: 1px solid #ccc"
                            :editor="editorRef"
                            :defaultConfig="toolbarConfig"
                            :mode="mode"
                        />
                        <Editor
                            style="height: 500px; overflow-y: hidden;"
                            v-model="valueHtml"
                            :defaultConfig="editorConfig"
                            :mode="mode"
                            @onCreated="handleCreated"
                        />
                    </div>
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>

<style scoped>
.hd {
    display: flex;
    align-items: center;
}
.search-btn {
    margin-left: 10px;
}
.btn {
    margin: 5px 0 5px 10px;
}
.save-btn {
    margin: 5px 0 5px 50px;
}
.form {
    margin-left: 50px;
}
</style>
