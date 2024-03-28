<template>
    <view class="TUI-message-input-main" @longpress="handleLongPress" @touchmove="handleTouchMove"
          @touchend="handleTouchEnd">
        <text>{{ text }}</text>
        <view class="record-modal" v-if="popupToggle" @longpress="handleLongPress" @touchmove="handleTouchMove"
              @touchend="handleTouchEnd">
            <view class="wrapper">
                <view class="modal-loading"></view>
            </view>
            <view class="modal-title">{{ title }}</view>
        </view>
    </view>
</template>

<script lang="js">
import wfc from "../../../wfc/client/wfc";
import SoundMessageContent from "../../../wfc/messages/soundMessageContent";
import BenzAMRRecorder from "benz-amr-recorder";

export default {
    name: 'AudioInputView',
    props: {
        conversationInfo: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            popupToggle: false,
            isRecording: false,
            canSend: true,
            text: '按住说话',
            amrRecorder: null,
            title: ' ',
            recordTime: 0,
            recordTimer: null,
            longPressClientY: 0,
        }
    },
    mounted() {
    },
    methods: {
        async handleLongPress(e) {
            this.longPressClientY = e.changedTouches[e.changedTouches.length - 1].clientY;
            this.popupToggle = true;
            this.amrRecorder = new BenzAMRRecorder();
            this.amrRecorder.initWithRecord().then(() => {
                this.isRecording = true;
                this.amrRecorder.startRecord();
                this.$notify({
                    text: '请开始说话',
                    type: 'info'
                });
            }).catch((e) => {
                this.$notify({
                    text: '录音失败',
                    type: 'error'
                });
                console.log('录音失败', e);
                this.amrRecorder = null;
            });
            this.startPoint = e.target;
            this.title = '正在录音';
            this.isRecording = true;
            this.recordTime = 0;
            this.recordTimer = setInterval(() => {
                this.recordTime++;
            }, 1000);

        },

        // 录音时的手势上划移动距离对应文案变化
        handleTouchMove(e) {
            if (this.isRecording) {
                if (Math.abs(this.longPressClientY - e.changedTouches[e.changedTouches.length - 1].clientY) > 100) {
                    this.text = '抬起停止';
                    this.title = '松开手指，取消发送';
                    this.canSend = false;
                } else if (Math.abs(this.longPressClientY - e.changedTouches[e.changedTouches.length - 1].clientY) > 20) {
                    this.text = '抬起停止';
                    this.title = '上划可取消';
                    this.canSend = true;
                } else {
                    this.text = '抬起停止';
                    this.title = '正在录音';
                    this.canSend = true;
                }
            }
        },
        // 手指离开页面滑动
        handleTouchEnd() {
            this.isRecording = false;
            this.popupToggle = false;
            this.canSend = true;
            this.text = '按住说话';
            this.title = ' '
            uni.hideLoading();

            if (!this.amrRecorder) {
                return;
            }
            if (!this.canSend){
                this.amrRecorder.cancelRecord();
                return;
            }
            this.amrRecorder.finishRecord().then(() => {
                let duration = this.amrRecorder.getDuration();
                if (duration > 1) {
                    let blob = this.amrRecorder.getBlob();
                    let file = new File([blob], new Date().getTime() + '.amr');
                    let content = new SoundMessageContent(file, null, Math.ceil(duration));
                    wfc.sendConversationMessage(this.conversationInfo.conversation, content);
                } else {
                    this.$notify({
                        text: '录音时间太短',
                        type: 'warn'
                    });
                }
                this.amrRecorder = null;
            });

        },

    },

}
</script>

<style lang="scss" scoped>
.audio-contain {
    display: flex;
    justify-content: center;
    font-size: 32rpx;
    font-family: PingFangSC-Regular;
}

.TUI-message-input-main {
    background-color: #fff;
    flex: 1;
    height: 66rpx;
    margin: 0 10rpx;
    padding: 0 5rpx;
    border-radius: 5rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.record-modal {
    height: 300rpx;
    width: 60vw;
    background-color: #000;
    opacity: 0.8;
    position: fixed;
    top: 670rpx;
    z-index: 9999;
    left: 20vw;
    border-radius: 24rpx;
    display: flex;
    flex-direction: column;
}

.record-modal .wrapper {
    display: flex;
    height: 200rpx;
    box-sizing: border-box;
    padding: 10vw;
}

.record-modal .wrapper .modal-loading {
    opacity: 1;
    width: 40rpx;
    height: 16rpx;
    border-radius: 4rpx;
    background-color: #006fff;
    animation: loading 2s cubic-bezier(0.17, 0.37, 0.43, 0.67) infinite;
}

@keyframes loading {
    0% {
        transform: translate(0, 0)
    }

    50% {
        transform: translate(30vw, 0);
        background-color: #f5634a;
        width: 40px;
    }

    100% {
        transform: translate(0, 0);
    }
}

.modal-title {
    text-align: center;
    color: #fff;
}
</style>
