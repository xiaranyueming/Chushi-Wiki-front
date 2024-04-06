<script setup>
import { getDocListByBookIdApi } from "@/apis/doc.js";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { toTree, isEmptyObject } from "@/utils/Tool.js";
import { getContentDetailApi } from "@/apis/content.js";

const route = useRoute();
const data = ref([]);

// 获取文档列表
const defaultSelected = ref([]);
const getDocListByBookId = async () => {
    const res = await getDocListByBookIdApi(route.query.bookId);
    if (res.code === 200) {
        data.value = toTree(res.data, 0);
        if (!isEmptyObject(data.value)) {
            await getContent([data.value[0].id])
        }
    }
};

// 获取文档内容
const html = ref('')
const getContent = async (key) => {
    html.value = ''
    const res = await getContentDetailApi(key[0])
    if (res.code === 200) {
        html.value = res.data.content
    }
}



onMounted(() => {
    getDocListByBookId();
});
</script>

<template>
    <h3 v-if="data.length === 0" style="text-align: center; margin-top: 100px">对不起，未找到该文档</h3>
    <a-row :gutter="24">
        <a-col :span="6">
            <a-tree v-if="data.length > 0"
                    class="tree"
                    :tree-data="data"
                    :field-names="{ title: 'docName', key: 'id', value: 'id' }"
                    :default-expand-all="true"
                    @select="getContent"
            />
        </a-col>
        <a-col :span="18">
            <div class="editor-content-view" v-html="html"></div>
        </a-col>
    </a-row>
</template>

<style scoped>
.editor-content-view {
    border-radius: 5px;
    padding: 0 10px;
    margin-top: 20px;
    overflow-x: auto;
}

.editor-content-view p,
.editor-content-view li {
    white-space: pre-wrap; /* 保留空格 */
}

.editor-content-view blockquote {
    border-left: 8px solid #7fbfea !important;
    padding: 10px 10px !important;
    margin: 10px 0 !important;
    background-color: #b6d3eb !important;
}

.editor-content-view code {
    font-family: monospace;
    background-color: #eee;
    padding: 3px;
    border-radius: 3px;
}
.editor-content-view pre>code {
    display: block;
    padding: 10px;
}

.editor-content-view table {
    border-collapse: collapse;
}
.editor-content-view td,
.editor-content-view th {
    border: 1px solid #ccc;
    min-width: 50px;
    height: 20px;
}
.editor-content-view th {
    background-color: #f1f1f1;
}

.editor-content-view ul,
.editor-content-view ol {
    padding-left: 20px;
}

.editor-content-view input[type="checkbox"] {
    margin-right: 5px;
}
</style>
