import { Method } from "./method";
import { Thread } from "./thread";
import { Utils } from "./utils";

export class Frame {
    thread : Thread;
    method : Method;

    localVariables : any[] = []
    pc : number = 0;

    constructor(thread : Thread, method : Method, parameters : any[] = []){
        this.thread = thread;
        this.method = method;
        for(var i = 0; i < parameters.length; i++){
            this.localVariables.push(parameters[i]);
        }
    }

    cycle(){
        Utils.log("Thread '" + this.thread.name + "' cycle.");
    }
}