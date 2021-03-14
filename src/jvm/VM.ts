import { Thread } from "./thread";

export class VM {
    threads : Thread[];

    constructor(){
        this.threads = [];
    }

    createThread() : Thread {
        var t = new Thread(this);
        this.threads.push(t);
        return t;
    }

    cycle(){
        for(var i = 0; i < this.threads.length; i++){
            this.threads[i].cycle();
        }
    }
}