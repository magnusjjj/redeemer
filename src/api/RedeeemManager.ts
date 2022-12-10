import fs from "fs";

export class RedeemActions {
    type: string;
    value: string;
    constructor(){
        this.type = "value";
        this.value = "";
    }
}

export class Redeem {
    name: string;
    type: string;
    child: Array<Redeem>;
    constructor(){
        this.name = "Default";
        this.type = "default";
        this.child = new Array<Redeem>();
    }
}

export class RedeemFile {
    name: string;
    #filename: string;
    redeems: Array<Redeem>;
    constructor(){
        this.name = "Default";
        this.redeems = new Array<Redeem>();
        this.#filename = "default.json";
    }
    toString():string{
        return this.name + "(" + this.#filename + ")";
    }
    getFilename() {
        return this.#filename;
    }
}

export class RedeemManager {
    static storageroot:string = "./storage/redeems/";
    static async list():Promise<RedeemFile[]>{
        try {
            let files:string[] = await fs.promises.readdir(this.storageroot);
            console.log("Done loading directory");
            let redeems:Array<RedeemFile> = new Array<RedeemFile>();

            if(files.length == 0){
                this.save(new RedeemFile());
                files = await fs.promises.readdir(this.storageroot);
            }

            for(const thefile in files){
                let newredeem_raw:string = (await fs.promises.readFile(this.storageroot+thefile)).toString("utf-8");
                let newredeem_obj:object = JSON.parse(newredeem_raw);
                let newredeem:RedeemFile = new RedeemFile();
                Object.assign(newredeem, newredeem_obj);
                redeems.push(newredeem);
            }
            console.log("Pushing redeems" , redeems);
            return redeems;
        } catch(err:any){
            console.log("Was super error");
            if(err.code !== undefined && err.path !== undefined && err.code == "ENOENT"){
                throw Error("No redeem directory at: " + err.path);
            } else {
                throw Error("Error: " + err.toString());
            }
        }
        return new Array<RedeemFile>(); // Just shuts up no return error
    }
    
    static async save(redeem:RedeemFile){
        console.log("Was super error2");
        try {
            await fs.promises.writeFile(this.storageroot + redeem.getFilename(), JSON.stringify(redeem, null, "\t"));
        } catch (err) {
            throw err;
        }
    }
}