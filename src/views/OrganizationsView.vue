<script setup>
import {useOrganizationStore} from "@/stores/organization.js";
import {ref, watch} from "vue";
import PaginatorComponent from "@/components/PaginatorComponent.vue";
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()
const organizationStore = useOrganizationStore()
const filters = ref({
    page: route.params.page || 1,
    itemsPerPage: route.params['items-per-page'] || 10
})
const isOpenAdd = ref(false)
const isOpenEdit = ref(false)
const isOpenDelete = ref(false)
const current = ref()
const newOrganization = ref({
    uz: '',
    ru: ''
})


watch(
    [() => filters.value],
    async () => {
        const queryFilter = {
            page: filters.value.page,
            "items-per-page": filters.value.itemsPerPage,
        };


        await updateQuery(queryFilter);

        await organizationStore.fetchOrganizations(route.query);
    },
    { immediate: true, deep: true },
);

// Functions
async function updateQuery(newParams) {
    await router.push({
        query: {
            ...newParams,
        },
    });
}

function add() {
    organizationStore.pushOrganization({ name: newOrganization.value})
        .then(() => {
            organizationStore.fetchOrganizations(route.query)
            isOpenAdd.value = false
            newOrganization.value.uz = ''
            newOrganization.value.ru = ''
        })
}

function editAction(id) {
    current.value = id
    organizationStore.fetchOrganization(id)
        .then(() => {
            organizationStore.fetchOrganizations(route.query)
            newOrganization.value.uz = organizationStore.getOrganization.name.uz
            newOrganization.value.ru = organizationStore.getOrganization.name.ru
            isOpenEdit.value = true
        })
}
function edit() {
    organizationStore.editOrganization({ name: newOrganization.value}, current.value)
        .then(() => {
            organizationStore.fetchOrganizations(route.query)
            newOrganization.value.uz = ''
            newOrganization.value.ru = ''
            current.value = ''
            isOpenEdit.value = false
        })
}

function deleteAction(id) {
    isOpenDelete.value = true
    current.value = id
}

function deleteItem() {
    organizationStore.deleteOrganization(current.value)
        .then(() => {
            isOpenDelete.value = false
            organizationStore.fetchOrganizations(route.query)
        })
}
</script>

