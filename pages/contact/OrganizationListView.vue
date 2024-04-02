<template>
    <section>
        <ul>
            <li v-for="(organization, index) in rootOrganizations" :key="index" @click="showOrganization(organization)">
                <div class="organization-item"
                     v-bind:class="{active: sharedContactState.currentOrganization && sharedContactState.currentOrganization.id === organization.id}">
                    <image class="avatar" :src="organization.portrait ? organization.portrait : defaultPortraitUrl"/>
                    <text class="single-line">{{ organization.name }}</text>
                </div>
            </li>
        </ul>
    </section>

</template>

<script>
import store from "../../store";
import organizationServerApi from "../../api/organizationServerApi";
import Config from "../../config";
import wfc from "../../wfc/client/wfc";
import ConnectionStatus from "../../wfc/client/connectionStatus";

export default {
    name: "OrganizationListView",
    props: {},
    data() {
        return {
            sharedContactState: store.state.contact,
            rootOrganizations: [],
            defaultPortraitUrl: Config.DEFAULT_ORGANIZATION_PORTRAIT_URL,
        }
    },
    mounted() {
        organizationServerApi.getRootOrganization()
            .then(orgs => {
                this.rootOrganizations = orgs;
            }).catch(reason => {
            if (reason.errorCode === 13 && wfc.getConnectionStatus() === ConnectionStatus.ConnectionStatusConnected) {
                this.login()
            }
        })
    },
    methods: {
        login() {
            organizationServerApi.login()
                .then(() => {
                    organizationServerApi.getRootOrganization().then(orgs => {
                        this.rootOrganizations = orgs
                    })
                })
        },
        showOrganization(organization) {
            store.setCurrentOrganization(organization)
            uni.navigateTo({
                url: '/pages/contact/OrganizationTreePage',
                success: () => {
                    console.log('nav to OrganizationTreePage success 000');
                },
                fail: (err) => {
                    console.log('nav to OrganizationTreePage err', err);
                }
            })
        },
    },
}
</script>

<style scoped>
.avatar {
    width: 40px;
    height: 40px;
    border-radius: 3px;
}

.organization-item {
    height: 50px;
    padding: 5px 10px 5px 10px;
    display: flex;
    font-size: 14px;
    align-items: center;
    background-color: #fafafa;
}

.organization-item text {
    margin-left: 10px;
}

</style>
