<template>
    <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M11.875 3.23917C10.0713 3.06042 8.25667 2.96834 6.4475 2.96834C5.375 2.96834 4.3025 3.0225 3.23 3.13084L2.125 3.23917"
            :stroke="color" stroke-linecap="round" stroke-linejoin="round" />
        <path
            d="M5.10425 2.69208L5.22341 1.98249C5.31008 1.46791 5.37508 1.08333 6.2905 1.08333H7.70966C8.62508 1.08333 8.6955 1.48958 8.77675 1.98791L8.89591 2.69208"
            :stroke="color" stroke-linecap="round" stroke-linejoin="round" />
        <path
            d="M10.7104 4.95084L10.3583 10.4054C10.2987 11.2558 10.25 11.9167 8.73872 11.9167H5.26122C3.74997 11.9167 3.70122 11.2558 3.64163 10.4054L3.28955 4.95084"
            :stroke="color" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6.09546 8.9375H7.89921" :stroke="color" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M5.64575 6.77083H8.35409" :stroke="color" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    color?: string
}>(), {
    color: '#2E2E2E'
})
</script>