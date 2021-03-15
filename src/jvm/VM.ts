import { Thread } from "./thread";

export class VM {
    threads : Thread[];

    constructor(){
        this.threads = [];
    }

    createThread(name : string) : Thread {
        var t = new Thread(this, name);
        this.threads.push(t);
        return t;
    }

    cycle(){
        for(var i = 0; i < this.threads.length; i++){
            this.threads[i].cycle();
        }
    }
}