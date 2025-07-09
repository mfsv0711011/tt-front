import {defineStore} from "pinia";
import {computed, reactive, ref} from "vue";
import {authorizedClient} from "@/api/axios.js";

export const useOrganizationStore = defineStore('organization', () => {
    const state = reactive({
        organization: {},
        organizations: {
            models: [],
            totalItems: 0
        }
    })

    const fetchOrganization = async id => {
        try {
            const { data } = await authorizedClient.get('/organizations/' + id)
            state.organization = data
        } catch (err) {
            throw err
        }
    }

    const fetchOrganizations = async (params = { page: 1 }) => {
        try {
            const { data } = await authorizedClient.get('/organizations', { params })
            state.organizations.models = data['member']
            state.organizations.totalItems = data.totalItems
        } catch (err) {
            throw err
        }
    }

    const pushOrganization = async (newOrganization) => {
        try {
            return await authorizedClient.post('/organizations', newOrganization)
        } catch (err) {
            throw err
        }
    }

    const editOrganization = async (newOrganization, id) => {
        try {
            return await authorizedClient.patch('/organizations/' + id, newOrganization)
        } catch (err) {
            throw err
        }
    }

    const deleteOrganization = async (id) => {
        try {
            return await authorizedClient.delete('/organizations/'+ id)
        } catch (err) {
            throw err
        }
    }

    return {
        fetchOrganization,
        fetchOrganizations,
        pushOrganization,
        editOrganization,
        deleteOrganization,
        getOrganization: computed(() => state.organization),
        getOrganizations: computed(() => state.organizations)
    }
})