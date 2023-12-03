<template>
    <div 
        class="curr-card" 
        :class="{ 
            'swipe_complete': isSwipeCompleted,
            'swipe-right': isSwipeRight, 
            'swipe-left': isSwipeLeft
        }"
        :style="{ transform: `${swipeStyles}` }"
        @click="switchImage"
        @touchstart="onTouchStart" 
        @touchmove.prevent="onTouchMove"
        @touchend="onTouchEnd"
    >
        <image-loader v-if="!currentImage" />

        <div 
            :style="{ backgroundImage: `url(${currentImage})`}"
            class="curr-card__image"
        ></div>

        <Transition name="fade" appear>
            <div class="like_hint" v-show="isLikeHintVisible">
                <p>ЛАЙК</p>
            </div>
        </Transition>
        
        <Transition name="fade" appear>
            <div class="dislike_hint" v-show="isDislikeHintVisible">
                <p>👎</p>
            </div>
        </Transition>

        <Transition name="fade" appear>
            <div class="card_pagination">
                <div v-for="(_, index) in userImagesCount" :key="index"
                    :class="['card_pagination__item', { active: index === currentImageIndex }]">
                </div>
            </div>
        </Transition>

        <Transition name="fade" appear>
            <div class="card_geo" v-show="!isDislikeHintVisible">
                <div class="card_geo__icon"> </div>
                <p class="card_geo__distance">5 km</p>
            </div>
        </Transition>

        <Transition name="fade" appear>
            <div class="card_description" @click="descriptionExpand">
                <p class="card_description__name">{{ userName }}, {{ userAge }}</p>
                <p 
                    class="card_description__about" 
                    :class="{ 'card_description__about--expand': isDescriptionExpanded }"
                >{{ userDescription }}</p>
                <p 
                    v-show="isDescriptionExpanded" 
                    @click="descriptionHide"
                    class="card_description__hide"
                >Свернуть</p>
            </div>
        </Transition>
    </div>
</template>

<script>
import ImageLoader from './ImageLoader.vue'

export default {
    components: {
        ImageLoader
    },
    props: {
        isSwipeLeft: {
            type: Boolean,
            required: true
        },
        isSwipeRight: {
            type: Boolean,
            required: true
        },
        userImagesCount: {
            type: Number,
            required: true
        },
        userImages: {
            type: Array,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        userAge: {
            type: Number,
            required: true
        },
        userDescription: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            currentImageIndex: 0,
            widthViewport: 0,
            swipeDistance: 0,
            touchStartX: 0,
            touchEndX: 0,
            touchMoveX: 0,
            rotateDeg: 0,
            isSwipeCompleted: false,
            isLikeHintVisible: false,
            isDislikeHintVisible: false,
            isDescriptionExpanded: false
        }
    },
    mounted() {
        this.widthViewport = window.innerWidth
        this.swipeDistance = this.widthViewport / 8
    },
    computed: {
        currentImage() {
            if (!this.userImages) return

            return this.userImages[this.currentImageIndex].src
        },
        swipeStyles() {
            if (this.touchMoveX == 0) return ''

            return 'translateX(' + this.touchMoveX + 'px) rotate(' + this.rotateDeg + 'deg)'
        }
    },
    methods: {
        switchImage(event) {
            const { width, left } = event.target.getBoundingClientRect()
            const halfWidth = width / 2
            const clickX = event.clientX


            if (clickX - left < halfWidth && this.currentImageIndex == 0) {
                this.currentImageIndex = this.userImages.length - 1
                
                return
            }

            if (clickX - left >= halfWidth && this.currentImageIndex === this.userImages.length - 1) {
                this.currentImageIndex = 0
                
                return
            }

            if (clickX - left < halfWidth && this.currentImageIndex > 0) {
                this.currentImageIndex--
            }
            
            if (clickX - left >= halfWidth && this.currentImageIndex < this.userImages.length - 1) {
                this.currentImageIndex++
            }
        },
        onTouchStart(event) {
            this.touchStartX = event.touches[0].clientX
            
        },
        onTouchMove(event) {
            //event.preventDefault();

            this.touchMoveX = event.touches[0].clientX - this.touchStartX
                
            if (this.touchMoveX > 0) {
                this.rotateDeg = (this.touchMoveX / 10 < 10) ? this.touchMoveX / 10 : 10
                this.isLikeHintVisible = (this.touchMoveX > this.swipeDistance) ? true : false
            }

            if (this.touchMoveX < 0) {
                this.rotateDeg = (this.touchMoveX / 10 > -10) ? this.touchMoveX / 10 : -10

                this.isDislikeHintVisible = (Math.abs(this.touchMoveX) > this.swipeDistance) ? true : false
            }

            if (this.touchMoveX > 150) {
                this.touchMoveX = 150
            }

            if (this.touchMoveX < -150) {
                this.touchMoveX = -150
            }
        },
        onTouchEnd(event) {
            this.touchEndX = event.changedTouches[0].clientX
            const swipeDistanceX = this.touchEndX - this.touchStartX

            if (Math.abs(swipeDistanceX) > this.swipeDistance) {
                this.isSwipeCompleted = true

                const isSwipeRight = (swipeDistanceX > 0) ? true : false

                if (isSwipeRight) {
                    this.$emit('swipeRight')
                    this.touchMoveX = this.widthViewport + 25
                }
                else {
                    this.$emit('swipeLeft')
                    this.touchMoveX = -this.widthViewport - 25
                }
            } else {
                this.touchMoveX = 0
                this.rotateDeg = 0
            }
            
        },
        descriptionExpand(event) {
            event.stopPropagation()

            this.isDescriptionExpanded = true
        },
        descriptionHide(event) {
            event.stopPropagation()
            this.isDescriptionExpanded = false
        }
    }
}
</script>