<template>
    <div @click.self="isOpenAdd = false" v-show="isOpenAdd" class="fixed bg-black/30 inset-0 flex justify-center items-center">
        <form @submit.prevent="add" class="bg-white p-10 flex flex-col gap-5 sm:min-w-100 rounded">
            <h2 class="text-2xl">Tashkilot qo'shish</h2>

            <label>
                <span class="block">O'zbekcha nomi</span>
                <input required v-model="newOrganization.uz" class="border w-full px-2.5 py-2 rounded border-gray-400" type="text" placeholder="O'zbekcha nomi">
            </label>
            <label>
                <span class="block">Ruscha nomi</span>
                <input required v-model="newOrganization.ru" class="border w-full px-2.5 py-2 rounded border-gray-400" type="text" placeholder="Ruscha nomi">
            </label>

            <button type="submit" class="bg-primary mt-5 px-3 py-1.5 cursor-pointer hover:opacity-75 transition-all text-white rounded">Qo'shish</button>
        </form>
    </div>
    <div @click.self="isOpenEdit = false" v-show="isOpenEdit" class="fixed bg-black/30 inset-0 flex justify-center items-center">
        <form @submit.prevent="edit" class="bg-white p-10 flex flex-col gap-5 sm:min-w-100 rounded">
            <h2 class="text-2xl">Tashkilotni o'zgartirish</h2>

            <label>
                <span class="block">O'zbekcha nomi</span>
                <input required v-model="newOrganization.uz" class="border w-full px-2.5 py-2 rounded border-gray-400" type="text" placeholder="O'zbekcha nomi">
            </label>
            <label>
                <span class="block">Ruscha nomi</span>
                <input required v-model="newOrganization.ru" class="border w-full px-2.5 py-2 rounded border-gray-400" type="text" placeholder="Ruscha nomi">
            </label>

            <button type="submit" class="bg-primary mt-5 px-3 py-1.5 cursor-pointer hover:opacity-75 transition-all text-white rounded">O'zgartirish</button>
        </form>
    </div>
    <div @click.self="isOpenDelete = false" v-show="isOpenDelete" class="fixed bg-black/30 inset-0 flex justify-center items-center">
        <div class="bg-white p-10 flex flex-col gap-5 sm:min-w-100 rounded">
            <h2 class="text-2xl">Siz rosdan ham ushbu tashkilotni o'chirmoqchimisiz?</h2>

            <div class="flex gap-5 justify-end">
                <button @click="isOpenDelete = false" type="submit" class="w-20 bg-primary mt-5 px-3 py-1.5 cursor-pointer hover:opacity-75 transition-all text-white rounded">Yo'q</button>
                <button @click="deleteItem" type="submit" class="w-20 bg-primary mt-5 px-3 py-1.5 cursor-pointer hover:opacity-75 transition-all text-white rounded">Ha</button>
            </div>
        </div>
    </div>
    <main class="flex flex-col h-full gap-5">
        <div class="flex items-center justify-between">
            <h2 class="text-2xl">Tashkilotlar</h2>
            <button @click="isOpenAdd = true" class="bg-primary px-3 py-1.5 cursor-pointer hover:opacity-75 transition-all text-white rounded">Qo'shish</button>
        </div>
        <p v-if="organizationStore.getOrganizations.totalItems < 1" class="text-center my-auto text-gray-400">Hozircha hech narsa yo'q</p>
        <div v-else class="border rounded border-gray-400 overflow-x-auto w-full">
            <table class="table-auto w-full">
                <thead>
                <tr class="border-b">
                    <th class="px-5 py-4 text-start">Id</th>
                    <th class="text-start">Nomi</th>
                    <th class="text-start">Ijobiy ovozlar</th>
                    <th class="text-start">Salbiy ovozlar</th>
                    <th class="pr-5 text-end">Amallar</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(organization, index) of organizationStore.getOrganizations.models" :key="organization.id" class="not-last:border-b border-gray-400">
                    <td class="pl-5">{{ index + 1 }}</td>
                    <td>{{ organization.name }}</td>
                    <td>{{ organization.negativeCount }}</td>
                    <td>{{ organization.positiveCount }}</td>
                    <td>
                        <div class="flex justify-end m-2 gap-2">
                            <button @click="editAction(organization.id)" class="p-2 rounded bg-orange-500 text-white cursor-pointer hover:opacity-75 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                                        <path d="M19.09 14.441v4.44a2.37 2.37 0 0 1-2.369 2.369H5.12a2.37 2.37 0 0 1-2.369-2.383V7.279a2.356 2.356 0 0 1 2.37-2.37H9.56" />
                                        <path d="M6.835 15.803v-2.165c.002-.357.144-.7.395-.953l9.532-9.532a1.36 1.36 0 0 1 1.934 0l2.151 2.151a1.36 1.36 0 0 1 0 1.934l-9.532 9.532a1.36 1.36 0 0 1-.953.395H8.197a1.36 1.36 0 0 1-1.362-1.362M19.09 8.995l-4.085-4.086" />
                                    </g>
                                </svg>
                            </button>
                            <button @click="deleteAction(organization.id)" class="p-2 rounded bg-red-500 text-white cursor-pointer hover:opacity-75 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
                                    <path fill="currentColor" d="M13.5 6.5V7h5v-.5a2.5 2.5 0 0 0-5 0m-2 .5v-.5a4.5 4.5 0 1 1 9 0V7H28a1 1 0 1 1 0 2h-1.508L24.6 25.568A5 5 0 0 1 19.63 30h-7.26a5 5 0 0 1-4.97-4.432L5.508 9H4a1 1 0 0 1 0-2zM9.388 25.34a3 3 0 0 0 2.98 2.66h7.263a3 3 0 0 0 2.98-2.66L24.48 9H7.521zM13 12.5a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0v-10a1 1 0 0 1 1-1m7 1a1 1 0 1 0-2 0v10a1 1 0 1 0 2 0z" />
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="flex w-full">
            <div class="ml-auto">
                <PaginatorComponent
                    v-model="filters.page"
                    v-model:items-per-page="filters.itemsPerPage"
                    :total-items="organizationStore.getOrganizations.totalItems"
                />
            </div>
        </div>
    </main>
</template>
