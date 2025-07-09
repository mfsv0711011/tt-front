import {defineStore} from "pinia";
import {computed, reactive} from "vue";
import {authorizedClient} from "@/api/axios.js";

export const useSurveyStore = defineStore('survey', () => {
    const state = reactive({
        submission: {},
        answerOptions: {
            models: [],
            totalItems: 0
        }
    })

    const fetchSurvey = async () => {
        try {
            const { data } = await authorizedClient.get('/surveys', { params: { page: 1 } })
            state.submission = data
        } catch (err) {
            throw err
        }
    }

    const fetchAnswerOptions = async () => {
        try {
            const { data } = await authorizedClient.get('/answer_options', { params: { page: 1 } })
            state.answerOptions.models = data.member
            state.answerOptions.totalItems = data.totalItems
        } catch (err) {
            throw err
        }
    }


    return {
        fetchSurvey,
        fetchAnswerOptions,
        getSurvey: computed(() => state.submission),
        getAnswerOptions: computed(() => state.answerOptions),
    }
})