<style>
.curr-card {
    position: absolute;
    bottom: 0;

    width: 100%;
    height: 95%;

    z-index: 2;
    will-change: transform, opacity;
}



.curr-card__image {
    width: 100%;
    height: 100%;

    border-radius: 15px;

    background-position: center;
    background-size: cover;
}


.dislike_hint, .like_hint  {
    position: absolute;
    top: 24.5px;

    border: 3px solid;
    border-radius: 10px;
    padding: 5px;

    font-family: 'Open Sans';
    font-weight: 600;
    font-size: 24px;
}
.like_hint {
    border-color: var(--tg-theme-button-color);
    color: var(--tg-theme-button-color);
    left: 20px;
    transform: rotate(-10deg);
}
.dislike_hint {
    background-color: rgba(239, 68, 68, 0.4) ;
    border-color: rgb(250, 74, 58);
    color: rgb(250, 74, 58);
    right: 20px;
    transform: rotate(10deg);
}

.card_pagination {
    width: calc(100% - 40px);

    position: absolute;
    top: 10px;
    padding: 0 20px;

    display: flex;
    justify-content: center;
}

.card_pagination__item {
    height: 4.5px;

    margin: 0 2px;
    border-radius: 2px;

    background-color: rgba(256, 256, 256, 0.25);

    flex-grow: 1;

    min-width: 10px;
}

.card_pagination__item.active {
    background-color: #FFFFFF;
    transition: flex 0.4s ease;
    flex-grow: 1.5;
}

.card_geo {
    padding: 6px;
    
    background-color: var(--tg-theme-secondary-bg-color);
    border-radius: 10px;

    position: absolute;
    top: 24.5px;
    right: 20px;

    display: flex;
    align-items: center;
    justify-content: center;
}

.card_geo__icon {
    height: 20px;
    width: 15px;

    background-image: url('/geo_icon.png');
    background-position: center;
    background-size: cover;
}

.card_geo__distance {
    font-family: 'Open Sans';
    font-weight: 300;
    font-size: 12px;
    color: var(--tg-theme-text-color);
    margin-left: 5.5px;
}

.card_description {
    padding-top: 10px;
    padding-bottom: 15px;
    width: 100%;
    bottom: 0;

    background-color: rgba(var(--tg-theme-secondary-bg-rgb-color), 0.6);
    border-radius: 0 0 15px 15px;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);

    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    font-family: 'Open Sans';
    color: var(--tg-theme-text-color);
}

.card_description__name {
    margin-left: 20px;
    font-weight: 600;
    font-size: 24px;
}

.card_description__about {
    margin-left: 20px;
    margin-right: 20px;
    font-weight: 400;
    font-size: 14px;

    overflow: hidden;
    
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.card_description__about--expand {
    -webkit-line-clamp: 6;
}

.card_description__hide {
    width: fit-content;
    margin-top: 8px;
    margin-left: 20px;
    margin-right: 20px;
    font-weight: 600;
    font-size: 12px;
    color: var(--tg-theme-link-color);
}
.card_description__hide:focus {
  outline: 0;
}

.swipe_complete {
    transition-duration: 0.3s;
}

.fade-enter-from {
    opacity: 0;
}
.fade-enter-active {
    transition: opacity 0.7s ease;
}
.fade-enter-to {
    opacity: 1;
}
.fade-leave-from {
    opacity: 1;
}
.fade-leave-active {
    transition: opacity 0.4s ease;
}
.fade-leave-to {
    opacity: 0;
}

p {
    margin-block-start: 0;
    margin-block-end: 0;
}


.swipe-left {
    animation: swipeLeftAnimation 0.35s ease-out;
    transform: translateX(-100%) rotate(-10deg);
    opacity: 0;
}
@keyframes swipeLeftAnimation {
    0% {
        transform: translateX(0) rotate(0);
        opacity: 1;
    }

    100% {
        transform: translateX(-100%) rotate(-10deg);
        opacity: 0;
    }
}

.swipe-right {
    animation: swipeRightAnimation 0.35s ease-out;
    transform: translateX(100%) rotate(10deg);
    opacity: 0;
}
@keyframes swipeRightAnimation {
    0% {
        transform: translateX(0) rotate(0);
        opacity: 1;
    }

    100% {
        transform: translateX(100%) rotate(10deg);
        opacity: 0;
    }
}
</style>