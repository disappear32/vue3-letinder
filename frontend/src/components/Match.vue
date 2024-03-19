<template>
  <Transition name="match" @before-enter="onAppear" @leave="onClose">
    <div v-if="showMatch" class="match">
      <div class="match__icons">
        <div
            class="match__icon first-icon"
            :style="{ backgroundImage: `url(${firstUserImage})`}"
            :class="{ 'first-icon-appear': isPhotosAppear }"
        ></div>
        <div
            class="match__icon second-icon"
            :style="{ backgroundImage: `url(${secondUserImage})` }"
            :class="{ 'second-icon-appear': isPhotosAppear }"
        ></div>
      </div>

      <div class="match__text">
        <div class="match__text--header">Совпадение!</div>
        <div class="match__text--description">Начните общение прямо сейчас 😊</div>
      </div>

      <div class="keep-swipe__button" @click="$emit('hideMatch')">
        <div class="keep-swipe__button--text">Продолжить свайпать</div>
      </div>
    </div>
  </Transition>
</template>

<script>
import Telegram from '../Telegram'
export default {
  data() {
    return {
      isPhotosAppear: false
    }
  },
  props: {
    firstUserImage: String,
    secondUserImage: String,
    showMatch: Boolean,
  },
  methods: {
    onAppear() {
      this.isPhotosAppear = true;

      Telegram.WebApp.BackButton.isVisible = true
      Telegram.WebApp.BackButton.onClick(this.backButtonCallback)

      Telegram.WebApp.MainButton.isVisible = true
      Telegram.WebApp.MainButton.setText('Начать общение')
      Telegram.WebApp.MainButton.onClick(this.mainButtonCallback)
    },
    onClose() {
      this.isPhotosAppear = false;

      Telegram.WebApp.BackButton.offClick(this.backButtonCallback)
      Telegram.WebApp.MainButton.offClick(this.mainButtonCallback)

      Telegram.WebApp.BackButton.isVisible = false
      Telegram.WebApp.MainButton.isVisible = false

    },
    backButtonCallback() {
      this.$emit('hideMatch')
    },
    mainButtonCallback() {
      Telegram.WebApp.openTelegramLink('https://t.me/hydroborum')
    }
  }
}
</script>

<style>
.match {
  width: 100%;
  height: 100%;

  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  background-color: var(--tg-theme-bg-color);

  z-index: 7;

  will-change: transform, opacity;
  transition: all .4s ease;
}


.match__icons {
  position: relative;
  width: 100%;
  height: 150px;
}

.match__icon {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 1px solid var(--tg-theme-link-color);

  position: absolute;

  will-change: transform;

  background-position: center;
  background-size: cover;
}


.first-icon {
  transform: translateX(-25vw);
}

.second-icon {
  transform: translateX(125vw);
}


.first-icon-appear {
  animation: firstIconAppearAnimation 0.4s ease-in-out;
  transform: translateX(calc(50vw - 100% - 25px));
}

@keyframes firstIconAppearAnimation {
  0% {
    transform: translateX(-25vw);
  }
  100% {
    transform: translateX(calc(50vw - 100% - 25px));
  }
}

.second-icon-appear {
  animation: secondIconAppearAnimation 0.4s ease-in-out;
  transform: translateX(calc(50vw + 25px));
}

@keyframes secondIconAppearAnimation {
  0% {
    transform: translateX(125vw);
  }
  100% {
    transform: translateX(calc(50vw + 25px));
  }
}


.match__text {
  font-family: 'Open Sans';
  text-align: center;

  margin-top: 50px;
}

.match__text--header {
  font-size: 32px;
  font-weight: 600;
  color: var(--tg-theme-link-color);
}

.match__text--description {
  margin-top: 10px;
  font-size: 18px;
  font-weight: 400;
  color: var(--tg-theme-text-color);
}


.keep-swipe__button {
  position: absolute;
  bottom: 15px;

  width: 100%;
  /* border-top: 1px solid var(--tg-theme-secondary-bg-color);
  border-bottom: 1px solid var(--tg-theme-secondary-bg-color); */
}

.keep-swipe__button--text {
  padding: 20px;
  opacity: 0.6;

  text-align: center;
  font-family: 'Open Sans';
  font-size: 18px;
  font-weight: 400;
  color: var(--tg-theme-text-color);
}


.match-enter-from {
  opacity: 0.5;
  transform: scale(0.5);
}

.match-enter-active {
  transition: all .4s ease;
}

.match-enter-to {
  opacity: 1;
  transform: scale(1);
}

.match-leave-from {
  opacity: 1;
  transform: scale(1);
}

.match-leave-active {
  transition: all .4s ease;
}

.match-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>