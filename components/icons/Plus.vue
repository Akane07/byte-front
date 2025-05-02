<template>
    <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 4.5H8.5" :stroke="color ? color : 'url(#paint0_linear_298_807)'" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" />
        <path d="M5 8V1" :stroke="color ? color :  'url(#paint1_linear_298_807)'" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" />
        <defs>
            <linearGradient id="paint0_linear_298_807" x1="5" y1="4.5" x2="5" y2="5.5" gradientUnits="userSpaceOnUse">
                <stop stop-color="#D27FBA" />
                <stop offset="1" :stop-color="color" />
            </linearGradient>
            <linearGradient id="paint1_linear_298_807" x1="5.5" y1="1" x2="5.5" y2="8" gradientUnits="userSpaceOnUse">
                <stop stop-color="#D27FBA" />
                <stop offset="1" :stop-color="color" />
            </linearGradient>
        </defs>
    </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    color?: string
}>(), {
    color: '#AE6CD7'
});
</script>