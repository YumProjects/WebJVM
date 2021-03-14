import { Thread } from "./thread";

export class Instance {
    ownerQueue : Thread[] = [];

    isOwner(thread : Thread) : boolean {
        return this.ownerQueue[0] === thread;
    }

    monitorEnter(thread : Thread) : void {
        this.ownerQueue.push(thread);
    }

    monitorExit(thread : Thread) : void {
        var index = this.ownerQueue.indexOf(thread);
        if(index >= 0){
            this.ownerQueue.splice(index, 1);
        }
    }
}