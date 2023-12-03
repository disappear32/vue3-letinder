<template>
    <Transition name="next">
        <div 
            class="next-card" 
            :class="{ 'scale-next-card': isScaleNextCard }"
            :style="{ backgroundImage: `url(${userImage})` }"
        >
        </div>
    </Transition>
</template>

<script>
export default {
    props: {
        isScaleNextCard: {
            type: Boolean,
            required: false
        },
        userImage: {
            type: String,
            required: false
        }
    }
}
</script>

<style>
.next-card {
    position: absolute;
    top: -5%;

    opacity: 0.5;

    transform: scale(0.9, 0.9);

    width: 100%;
    height: 95%;

    border-radius: 15px;

    background-color: var(--tg-theme-hint-color);
    background-position: center;
    background-size: cover;

    will-change: top, transform, opacity;
}



.next-enter-from {
    opacity: 0;
}

.next-enter-active {
    transition: 0.8s;
}

.next-enter-to {
    opacity: 0.5;
}


.scale-next-card {
    animation: scaleCardAnimation 0.3s ease;
    top: 5%;
    transform: none;
    opacity: 1;
}

@keyframes scaleCardAnimation {
    0% {
        top: -5%;
        opacity: 0.5;
        transform: scale(0.9, 0.9);
    }

    100% {
        top: 5%;
        opacity: 1;
        transform: none;
    }
}
</style>