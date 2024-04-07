<script setup>
import {RouterView} from 'vue-router'
import {DownOutlined} from "@ant-design/icons-vue";
import {ref} from "vue";
import {message, notification} from "ant-design-vue";
import {useRouter} from "vue-router";
import {resetPasswordApi} from "@/apis/user.js";

const router = useRouter()
const user = JSON.parse(localStorage.getItem('user'))

const open = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// 重置密码
const reset = () => {
    open.value = true
}
const handleOk = async () => {
    if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
        message.error('密码不能为空')
        return
    }
    if (newPassword.value !== confirmPassword.value) {
        message.error('两次密码不一致')
        return
    }
    
    const res = await resetPasswordApi({
        userName: user.userName,
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value
    })
    if (res.code === 200) {
        notification.success({
            message: '成功',
            description: '密码修改成功，请重新登录'
        })
        open.value = false
        setTimeout(() => {
            logout()
        }, 1000)
    } else {
        notification.error({
            message: '失败',
            description: res.message
        })
    }
}


const logout = () => {
    localStorage.removeItem('user')
    router.push('/login')
}

</script>

<template>
    <a-layout>
        <a-layout-header class="header">
            <div>
                <div class="logo" />
                <a-menu
                    theme="dark"
                    mode="horizontal"
                    :style="{ lineHeight: '64px' }"
                >
                    <a-menu-item key="index">
                        <RouterLink to="/">首页</RouterLink>
                    </a-menu-item>
                    <a-menu-item key="books">
                        <RouterLink to="/admin/book">书籍管理</RouterLink>
                    </a-menu-item>
                    <a-menu-item key="category">
                        <RouterLink to="/admin/category">分类管理</RouterLink>
                    </a-menu-item>
                    <a-menu-item key="about">
                        <RouterLink to="/about">关于我们</RouterLink>
                    </a-menu-item>
                </a-menu>
            </div>
            <div>
                <RouterLink to="/login" v-if="!user">
                    <a-button class="login-btn" type="primary" ghost @click="login">登录</a-button>
                </RouterLink>
                <a-dropdown>
                    <a class="ant-dropdown-link" @click.prevent>
                        欢迎，{{ user?.userName }}
                        <DownOutlined />
                    </a>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item>
                                <a-button ghost type="primary" @click="reset">
                                    重置密码
                                </a-button>
                            </a-menu-item>
                            <a-menu-item>
                                <a-button ghost type="primary" @click="logout">
                                    退出登录
                                </a-button>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </a-layout-header>
        <a-layout-content>
               <RouterView />
        </a-layout-content>
        <a-layout-footer style="text-align: center">
            ChuShi Wiki ©2024 Created by Little Monster
        </a-layout-footer>
    </a-layout>
    
    <a-modal v-model:open="open" title="重置密码" @ok="handleOk">
        <a-input-password placeholder="请输入旧密码" class="input" v-model:value="oldPassword" />
        <a-input-password placeholder="请输入新密码" class="input" v-model:value="newPassword" />
        <a-input-password placeholder="请再次确认密码" class="input" v-model:value="confirmPassword" />
    </a-modal>
</template>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-content: center;
}
#components-layout-demo-top-side .logo {
    float: left;
    width: 120px;
    height: 31px;
    margin: 16px 24px 16px 0;
    background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side .logo {
    float: right;
    margin: 16px 0 16px 24px;
}

.site-layout-background {
    background: #fff;
}
.input {
    margin: 10px 0;
}
</style>
