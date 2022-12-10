<script lang="ts">
    import CheatTreeItem from './CheatTreeItem.vue'
    import { isProxy, toRaw } from 'vue';


    export default {
        components: {CheatTreeItem},
        props: ['tree'],
        data() {
            return {
                
            }
        },
        updated(){
            //console.log("In mount", this.$el);
            // @ts-ignore
            $(this.$el).jstree({
                "core" : {
                "animation" : 0,
                "check_callback" : true,
                "themes" : { "stripes" : true },
                },
                "contextmenu":{
                "items":{
                "hello":{
                    "label": "Dingus",
                    "action": function(e:any){
                    
                    },
                },
                },
                },
                "plugins" : [
                "contextmenu", "dnd", "search",
                "state", "wholerow"
                ]
            });
        }
    }
    /*
      
    */
   // <CheatTreeItem v-for="treepart in tree"/>
</script>

<template>
    <div>
    <ul>
        <li v-for="cheat in tree">
            {{cheat.Description}}
            <CheatTreeItem v-if="cheat.Count" :treepart="cheat.Child" />
        </li>
    </ul>
</div>
</template>