<script setup lang="ts">
    defineProps<{ treepart: any }>();
</script>

<template>
    <ul>
        <li v-for="cheat in treepart">{{cheat.Description}}<CheatTreeItem v-if="cheat.Count" :treepart="cheat.Child"/></li>
    </ul>
</template>

<style>
</style>