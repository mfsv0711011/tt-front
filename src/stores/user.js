import {defineStore} from "pinia";
import {authorizedClient} from "@/api/axios.js";
import {useRouter} from "vue-router";

export const useUserStore = defineStore('user', () => {
    const router = useRouter()

    const auth = async (authData) => {
        try {
            const { data } = await authorizedClient.post('/users/auth', authData)
            localStorage.setItem('tt_accessToken', data.accessToken)
            localStorage.setItem('tt_refreshToken', data.refreshToken)
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
        logout
    }
})