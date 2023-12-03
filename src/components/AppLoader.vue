<template>
    <div class="app_loader">
        <div class="app_loader--heart">
            <div></div>
        </div>

        <div class="app_loader--text">Загружаем контент...</div>
    </div>
</template>

<script>
export default {
}
</script>

<style>
.app_loader {
    background-color: var(--tg-theme-bg-color);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    position: absolute;

    width: 100%;
    height: 100%;

    z-index: 6;
}

.app_loader--heart {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
    transform: rotate(45deg);
    transform-origin: 40px 40px;
}

.app_loader--heart div {
    top: 32px;
    left: 32px;
    position: absolute;
    width: 32px;
    height: 32px;
    background: var(--tg-theme-button-color);
    animation: app_loader--heart 1.2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
}

.app_loader--heart div:after,
.app_loader--heart div:before {
    content: " ";
    position: absolute;
    display: block;
    width: 32px;
    height: 32px;
    background: var(--tg-theme-button-color);
}

.app_loader--heart div:before {
    left: -24px;
    border-radius: 50% 0 0 50%;
}

.app_loader--heart div:after {
    top: -24px;
    border-radius: 50% 50% 0 0;
}

@keyframes app_loader--heart {
    0% {
        transform: scale(0.95);
    }

    5% {
        transform: scale(1.1);
    }

    39% {
        transform: scale(0.85);
    }

    45% {
        transform: scale(1);
    }

    60% {
        transform: scale(0.95);
    }

    100% {
        transform: scale(0.9);
    }
}

.app_loader--text {
    position: relative;
    padding-top: 30px;
    color: var(--tg-theme-text-color);
    font-family: 'Open Sans';
    font-size: 18px;
    font-weight: 400;
    display: inline-block;
}

.app_loader--text {
    position: relative;
    display: inline-block;

    padding-top: 30px;
    color: var(--tg-theme-text-color);

    font-family: 'Open Sans';
    font-size: 18px;
    font-weight: 400;

    clip-path: inset(0 0.9ch 0 0);
    animation: l 1.8s steps(3) infinite;
}

@keyframes l {
  to {
    clip-path: inset(0 -0.45ch 0 0)
  }
}

</style>