import {defineStore} from "pinia";
import {computed, reactive, ref} from "vue";
import {authorizedClient} from "@/api/axios.js";

export const useSubmissionStore = defineStore('submission', () => {
    const state = reactive({
        submission: {},
        submissions: {
            models: [],
            totalItems: 0
        }
    })

    const fetchSubmission = async id => {
        try {
            const { data } = await authorizedClient.get('/submissions/' + id)
            state.submission = data
        } catch (err) {
            throw err
        }
    }

    const fetchSubmissions = async (params = { page: 1 }) => {
        try {
            const { data } = await authorizedClient.get('/submissions', { params: {...params, 'order[id]': 'desc'} })
            state.submissions.models = data['member']
            state.submissions.totalItems = data.totalItems
        } catch (err) {
            throw err
        }
    }

    const pushSubmission = async (newOrganization) => {
        try {
            return await authorizedClient.post('/submissions', newOrganization)
        } catch (err) {
            throw err
        }
    }

    const editSubmission = async (newOrganization, id) => {
        try {
            return await authorizedClient.patch('/submissions/' + id, newOrganization)
        } catch (err) {
            throw err
        }
    }

    const deleteSubmission = async (id) => {
        try {
            return await authorizedClient.delete('/submissions/'+ id)
        } catch (err) {
            throw err
        }
    }

    return {
        fetchSubmission,
        fetchSubmissions,
        pushSubmission,
        editSubmission,
        deleteSubmission,
        getSubmission: computed(() => state.submission),
        getSubmissions: computed(() => state.submissions)
    }
})