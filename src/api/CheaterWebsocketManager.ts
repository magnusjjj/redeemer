export {CheaterWebSocketManager};
const { app } = require('@electron/remote')

export interface TypedObject {
    type: NonNullable<string>;
}

export type onPacketCallbackType = (message:TypedObject) => void;
export type onStatusChangeCallbackType = (message:string) => void;

class CheaterWebSocketManager {
    static socket : WebSocket;
    static onStatusChange = Array<onStatusChangeCallbackType>();
    static onPacketType : Map<string, Array<onPacketCallbackType>> = new Map<string, Array<onPacketCallbackType>>();
    
//(message:string) => string

    static registerPacketCallback(typeName:string, callback: onPacketCallbackType){
        let temp = CheaterWebSocketManager.onPacketType.get(typeName);
        if(temp === undefined)
            temp = new Array<(input:object) => string>();
        temp.push(callback);
        CheaterWebSocketManager.onPacketType.set(typeName, temp);
    }

    static _doOnStatusChange(message:string){
        CheaterWebSocketManager.onStatusChange.forEach( callback => {
            callback(message);
        });
    }

    static _doOnPacketType(obj:TypedObject){
        let packetlist = CheaterWebSocketManager.onPacketType.get(obj.type);
        if(packetlist !== undefined){
            packetlist.forEach(callback => {
                callback(obj);
            });
        }
    }

    static connectthread() {
        try {
            CheaterWebSocketManager.socket = new WebSocket('ws://localhost:8000/Utility');
        } catch {
            CheaterWebSocketManager._doOnStatusChange("Could not connect, retrying...");
            setTimeout(CheaterWebSocketManager.connectthread, 1000);
            return;
        }

        // Connection opened
        CheaterWebSocketManager.socket.addEventListener('open', (event) => {
            CheaterWebSocketManager._doOnStatusChange("Connected!");
            console.log(app);
            let path:string = app.getAppPath();
            var luapath = JSON.stringify(path + "/lua_modules/?.lua");

            if(path.includes(";") || path.includes("?")){
                alert("Your path, "+ path + " contains ; or ?. This will break things.");
                return;
            }

            CheaterWebSocketManager.socket.send(JSON.stringify({type: "runlua", code: 
            `packageloc = ${luapath}
            if not string.find(package.path, packageloc) then
                package.path = package.path .. ";" .. packageloc
            end
            package.loaded.cheatredeems_addrlist = nil
            cheatredeems_addrlist = require "cheatredeems_addrlist"
            cheatredeems_addrlist.sendCheatList()
            `
            }));
        });

        // Listen for messages
        CheaterWebSocketManager.socket.addEventListener('message', (event) => {
            //document.getElementById("log").textContent += event.data;
            var o = JSON.parse(event.data)
            if(o["type"] == 'DebugMessage'){
                var o2 = JSON.parse(o["stackItems"][0]["value"])
                if(o2["type"]){
                    CheaterWebSocketManager._doOnPacketType(o2);
                }
                console.log("Debug message", o2);
            } else {
                console.log('Message from server ', o);
            }
        });
        
        CheaterWebSocketManager.socket.addEventListener('close', (event) => {
            CheaterWebSocketManager._doOnStatusChange("Connection closed... Reconnecting...");
            setTimeout(CheaterWebSocketManager.connectthread, 1000);
        });
        
        
    }

    static start(){
        CheaterWebSocketManager.connectthread();
    }
}