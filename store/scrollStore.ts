export const useScroll = defineStore('scroll', () => {
    const showScroll = shallowRef(true);

    watch(showScroll, () => {
        if (showScroll.value) {
            document.body.style.overflow = 'auto';
        }
        if (!showScroll.value) {
            document.body.style.overflow = 'hidden';
        }
    });

    return {
        showScroll,
    };
});