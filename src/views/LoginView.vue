<script setup>
import {useUserStore} from "@/stores/user.js";
import {ref} from "vue";
import {useRouter} from "vue-router";

const userStore = useUserStore()
const router = useRouter()
const form = ref({
    email: '',
    password: ''
})

const auth = () => {
    userStore.auth(form.value)
        .then(() => {
            router.push({ name: 'admin' })
        })
}
</script>

<template>
    <div class="bg-[#F0F4F8]">
        <main class="container mx-auto grid place-content-center min-h-dvh">
            <form @submit.prevent="auth" class="flex flex-col p-5 sm:p-10 sm:border rounded gap-10 w-dvw sm:w-fit sm:min-w-100 border-gray-400">
                <h2 class="text-2xl text-center -mb-5">Kirish</h2>

                <label class="block">
                    <span class="block">Login</span>
                    <input class="border w-full px-2.5 py-2 rounded border-gray-400" v-model="form.email" placeholder="user@example.uz">
                </label>

                <label class="block">
                    <span class="block">Parol</span>
                    <input class="border w-full px-2.5 py-2 rounded border-gray-400" v-model="form.password" type="password" placeholder="********">
                </label>

                <div>
                    <button class="border w-full px-2.5 py-2 rounded border-gray-400 cursor-pointer text-white bg-primary transition-all hover:opacity-75">Kirish</button>
                </div>
            </form>
        </main>
    </div>
</template>
