<script setup>
import {useOrganizationStore} from "@/stores/organization.js";
import {onMounted, ref} from "vue";
import {useSurveyStore} from "@/stores/survey.js";
import {useSubmissionStore} from "@/stores/submission.js";

const organizationStore = useOrganizationStore()
const surveyStore = useSurveyStore()
const submissionStore = useSubmissionStore()

const selectedOrganization = ref(null)
const selectedAnswers = ref({})

onMounted(() => {
    organizationStore.fetchOrganizations({ pagination: false })
    surveyStore.fetchSurvey()
    surveyStore.fetchAnswerOptions()
})

const setOrganization = event => {
    selectedOrganization.value = event.target.value
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

    const payload = {
        survey: "/api/surveys/1",
        organization: selectedOrganization.value,
        answers: Object.entries(selectedAnswers.value).map(([questionId, answerOptionId]) => ({
            question: `/api/questions/${questionId}`,
            answerOption: answerOptionId
        }))
    }

    submissionStore.pushSubmission(payload)
        .then(() => {
            selectedOrganization.value = ''
            selectedAnswers.value = {}
        })
}
</script>

<template>
    <div class="bg-[#F0F4F8] min-h-dvh">
        <main class="container mx-auto flex min-h-dvh justify-center items-center">
            <div class="relative rounded-lg md:bg-white p-4 sm:p-10 w-full md:w-fit md:min-w-200 border-transparent sm:border md:border-gray-300">
                <div class="bg-[url(/111-01.png)] bg-cover absolute inset-0 opacity-15"></div>
                <div class="relative z-20">
                    <h2 class="text-5xl text-center font-medium mb-10">So'rovnoma</h2>
                    <p class="text-4xl text-center mb-5">Fuqaro nima deydi?</p>
                    <select @change="setOrganization" class="p-3 border rounded appearance-auto text-2xl">
                        <option value="Tashkilotni tanlang" disabled selected class="text-gray-400">Tashkilotni tanlang</option>
                        <option
                            v-for="organization of organizationStore.getOrganizations.models"
                            :key="organization.id"
                            :value="`/api/organizations/${organization.id}`"
                            class="text-gray-400 truncate"
                        >
                            {{ organization.name }}
                        </option>
                    </select>

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
