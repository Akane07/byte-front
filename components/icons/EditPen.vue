<template>
    <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M2.39578 11.1042C2.84536 11.5537 3.5712 11.5537 4.02078 11.1042L11.0624 4.0625C11.512 3.61292 11.512 2.88708 11.0624 2.4375C10.6129 1.98792 9.88703 1.98792 9.43745 2.4375L2.39578 9.47917C1.9462 9.92875 1.9462 10.6546 2.39578 11.1042Z"
            :stroke="color" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M10.2554 4.86958L8.63037 3.24458" :stroke="color" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    color?: string
}>(), {
    color: '#171717'
})
</script>