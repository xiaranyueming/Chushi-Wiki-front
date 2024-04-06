<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import {notification} from 'ant-design-vue';
import { loginApi, registerApi } from "@/apis/user.js";
import { useRouter } from "vue-router";

const router = useRouter()
const type = ref('login')
const userName = ref('')
const password = ref('')


const handleClick = () => {
    type.value = type.value === 'login' ? 'register' : 'login'
}

const login = async () => {
    if (!userName.value || !password.value) {
        message.error('用户名或密码不能为空')
        return
    }
    if (password.value.length < 4 || password.value.length > 32) {
        message.error('密码长度为4-32位')
        return
    }
    if (type.value === 'login') {
        // 登录
        const res = await loginApi(
            { userName: userName.value, password: password.value }
        )
        if (res.code === 200) {
            notification.success({
                message: '登录成功',
            })
            localStorage.setItem('user', JSON.stringify(res.data))
            setTimeout(() => {
                router.push('/')
            }, 500)
        } else {
            notification.error({
                message: '登录失败',
                description: res.message,
            })
        }
    } else {
        // 注册
        const res = await registerApi(
            { userName: userName.value, password: password.value }
        )
        if (res.code === 200) {
            notification.success({
                message: '注册成功',
            })
            type.value = 'login'
        } else {
            notification.error({
                message: '注册失败',
                description: res.message,
            })
        }
    }
}

</script>

<template>
    <div class="login">
        <div class="left">
            <img class="pic" src="@/assets/wiki.jpg" alt="">
        </div>
        <div class="right">
            <div class="title">{{ type === 'login' ? '登录' : '注册' }}</div>
            <div class="input">
                <div class="text">用户名：</div>
                <a-input allow-clear v-model:value="userName" placeholder="请输入用户名" />
            </div>
            <div class="input">
                <div class="text">密码：</div>
                <a-input-password v-model:value="password" placeholder="请输入密码" />
            </div>
            <div style="margin-left: 220px; color: red; font-size: 8px"
                @click="handleClick"
            >
                {{ type === 'login' ? '还没账号，点击注册' : '已有账号，点击登录' }}
            </div>
            <a-button class="btn" type="primary" ghost @click="login">
                {{ type === 'login' ? '登录' : '注册' }}
            </a-button>
        </div>
    </div>
</template>

<style scoped>
.login {
    display: flex;
    align-content: center;
}
.pic {
    width: 600px;
    margin: 25px 0 0 100px;
}
.right {
    width: 300px;
    margin: 200px 0 0 150px;
}
.title {
    text-align: center;
    font-size: 20px;
}
.input {
    margin: 20px 0;
    display: flex;
    align-content: center;
}
.text {
    width: 120px;
    padding: 4px 11px;
}
.btn {
    width: 120px;
    display: block;
    margin: 15px auto 0;
}
</style>
