<template>
  <Transition name="last" @before-enter="onAppear" @after-leave="onClose">
    <div class="last-one">
      <div class="last-one__picture">
        <div class="last-one__pulse first-pulse"></div>
        <div class="last-one__pulse second-pulse"></div>
      </div>

      <p class="last-one__text--main">Людишки кончились :(</p>
      <p class="last-one__text--desc">Расширьте свои настройки возраста или дистанцию, чтобы увидеть больше профилей</p>
    </div>
  </Transition>
</template>

<script>
export default {
  methods: {
    handleSettings() {
      console.log('settings')
    },
    onAppear() {
      Telegram.WebApp.MainButton.isVisible = true
      Telegram.WebApp.MainButton.setText('Перейти в настройки')
      Telegram.WebApp.MainButton.onClick(() => {
        this.handleSettings()
      })
    },
    onClose() {
      Telegram.WebApp.MainButton.isVisible = false
    }
  }
}
</script>

<style>
.last-one {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  flex-direction: column;

  background-color: var(--tg-theme-bg-color);

  z-index: 1;
}

.last-one__picture {
  position: relative;

  background-image: url('/profile1_img1.jpg');
  background-position: center;
  background-size: cover;

  border-radius: 50%;
  height: 200px;
  width: 200px;

  top: 80px;
  z-index: initial;
}

.last-one__pulse {
  background-color: var(--tg-theme-button-color);
  border-radius: 100%;

  position: absolute;
  height: 200px;
  width: 200px;
  left: calc(50% - 100px);

  opacity: .25;
  animation: scale 3s infinite ease-in-out;

  z-index: -1;
}

.first-pulse {
  animation-delay: 1.5s;
}

.second-pulse {
  animation-delay: 1s;
}

@keyframes scale {
  0%, 100% {
    transform: scale(0.6);
  }
  25%, 50% {
    transform: scale(1.3);
  }
}


.last-one__text--main, .last-one__text--desc {
  top: 155px;
  position: relative;
  width: 300px;
  text-align: center;

  font-family: 'Open Sans';

  color: var(--tg-theme-text-color);
}

.last-one__text--main {
  font-weight: 500;
  font-size: 24px;
}

.last-one__text--desc {
  font-weight: 400;
  font-size: 16px;
}


.last-enter-from {
  opacity: 0;
}

.last-enter-active {
  transition: 0.8s;
}

.last-enter-to {
  opacity: 1;
}
</style>