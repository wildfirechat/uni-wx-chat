<script>
import store from "./store";
import {getItem} from "./pages/util/storageHelper";
import wfc from "./wfc/client/wfc";
// import conferenceManager from "./pages/voip/conference/conferenceManager";
import ConferenceInviteMessageContent from "./wfc/av/messages/conferenceInviteMessageContent";
import Message from "./wfc/messages/message";
import ForwardType from "./pages/conversation/message/forward/ForwardType";

export default {
    data() {
        return {
            wfc: null,
            store: null,
        }
    },
    onLaunch: function () {
        console.log("App Launch");
        this.wfc = wfc;
        this.store = store;
        // #ifdef APP-PLUS
        plus.push.getClientInfoAsync((info) => {
            let cid = info["clientid"];
            if (cid) {
                console.log('push clientId', cid);
                wfc.setDeviceToken(7, cid);
            }
        });
        // #endif
    },
    onShow: function () {
        console.log("App Show");
        store.state.misc.isAppHidden = false;
    },

    mounted() {
        //屏蔽默认的contextmenu事件
        document.oncontextmenu = (e) => e.preventDefault();
    },

    onHide: function () {
        console.log("App Hide");
        store.state.misc.isAppHidden = true;
    },
    methods: {
        go2ConversationList() {
            uni.switchTab({
                url: '/pages/conversationList/ConversationListPage',
                success: () => {
                    console.log('to conversation list success');
                },
                fail: e => {
                    console.log('to conversation list error', e);
                },
                complete: () => {
                    console.log('switch tab complete')
                }
            });
        },

        forwardConferenceInviteMessage(callId, host, title, desc, startTime, audioOnly, defaultAudience, advance, pin) {
            let inviteMessageContent = new ConferenceInviteMessageContent(callId, host, title, desc, startTime, audioOnly, defaultAudience, advance, pin);
            console.log('invite', inviteMessageContent);
            let message = new Message(null, inviteMessageContent);
            this.$forward({
                forwardType: ForwardType.NORMAL,
                messages: [message]
            });
        },
    }
}
</script>

<style lang="css">
/*每个页面公共css */
@import './global.css';
@import './wfc.css';
@import './static/iconfonts/customicons.css';
@import './static/iconfonts/wf-icomoon-style.css';


:root {
    --uni-tabbar-height: 50px;
    --uni-page-header-height: 0;
    --page-full-height-without-header-and-tabbar: calc(100vh - 50px);
    --page-full-height-without-header: 100vh;
    box-sizing: border-box;
}

view,scroll-view,swiper,swiper-item,movable-area,movable-view,cover-view,cover-image,icon,text,rich-text,progress,button,checkbox-group,checkbox,form,input,label,picker,picker-view,radio-group,radio,slider,switch,textarea,navigator,functional-page-navigator,image,video,camera,live-player,live-pusher,map,canvas,open-data,web-view,ad{
    box-sizing: border-box;
}

</style>
