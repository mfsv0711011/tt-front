import {defineStore} from "pinia";
import {authorizedClient} from "@/api/axios.js";
import {useRouter} from "vue-router";
import {computed, ref} from "vue";

export const useUserStore = defineStore('user', () => {
    const router = useRouter()
    const users = ref({
        models: [],
        totalItems: 0
    })

    const auth = async (authData) => {
        try {
            const { data } = await authorizedClient.post('/users/auth', authData)
            localStorage.setItem('tt_accessToken', data.accessToken)
            localStorage.setItem('tt_refreshToken', data.refreshToken)
        } catch (e) {
            throw e
        }
    }
    const fetchUsers = async () => {
        try {
            const { data } = await authorizedClient.get('/users')
            users.value.models = data.member
            users.value.totalItems = data.totalItems
        } catch (e) {
            throw e
        }
    }
    const pushUsers = async (userData) => {
        try {
            return await authorizedClient.post('/users', userData)
        } catch (e) {
            throw e
        }
    }
    const deleteUsers = async (id) => {
        try {
            return await authorizedClient.delete('/users/' + id)
        } catch (e) {
            throw e
        }
    }

    const logout = async () => {
        localStorage.removeItem('tt_accessToken')
        localStorage.removeItem('tt_refreshToken')
        await router.push({ name: 'home'})
    }

    return {
        auth,
        logout,
        fetchUsers,
        pushUsers,
        deleteUsers,
        getAboutMeFromToken: computed(() => JSON.parse(atob(localStorage.getItem('tt_accessToken').split('.')[1]))),
        users
    }
})