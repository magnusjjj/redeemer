<script lang="ts">
    import {RedeemManager, Redeem, RedeemFile, RedeemActions} from '../api/RedeeemManager';
    import { fstat, readdir} from 'fs';
import { listenerCount } from 'process';

    export default {
        data(){
            return {
                redeemfiles: Array<RedeemFile>(),
                error: "",
            }; 
        },
        async created() {
            await this.getRedeemFiles();
        },
        methods:{
            async getRedeemFiles(){
                try {
                    this.redeemfiles = await RedeemManager.list();
                    console.log("Done with redeemfiles!");
                } catch(err:any) {
                    console.log("In getredeemfile, outer error", err);
                    this.error = err.toString();
                }
            }
        }
    }
</script>
<template>
    <h3>Redeemssss</h3>
    <select class="form-select" aria-label="Default select example">
    <option v-for="redeemfile in redeemfiles">{{redeemfile}}</option>
    </select>
    <div class="alert alert-danger" role="alert" v-if="error">
        {{error}}
    </div>
</template>