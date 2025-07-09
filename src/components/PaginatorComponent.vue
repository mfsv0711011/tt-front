<script setup>
import { computed } from 'vue';

const props = defineProps({
    totalItems: {
        type: Number,
        required: true,
    }
});

const current = defineModel();
const itemsPerPage = defineModel('items-per-page');

const totalPages = computed(() => {
    return Math.ceil(props.totalItems / (itemsPerPage.value || 10));
});

function changePage(page) {
    if (page >= 1 && page <= totalPages.value) {
        current.value = page;
    }
}

const visiblePages = computed(() => {
    const total = totalPages.value;
    const delta = 1;
    const range = [];

    for (let i = Math.max(2, current.value - delta); i <= Math.min(total - 1, current.value + delta); i++) {
        range.push(i);
    }

    if (current.value - delta > 2) range.unshift('...');
    if (current.value + delta < total - 1) range.push('...');

    range.unshift(1);
    if (total > 1) range.push(total);

    return range.map((p, index) => ({ key: `${p}-${index}`, page: p }));
});
</script>

<template>
    <div class="flex flex-col md:flex-row flex-wrap items-center gap-4 w-full">
        <nav class="hidden md:flex justify-center items-center gap-1" :class="{ 'hidden md:hidden': totalPages < 2}">
            <button
                :disabled="current === 1"
                @click="changePage(current - 1)"
                class="cursor-pointer flex justify-center items-center size-8! rounded-md! bg-transparent! border-none text-surface-700!"
                :class="{ 'hover:bg-primary/20!': current !== totalItems }"
            >
                <svg :class="{ 'text-gray-400': current === 1 }" xmlns="http://www.w3.org/2000/svg" width="0.48em" height="1em" viewBox="0 0 608 1280">
                    <path fill="currentColor" d="M595 288q0 13-10 23L192 704l393 393q10 10 10 23t-10 23l-50 50q-10 10-23 10t-23-10L23 727q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23" />
                </svg>
            </button>

            <template v-for="page in visiblePages" :key="page.key">
                <button
                    v-if="page.page !== '...'"
                    @click="changePage(page.page)"
                    class="flex justify-center items-center size-8 rounded-md! bg-transparent border border-gray-300 text-black cursor-pointer hover:bg-primary/20"
                    :class="{ 'bg-primary! text-white': current === page.page }"
                >
                    {{page.page}}
                </button>
                <span v-else class="px-2 py-1 text-sm text-gray-500">...</span>
            </template>

            <button
                :disabled="current === totalPages"
                @click="changePage(current + 1)"
                class="cursor-pointer flex justify-center items-center size-8! rounded-md! bg-transparent! border-none text-surface-700!"
                :class="{ 'hover:bg-primary/20!': current !== totalItems }"
            >
                <svg :class="{ 'text-gray-400': current === totalPages }" class="rotate-180" xmlns="http://www.w3.org/2000/svg" width="0.48em" height="1em" viewBox="0 0 608 1280">
                    <path fill="currentColor" d="M595 288q0 13-10 23L192 704l393 393q10 10 10 23t-10 23l-50 50q-10 10-23 10t-23-10L23 727q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23" />
                </svg>
            </button>
        </nav>
        <nav class="md:hidden w-full flex items-center gap-4 justify-end" :class="{ 'hidden md:hidden': totalPages < 2}">
            <button
                :disabled="current === 1"
                @click="changePage(current - 1)"
                class="rounded-md! w-full! sm:w-fit! px-4! flex! justify-center! items-center! border-gray-300! bg-transparent! text-black"
                :class="{ 'hover:bg-primary text-white!': current !== totalItems }"
            >
                <svg :class="{ 'text-red-500': current === 1 }" xmlns="http://www.w3.org/2000/svg" width="0.48em" height="1em" viewBox="0 0 608 1280">
                    <path fill="currentColor" d="M595 288q0 13-10 23L192 704l393 393q10 10 10 23t-10 23l-50 50q-10 10-23 10t-23-10L23 727q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23" />
                </svg>
                <span>Prev</span>
            </button>

            <button
                :disabled="current === totalPages"
                @click="changePage(current + 1)"
                class="rounded-md! w-full! sm:w-fit! px-4! flex! justify-center! items-center! border-surface-300! dark:border-surface-600/50! bg-transparent! dark:bg-transparent! text-surface-700! dark:text-surface-0!"
                :class="{ 'hover:bg-main-hover! dark:hover:bg-green-hover! text-surface-0!': current !== totalItems }"
            >
                <span>Next</span>
                <svg class="rotate-180" xmlns="http://www.w3.org/2000/svg" width="0.48em" height="1em" viewBox="0 0 608 1280">
                    <path fill="currentColor" d="M595 288q0 13-10 23L192 704l393 393q10 10 10 23t-10 23l-50 50q-10 10-23 10t-23-10L23 727q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23" />
                </svg>
            </button>
        </nav>
    </div>
</template>
