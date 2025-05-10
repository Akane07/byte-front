export const useNotifications = defineStore('notifications', () => {
    const showNotification = shallowRef(false);
    const text = shallowRef('');

    async function setNotification(value: string) {
        if (showNotification.value) return;

        text.value = value;
        showNotification.value = true;
        await nextTick();

        const div = document.querySelector('.notification') as HTMLDivElement;

        setTimeout(() => {
            div.classList.add('active');
        }, 1000);

        setTimeout(() => {
            div.classList.remove('active');
        }, 5000);
        setTimeout(() => {
            if (!div.classList.contains('active')) {
                showNotification.value = false;
                text.value = '';
            }
        }, 6000);
    }

    function hideNotification() {
        const div = document.querySelector('.notification') as HTMLDivElement;
        div.classList.remove('active');

        setTimeout(() => {
            showNotification.value = false;
            text.value = '';
        }, 1000);
    }

    return {
        showNotification,
        text,

        setNotification,
        hideNotification,
    };
});