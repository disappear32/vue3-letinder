<template>
    <div class="layout" :style="cssVars">
        <app-loader v-show="!loadSecondImagesFinished" />

        <div class="layout__load" v-if="loadFirstImagesFinished" v-show="loadSecondImagesFinished">
            <div class="cards" v-show="displayCards">
                <next-card 
                    v-if="currentUser < users.length - 2"
                    :key="currentUser + 1"
                    :isScaleNextCard="isNextCardScaled"
                    :userImage="nextImage"
                />

                <swipe-card
                    :key="currentUser"
                    :isSwipeLeft="isDislikePressed"
                    :isSwipeRight="isLikePressed"
                    @swipeLeft="handleLeftSwipe"
                    @swipeRight="handleRightSwipe"
                    :userImagesCount="users[currentUser].images.length"
                    :userImages="images[currentUser]"
                    :userName="users[currentUser].name"
                    :userAge="users[currentUser].age"
                    :userDescription="users[currentUser].description"
                />
            </div>

            <description 
                v-show="isDescriptionOpened"
                :key="currentUser"
                :userImages="images[currentUser]"
                :userName="users[currentUser].name"
                :userAge="users[currentUser].age"
                :userDescription="users[currentUser].description"
                :userTags="users[currentUser].tags"
                :userSoc="users[currentUser].social_media"
                @hideDescription="hideDescription"
            />

            <div class="buttons" v-show="displayButtons">

                <div class="dislike-button" @click="handleDislikePress">
                    <div class="dislike-button__image"></div>
                </div>

                <div class="like-button" @click="handleLikePress">
                    <div class="like-button__image"></div>
                </div>

                <div class="info-button" @click="openDescrition">
                    <div class="info-button__image"></div>
                </div>
            </div>

            <match
                v-show="isMatch"
                :firstUserImage="images[0][0].src"
                :secondUserImage="images[currentUser][0].src"
                @hideMatch="hideMatch"
            />

            <last-one v-show="currentUser >= users.length - 1" />
        </div>
    </div>
</template>

<script>
import SwipeCard from './components/SwipeCard.vue'
import NextCard from './components/NextCard.vue'
import LastOne from './components/LastOne.vue'
import Description from './components/Description.vue'
import AppLoader from './components/AppLoader.vue'
import Match from './components/Match.vue'
import userJSON from './users.json'



const appHeight = () => {
    const app = document.getElementById('app')
    app.style.setProperty('--app-height', `${window.innerHeight}px`)
}
window.addEventListener('resize', appHeight)
appHeight()



