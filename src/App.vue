<script lang="ts">
  import Header from './components/Header.vue'
  import MainRedeemDevelopmentRow from './components/MainRedeemDevelopmentRow.vue'
  import {CheaterWebSocketManager, onPacketCallbackType, TypedObject} from './api/CheaterWebsocketManager'

  export default {
    components: {
      Header,
      MainRedeemDevelopmentRow
    },

    data(){
      return {
        connectionstatus: "Not connected, starting to connect...",
        cheattree: {}
      }
    },

    created(){
      CheaterWebSocketManager.onStatusChange.push((status) => {
        this.connectionstatus = status;
      });

      interface ICheatTree extends TypedObject {
        tree:any;
      }

      let CheatTreeCallback:onPacketCallbackType = (message:TypedObject) => {
        console.log("In packet!", message);
        let tree:any = (message as ICheatTree).tree;
        console.log("Tree before set", tree);
        console.log(this.cheattree);
        this.cheattree = tree;
      };

      CheaterWebSocketManager.registerPacketCallback("CheatTree", CheatTreeCallback);

      CheaterWebSocketManager.start();
    }
  }
</script>

<template>
  <Header v-bind:status="connectionstatus" />
  <MainRedeemDevelopmentRow :cheattree="cheattree"/>
</template>

<style>

</style>
