<script setup>
import {ref, watch} from "vue";
import PaginatorComponent from "@/components/PaginatorComponent.vue";
import {useRoute, useRouter} from "vue-router";
import {useSubmissionStore} from "@/stores/submission.js";

const route = useRoute()
const router = useRouter()
const submissionStore = useSubmissionStore()
const filters = ref({
    page: route.params.page || 1,
    itemsPerPage: route.params['items-per-page'] || 10
})
const isOpenAdd = ref(false)
const isOpenEdit = ref(false)
const isOpenDelete = ref(false)
const current = ref()
const newSubmission = ref({
    uz: '',
    ru: ''
})

const formatedDate = isoDate => {
    const date = new Date(isoDate);

// Tashkent vaqti olish
    const options = { timeZone: "Asia/Tashkent" };
    const tzDate = new Date(date.toLocaleString("en-US", options));

    const pad = (num) => String(num).padStart(2, "0");

    return `${pad(tzDate.getDate())}.${pad(tzDate.getMonth() + 1)}.${tzDate.getFullYear()} ${pad(tzDate.getHours())}:${pad(tzDate.getMinutes())}`;
}

watch(
    [() => filters.value],
    async () => {
        const queryFilter = {
            page: filters.value.page,
            "items-per-page": filters.value.itemsPerPage,
        };

        await updateQuery(queryFilter);

        await submissionStore.fetchSubmissions(route.query);
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
    submissionStore.pushSubmission({ name: newSubmission.value})
        .then(() => {
            submissionStore.fetchSubmissions(route.query)
            isOpenAdd.value = false
            newSubmission.value.uz = ''
            newSubmission.value.ru = ''
        })
}

function editAction(id) {
    current.value = id
    submissionStore.fetchSubmission(id)
        .then(() => {
            submissionStore.fetchSubmissions(route.query)
            newSubmission.value.uz = submissionStore.getSubmission.name.uz
            newSubmission.value.ru = submissionStore.getSubmission.name.ru
            isOpenEdit.value = true
        })
}
function edit() {
    submissionStore.editSubmission({ name: newSubmission.value}, current.value)
        .then(() => {
            submissionStore.fetchSubmissions(route.query)
            newSubmission.value.uz = ''
            newSubmission.value.ru = ''
            current.value = ''
            isOpenEdit.value = false
        })
}

function deleteAction(id) {
    isOpenDelete.value = true
    current.value = id
}

function deleteItem() {
    submissionStore.deleteSubmission(current.value)
        .then(() => {
            isOpenDelete.value = false
            submissionStore.fetchSubmissions(route.query)
        })
}
</script>

<template>

    <main class="flex flex-col h-full gap-5">
        <div class="flex items-center justify-between">
            <h2 class="text-2xl">Ovozlar</h2>
        </div>
        <p v-if="submissionStore.getSubmissions.totalItems < 1" class="text-center my-auto text-gray-400">Hozircha hech narsa yo'q</p>
        <div v-else class="border rounded border-gray-400 overflow-x-auto w-full">
            <table class="table-auto w-full">
                <thead>
                <tr class="border-b">
                    <th class="px-5 py-4 text-start">Id</th>
                    <th class="text-start">Tashkilot</th>
                    <th class="text-start">Savollar</th>
                    <th class="text-start">Javoblar</th>
                    <th class="text-start whitespace-nowrap px-5">Jo'natilgan vaqti</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(submission, index) of submissionStore.getSubmissions.models" :key="submission.id" class="not-last:border-b border-gray-400">
                    <td class="pl-5">{{ index + 1 }}</td>
                    <td>{{ submission.organization.name.uz }}, {{ submission.organization.name.ru }}</td>
                    <td>
                        <p v-for="question of submission.answers.map(answer => `${answer.question.id}. ${answer.question.text}`)" :key="question.id">{{ question }}</p>
                    </td>
                    <td>
                        <p v-for="answer of submission.answers.map(answerItem => `${answerItem.answerOption.label}`)" :key="answer.id">{{ answer }}</p>
                    </td>
                    <td class="px-5">
                        <p>{{ formatedDate(submission.createdAt) }}</p>
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
                    :total-items="submissionStore.getSubmissions.totalItems"
                />
            </div>
        </div>
    </main>
</template>