export default {
    components: {
        SwipeCard, LastOne, Description, AppLoader, NextCard, Match
    },
    data() {
        return {
            users: userJSON,
            isLikePressed: false,
            isDislikePressed: false,
            isNextCardScaled: false,
            isDescriptionOpened: false,
            isButtonsVisible: true,
            isMatch: false,
            currentUser: 0,
            images: [],
            loadFirstImagesFinished: false,
            loadSecondImagesFinished: false,
            appTheme: 'light'
        }
    },
    async mounted() {
        Telegram.WebApp.expand()
        Telegram.WebApp.isClosingConfirmationEnabled = true

        this.handleAppScheme()

        await this.preloadImages(this.users)
    },
    methods: {
        handleAppScheme() {
            this.appTheme = Telegram.WebApp.colorScheme

            if (this.appTheme == 'light') {
                console.log('light')
            }
            if (this.appTheme == 'dark') {
                console.log('dark')
            }
        },
        handleLikePress() {
            this.isLikePressed = true
            this.hideDescription()
            this.isNextCardScaled = true
            this.hapticSuccess()

            setTimeout(() => {
                this.isLikePressed = false
                this.isNextCardScaled = false
                this.currentUser++
            }, 400)
        },
        handleDislikePress() {
            this.isDislikePressed = true
            this.hideDescription()
            this.isNextCardScaled = true
            this.hapticSuccess()

            this.isMatch = true

            // setTimeout(() => {
            //     this.isDislikePressed = false
            //     this.isNextCardScaled = false
            //     this.currentUser++
            // }, 400)
        },
        handleRightSwipe() {
            this.isNextCardScaled = true

            setTimeout(() => { 
                this.isNextCardScaled = false
                this.currentUser++ 
            }, 400)
        },
        handleLeftSwipe() {
            this.isNextCardScaled = true

            setTimeout(() => { 
                this.isNextCardScaled = false
                this.currentUser++ 
            }, 400)
        },
        hideMatch() {
            this.isMatch = false
            this.hideDescription()
            this.isNextCardScaled = false
            this.currentUser++

            this.isDislikePressed = false
        },
        hapticSuccess() {
            Telegram.WebApp.HapticFeedback.notificationOccurred('success')
        },
        openDescrition() {
            this.isDescriptionOpened = true
        },
        hideDescription() {
            this.isDescriptionOpened = false
        },
        async preloadImages(users) {
            let counter = 0
            
            for (let user of users) {
                const downloadImages = []

                for (let userImage of user.images) {
                    const downloadImage = new Image()

                    try {
                        await new Promise((resolve, reject) => {
                            downloadImage.onload = resolve;
                            downloadImage.onerror = reject;
                            downloadImage.src = userImage;
                        });
                        //TODO: проверить что будет если один из элементов массива не загрузится
                        downloadImages.push(downloadImage);

                    } catch (error) {
                        console.error("Error loading images:", error)
                    }

                    await new Promise(resolve => setTimeout(resolve, 200))
                }
                this.images.push(downloadImages)

                counter++
                if (counter == 1) this.loadFirstImagesFinished = true

                if (counter == 2) this.loadSecondImagesFinished = true
            }
            //this.loadFirstImagesFinished = true
           
            Telegram.WebApp.ready()
        }
    },
    computed: {
        displayButtons() {
            if (!this.isButtonsVisible) return false

            if (this.isMatch) return false

            if (this.currentUser >= this.users.length - 1) return false

            return true
        },
        nextImage() {
            if (!this.loadFirstImagesFinished || this.currentUser >= this.users.length - 2) return ''

            const nextUserImages = this.images[this.currentUser + 1]

            if (!nextUserImages || nextUserImages.length === 0) return ''

            return nextUserImages[0].src
        },
        displayCards() {
            if (this.currentUser >= this.users.length - 1) return false

            //if (this.isDescriptionOpened) return false

            return true
        },
        cssVars() {
            if (Telegram.WebApp.platform !== 'unknown') {
                const hexToRgb = (hex) => {
                    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    return result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : null;
                }

                const secondaryRGB = hexToRgb(Telegram.WebApp.themeParams.secondary_bg_color)

                return {
                    '--tg-theme-secondary-bg-rgb-color': `${secondaryRGB.r}, ${secondaryRGB.g}, ${secondaryRGB.b}`
                }
            } else return {}
        }
    }
}
</script>
  
<style>
:root {
    --buttons-height: 125px;
}



.layout {
    width: 100%;
    height: var(--app-height);

    overflow: hidden;

    background: var(--tg-theme-bg-color);

    -webkit-touch-callout: none;
    -webkit-user-select: none;   
    -khtml-user-select: none;   
    -moz-user-select: none;
    webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.layout--description {
    justify-content: flex-end;
}



.layout__load {
    width: 100%;
    height: 100%;

    position: relative;

    display: flex;
    align-items: center;
    flex-direction: column;
}


.cards {
    position: relative;
    top: 0;
    width: 90%;
    max-width: 700px;
    max-height: 700px;
    height: calc(var(--app-height) - var(--buttons-height));
    display: flex;
    justify-content: center;
}



.buttons {
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 90%;
    max-width: 500px;

    transform: translateZ(0);
    z-index: 5;
}

.dislike-button {
    border-radius: 50%;
    height: 50px;
    width: 50px;
    margin: 25px;
    background-color: var(--tg-theme-hint-color);

    display: flex;
    justify-content: center;
    align-items: center;
}
.like-button {
    border-radius: 50%;
    height: 75px;
    width: 75px;
    margin: 25px;
    background-color: var(--tg-theme-button-color);

    display: flex;
    justify-content: center;
    align-items: center;
}
.info-button {
    border-radius: 50%;
    height: 50px;
    width: 50px;
    margin: 25px;
    background-color: var(--tg-theme-hint-color);

    display: flex;
    justify-content: center;
    align-items: center;
}
.dislike-button__image {
    width: 50%;
    height: 50%;
    background-image: url('/dislike.png');
    background-position: center;
    background-size: cover;
}
.like-button__image {
    width: 60%;
    height: 60%;
    background-image: url('/like.png');
    background-position: center;
    background-size: cover;
}
.info-button__image {
    width: 50%;
    height: 50%;
    background-image: url('/info.png');
    background-position: center;
    background-size: cover;
}
.like-button:active,
.dislike-button:active,
.info-button__image:active {
    transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
    transform: scale(0.85);
}
</style>
  
  
  