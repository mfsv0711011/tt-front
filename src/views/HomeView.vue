<script setup>
import {useOrganizationStore} from "@/stores/organization.js";
import {onMounted, ref, watch} from "vue";
import {useSurveyStore} from "@/stores/survey.js";
import {useSubmissionStore} from "@/stores/submission.js";
import {vIntersectionObserver} from "@vueuse/components";

const organizationStore = useOrganizationStore()
const surveyStore = useSurveyStore()
const submissionStore = useSubmissionStore()

const selectedOrganization = ref(null)
const selectedAnswers = ref({})
const isSuccess = ref(false)
const isOpen = ref(false)
const root = ref(null)
const organizationPage = ref(1)
const organizations = ref([])

onMounted(async () => {
    await organizationStore.fetchOrganizations({ page: 1 })
    organizations.value = organizationStore.getOrganizations.models

    await Promise.allSettled([
        surveyStore.fetchSurvey(),
        surveyStore.fetchAnswerOptions()
    ])
})

const setOrganization = id => {
    selectedOrganization.value = id
}

const send = () => {
    if (!selectedOrganization.value) {
        alert("Iltimos, tashkilotni tanlang");
        return;
    }
    if (Object.entries(selectedAnswers.value).length !== 3) {
        alert("Iltimos, javoblarni belgilan");
        return;
    }
    if (!selectedOrganization.value.id) {
        alert("Iltimos, tashkilotni tanlang");
        return;
    }

    const payload = {
        survey: "/api/surveys/1",
        organization: `/api/organizations/${selectedOrganization.value.id}`,
        answers: Object.entries(selectedAnswers.value).map(([questionId, answerOptionId]) => ({
            question: `/api/questions/${questionId}`,
            answerOption: answerOptionId
        }))
    }

    submissionStore.pushSubmission(payload)
        .then(() => {
            selectedOrganization.value = ''
            selectedAnswers.value = {}
            isSuccess.value = true
        })
}
const isVisible = ref(false)

watch(isVisible, async () => {
    if (isVisible.value) {
        organizationPage.value++
        await organizationStore.fetchOrganizations({ page: organizationPage.value })
        organizations.value = [...organizations.value, ...organizationStore.getOrganizations.models]
    }
})

function onIntersectionObserver([entry]) {
    isVisible.value = entry?.isIntersecting || false
}
</script>

<template>
    <div class="bg-[#F0F4F8] min-h-dvh">
        <div v-show="isSuccess" class="fixed inset-0 bg-black/30 z-50 grid place-content-center">
            <div class="bg-white p-10 rounded">
                <p class="text-2xl mb-5">Javoblaringiz muvaffaqiyatli jo'natildi!</p>

                <button @click="isSuccess = false" class="bg-primary mt-5 px-3 py-2 cursor-pointer hover:opacity-75 transition-all text-white text-2xl rounded w-full">Yo'pish</button>
            </div>
        </div>
        <main class="container mx-auto flex min-h-dvh justify-center items-center">
            <div class="relative rounded-lg md:bg-white p-4 sm:p-10 w-full md:w-fit md:min-w-200 border-transparent sm:border md:border-gray-300">
                <div class="bg-[url(/111-01.png)] bg-cover absolute inset-0 opacity-15"></div>
                <div class="relative z-20">
                    <h2 class="text-5xl text-center font-medium mb-10">So'rovnoma</h2>
                    <p class="text-4xl text-center mb-5">Fuqaro nima deydi?</p>
                    <button @click.stop="isOpen = !isOpen" class="text-2xl text-start whitespace-nowrap relative px-3 cursor-pointer py-3.5 border rounded flex gap-2 items-center w-full justify-between">
                        <span>{{ selectedOrganization?.name || 'Tashkilotni tanlang' }}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9l-7 7l-7-7" />
                        </svg>

                        <span ref="root" class="absolute top-full mt-1 left-0 overflow-auto flex flex-col bg-white shadow inset-0" :class="{'h-50': isOpen && organizations.length > 3, 'h-0': !isOpen, 'h-fit py-4': isOpen && organizations.length < 3}">
                            <button
                                v-if="organizations.length"
                                @click="setOrganization(organization)"
                                class="py-4 text-start px-3 hover:bg-primary hover:text-white"
                                v-for="organization of organizations"
                                :key="organization.id"
                            >
                                {{ organization.name }}
                            </button>
                            <span class="px-4 text-center text-gray-500 py-2" v-else>Hech narsa topilmadi</span>
                            <span v-if="organizationStore.getOrganizations.totalItems > organizations.length" v-intersection-observer="onIntersectionObserver">
                                <svg class="animate-spin text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                                    <path fill="currentColor" d="M2.501 8a5.5 5.5 0 1 1 5.5 5.5A.75.75 0 0 0 8 15a7 7 0 1 0-7-7a.75.75 0 0 0 1.501 0" stroke-width="1" stroke="currentColor" />
                                </svg>
                            </span>
                        </span>
                    </button>

                    <div class="flex flex-col gap-10 py-10">
                        <div v-for="question of surveyStore.getSurvey.questions" :key="question.id">
                            <p class="text-3xl mb-2">{{question.text}}</p>
                            <div>
                                <label v-for="answerOption of surveyStore.getAnswerOptions.models" :key="answerOption.id" class="flex items-center gap-2 cursor-pointer">
                                    <input v-model="selectedAnswers[question.id]" class="size-5" type="radio" :name="question.id" :value="`/api/answer_options/${answerOption.id}`">
                                    <span class="text-2xl">{{ answerOption.label }}</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <button @click="send" class="bg-primary mt-5 px-3 py-2 cursor-pointer hover:opacity-75 transition-all text-white text-2xl rounded w-full">Jo'natish</button>
                </div>
            </div>
        </main>
    </div>
</template>
