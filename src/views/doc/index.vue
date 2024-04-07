<script setup>
import {getDocListByBookIdApi, voteDocApi} from "@/apis/doc.js";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { toTree, isEmptyObject } from "@/utils/Tool.js";
import { getContentDetailApi } from "@/apis/content.js";
import {LikeOutlined} from "@ant-design/icons-vue";
import {message} from "ant-design-vue";

const route = useRoute();
const data = ref([]);

// 获取文档列表
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
const docId = ref(null)
const voteCount = ref(0)
const html = ref('')
const getContent = async (key) => {
    html.value = ''
    const res = await getContentDetailApi(key[0])
    if (res.code === 200) {
        html.value = res.data.content
        docId.value = key[0]
        voteCount.value = res.data.voteCount
    }
}


// 点赞
const vote = async () => {
    const res = await voteDocApi(docId.value)
    if (res.code === 200) {
        voteCount.value++
        message.success('点赞成功')
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
            <div class="vote" v-if="html" @click="vote">
                <a-button class="vote-btn" type="primary">
                    <template #icon>
                        <LikeOutlined />
                    </template>
                    点赞 {{ voteCount }}
                </a-button>
            </div>
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
.vote {
    margin: 75px 0 0;
    text-align: center;
}
.vote-btn {
    border-radius: 20px;
}
</style>
