import { Frame } from "./frame";
import { Instance } from "./instance";
import { Method } from "./method";
import { VM } from "./VM";

export enum ThreadState {
    NOT_STARTED = 0,
    IDLE = 1,
    RUNNING = 2,
    FINISHED = 3,
    WAITING = 4,
    BLOCKING = 5
}

export class Thread {
    vm : VM;

    state : ThreadState = ThreadState.IDLE;

    frameStack : Frame[] = [];
    currentFrame : Frame;

    stack : any[] = [];

    name : string;

    heldMonitors : Map<Instance, number> = new Map<Instance, number>();
    waitInstance : Instance;

    constructor(vm : VM, name : string){
        this.vm = vm;
        this.name = name;
    }

    enterFrame(method : Method, parameters : any[] = []){
        if(this.currentFrame !== undefined){
            this.frameStack.push(this.currentFrame);
        }
        this.currentFrame = new Frame(this, method, parameters);
        this.state = ThreadState.RUNNING;
    }

    exitFrame(){
        if(this.frameStack.length === 0){
            this.state = ThreadState.FINISHED;
        }
        else{
            this.currentFrame = this.frameStack.pop();
        }
    }

    isAlive() : boolean {
        return this.state !== ThreadState.NOT_STARTED && this.state !== ThreadState.FINISHED;
    }

    sleep(ms) : void {
        if(this.state !== ThreadState.RUNNING){
            throw new Error("Thread must be in the RUNNING state in order to sleep.");
        }
        this.state = ThreadState.IDLE;
        setTimeout(function(thread : Thread) {
            thread.state = ThreadState.RUNNING;
        }, ms, this);
    }

    private aquireMonitor(instance : Instance) : void {
        instance.monitorOwner = this;
        this.waitInstance = undefined;
        this.state = ThreadState.RUNNING;
        if(this.heldMonitors.has(instance)){
            var value = this.heldMonitors.get(instance);
            this.heldMonitors.set(instance, value + 1);
        }
        else{
            this.heldMonitors.set(instance, 1);
        }
    }

    monitorEnter(instance : Instance) : void {
        if(this.state !== ThreadState.RUNNING){
            throw new Error("Thread must be in the RUNNING state in order to enter a monitor.");
        }

        if(instance.monitorOwner === undefined || instance.monitorOwner === this){
            this.aquireMonitor(instance);
        }
        else{
            this.waitInstance = instance;
            this.state = ThreadState.WAITING;
        }
    }

    monitorExit(instance : Instance) : void {
        if(this.heldMonitors.has(instance)){
            var value = this.heldMonitors.get(instance);
            if(value > 1){
                this.heldMonitors.set(instance, value - 1);
            }
            else{
                this.state = ThreadState.RUNNING;
                this.heldMonitors.delete(instance);
                if(instance.monitorOwner === this){
                    instance.monitorOwner = undefined;
                }
            }
        }
        else if(this.waitInstance === instance){
            this.state = ThreadState.RUNNING;
            this.waitInstance = undefined;
        }
    }

    cycle(){
        if(this.state === ThreadState.WAITING){
            if(this.waitInstance.monitorOwner === undefined){
                this.aquireMonitor(this.waitInstance);
            }
            else{
                return;
            }
        }

        if(this.state === ThreadState.RUNNING){
            this.currentFrame.cycle();
        }
    }
}