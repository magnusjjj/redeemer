<script setup lang="ts">
import { ref } from 'vue'
import CheatTree from './CheatTree.vue'
import RedeemColumn from './RedeemColumn.vue'



defineProps<{ cheattree: any }>()

const count = ref(0)
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-sm">
        <h3>Cheat engine</h3>
        <div id="cheatlist">
          <CheatTree v-bind:tree="cheattree"/>
        </div>
      </div>
      <div class="col-sm">
        <RedeemColumn/>
      </div>
      <div class="col-sm">
        <h3>Actions</h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
