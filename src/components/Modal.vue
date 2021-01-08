<template>
    <transition name="pop">
        <div class="wrapper" v-if="isVisible">
            <a class="close-button" @click="closeModal">[x] Close</a>
            <slot>
            </slot>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'Modal',
    props: ['isVisible', 'containerClass'],
    methods: {
        closeModal(){
            this.$emit('modalClosing');
        }
    }
}
</script>

<style scoped>
.wrapper{ background: rgba(50, 50, 50, 0.7);
    @apply w-full h-screen z-10 fixed top-0 left-0 flex content-center flex-wrap  py-5
}

a.close-button{
    @apply text-white fixed font-bold top-0 right-0 p-4
}

a.close-button:hover{
    @apply cursor-pointer underline
}

.pop-enter-active, .pop-leave-active{
    transition: all 0.3s ease-in;
}

.pop-enter, .pop-leave-to{
    @apply opacity-0
}
.pop-leave, .pop-enter-to{
    @apply opacity-100
}


</style>
