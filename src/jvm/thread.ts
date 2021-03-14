import { Instance } from "./instance";
import { Method } from "./method";
import { VM } from "./VM";

export class Frame {
    thread : Thread;
    method : Method;

    localVariables : any[] = []
    pc : number = 0;

    constructor(thread : Thread, method : Method, parameters : any[] = []){
        this.thread = thread;
        this.method = method;
        this.localVariables.push(parameters);
    }
}

export enum ThreadState {
    IDLE = 0,
    RUNNING = 1,
    FINISHED = 2,
    WAITING = 3,
    BLOCKING = 4
}

export class Thread {
    vm : VM;

    state : ThreadState = ThreadState.IDLE;

    frameStack : Frame[] = [];
    currentFrame : Frame;

    stack : any[] = [];

    heldMonitors : Instance[] = [];
    waitInstance : Instance;

    constructor(vm : VM){
        this.vm = vm;
    }

    invoke(method : Method, parameters : any[] = []){
        if(this.currentFrame !== undefined){
            this.frameStack.push(this.currentFrame);
        }
        this.currentFrame = new Frame(this, method, parameters);
        this.state = ThreadState.RUNNING;
    }

    invokeVirtual(instance : Instance, method : Method, paramters : any[] = []){
        var _params = [];
        _params.push(instance);
        _params.push(paramters);
        this.invoke(method, _params);
    }

    wait(instance : Instance){
        this.waitInstance = instance;
        this.state = ThreadState.WAITING;
        this.waitInstance.monitorEnter(this);
    }
    
    release(instance : Instance) {
        instance.monitorExit(this);
        if(instance === this.waitInstance) {
            this.waitInstance = undefined;
        }
        else {
            var index = this.heldMonitors.indexOf(instance);
            if(index >= 0){
                this.heldMonitors.splice(index, 1);
            }
        }
        this.state = ThreadState.RUNNING;
    }

    waitFor(instance : Instance, ms : number){
        this.wait(instance);
        setTimeout(function(thread : Thread) {
            if(instance === thread.waitInstance){
                thread.release(instance);
            }
        }, ms, this);
    }

    cycle(){
        if(this.state === ThreadState.WAITING){
            if(this.waitInstance.isOwner(this)){
                this.heldMonitors.push(this.waitInstance);
                this.state = ThreadState.RUNNING;
                this.waitInstance = undefined;
            }
            else{
                return;
            }
        }

        if(this.state === ThreadState.RUNNING){
            
        }
    }
}