<template>
    <Transition name="description" @before-enter="showTgButton" @leave="hideTgButton">
        <div class="descrition">
            
            <div 
                class="descrition__image"
                :style="{ backgroundImage: `url(${currentImage})` }"
                @click="switchImage"
            >

                <div class="descrition_image--pagination">
                        <div v-for="(item, index) in userImages" :key="index"
                            :class="['descrition_image--pagination__item', { active: index === currentImageIndex }]">
                        </div>
                    </div>
            </div>

            <div style="position: relative; padding-bottom: calc(var(--buttons-height) + 25px);">
                <div class="descrition__head">
                    <div class="descrition__head--name">{{ userName }}, {{ userAge }}</div>
                    <div class="descrition__head--geo">Санкт-Петербург, Россия</div>
                </div>

                <div class="descrition__about">
                    <div class="descrition__about--head">Обо мне</div>
                    <div class="descrition__about--text">{{ userDescription }}</div>
                </div>

                <div class="descrition__interests" v-if="userTags">
                    <div class="descrition__interests--head">Интересы</div>
                    <div class="descrition__interests--tags">
                        <div 
                            v-for="(item, index) in userTags" 
                            :key="index"
                            :class="['descrition__about--tags__item']"
                        >
                        {{ item }}
                        </div>
                    </div>
                </div>

                <div class="descrition__socmedia" v-if="userSoc">
                    <div class="descrition__socmedia--head">Социальные сети</div>
                    <div class="descrition__socmedia--tags">
                        <div 
                            v-for="(item, index) in userSoc" 
                            :key="index"
                            :class="['descrition__socmedia--tags__item']"
                            :style="{ backgroundImage: `url(${item.name}_fav.ico)` }"
                            @click="openSocLink(item.url)"
                        >
                        </div>
                    </div>
                </div>

                <div class="decription_report" @click="handleReport">
                    <div class="decription_report--button">
                        <div class="decription_report--button__text">Пожаловаться на профиль</div>
                    </div>
                </div>

                <!-- TODO: Пожаловаться на юзера кнопкой, неярко -->
            </div>
        </div>
    </Transition>
</template>

<script>
export default {
    data() {
        return {
            currentImageIndex: 0
        }   
    },
    props: {
        userName: {
            type: String,
            required: true
        },
        userAge: {
            type: Number,
            required: false
        },
        userDescription: {
            type: String,
            required: true
        },
        userImages: {
            type: Array,
            required: true
        },
        userTags: {
            type: Array,
            required: false
        },
        userSoc: {
            type: Array,
            required: false
        }
    },
    methods: {
        showTgButton() {
            this.isAppear = true

            Telegram.WebApp.BackButton.isVisible = true
            Telegram.WebApp.BackButton.onClick(() => {
                Telegram.WebApp.BackButton.hide()
                this.$emit('hideDescription')
            })
        },
        hideTgButton() {
            Telegram.WebApp.BackButton.isVisible = false
        },
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
        openSocLink(url) {
            Telegram.WebApp.openLink(url)
        },
        handleReport() {
            Telegram.WebApp.showPopup({
                title: 'Пожаловаться на профиль',
                message: 'Вы уверены, что хотите пожаловаться на профиль?',
                buttons: [
                    { id: 'confirm', type: 'default', text: 'Подтвердить' },
                    { id: 'cancel', type: 'cancel', text: 'Отменить' },
                ]
            }, (buttond_id) => {
                if (buttond_id == 'confirm') {
                    console.log('TODO: сделать редирект на форму жалобы на профиль')
                }
            })
        }
    },
    computed: {
        currentImage() {
            if (!this.userImages) return ''

            return this.userImages[this.currentImageIndex].src
        },
        
    }
}
</script>

<style>
.descrition {
    position: absolute;

    height: var(--app-height);
    width: 100vw;

    font-family: 'Open Sans';
    color: var(--tg-theme-text-color);
    background-color: var(--tg-theme-secondary-bg-color);

    overflow-y: scroll;

    z-index: 3;
}



.descrition__image {
    width: 100%;
    height: 70%;

    display: flex;
    justify-content: center;

    background-position: center;
    background-size: cover;

    border-radius: 0 0 15px 15px;
}
.descrition_image--pagination {
    position: absolute;
    top: 12px;

    display: flex;
    justify-content: center;
}
.descrition_image--pagination__item {
    height: 8px;
    width: 8px;

    margin: 0 2px;
    border-radius: 50%;

    background-color: rgba(256, 256, 256, 0.25);
}
.descrition_image--pagination__item.active {
    background-color: #FFFFFF;
    transition: width 0.4s ease;
    width: 16px;
    border-radius: 4px;
}



.description-enter-from {
    top: 100%;
    opacity: 0.5;
    transform: scale(0.5);
}
.description-enter-active {
    transition: all .4s ease;
}
.description-enter-to {
    top: 0;
    opacity: 1;
    transform: scale(1);
}
.description-leave-from {
    opacity: 1;
    transform: scale(1);
}
.description-leave-active {
    transition: all .4s ease;
}
.description-leave-to {
    opacity: 0;
    transform: scale(0);
}



.descrition__head,
.descrition__about,
.descrition__interests,
.descrition__socmedia {
    margin: 10px;
    padding: 15px;
    background-color: var(--tg-theme-bg-color);
    border-radius: 10px;
}
.descrition__head--name {
    font-size: 32px;
    font-weight: 600;
}
.descrition__head--geo {
    margin-top: 5px;
    font-size: 20px;
    font-weight: 400;
}


.descrition__about--head {
    font-size: 20px;
    font-weight: 500;
}
.descrition__about--text {
    margin-top: 5px;
    font-size: 16px;
    font-weight: 400;
}



.descrition__interests--head {
    font-size: 20px;
    font-weight: 500;
}
.descrition__interests--tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    overflow-x: hidden;
    
    width: 100%;
    margin: 5px -5px -5px;
}
.descrition__about--tags__item {
    padding: 7px 15px 7px 15px;
    margin: 5px 5px;

    border: 1.5px solid var(--tg-theme-link-color);
    border-radius: 20px;
    
    font-size: 16px;
    font-weight: 400;
}



.descrition__socmedia--head {
    font-size: 20px;
    font-weight: 500;
}
.descrition__socmedia--tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    overflow-x: hidden;
    
    width: 100%;
    margin: 5px -15px -5px;
}
.descrition__socmedia--tags__item {
    width: 50px;
    height: 50px;
    margin: 5px 15px;

    background-position: center;
    background-size: cover;
}

.decription_report {
    width: 100%;
    margin-top: 20px;
}
.decription_report--button {
    padding: 25px;

    display: flex;
    justify-content: center;
    align-items: center;

    border-top: 1px solid var(--tg-theme-bg-color);
    border-bottom: 1px solid var(--tg-theme-bg-color);
}
.decription_report--button__text {
    font-size: 20px;
    font-weight: 400;
    opacity: 0.2;
}
</style>