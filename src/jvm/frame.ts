import { CodeAttributeInfo } from "./attributes";
import { Class } from "./class";
import { ClassLoader } from "./classLoader";
import { Method } from "./method";
import { Thread, ThreadState } from "./thread";
import { Utils } from "./utils";
import { JInteger } from "./value";

export class Frame {
    thread : Thread;
    method : Method;
    codeInfo : CodeAttributeInfo;

    localVariables : any[] = []
    pc : number = 0;

    exitCallback : () => void;

    constructor(thread : Thread, method : Method, parameters : any[], exitCallback : () => void){
        this.thread = thread;
        this.method = method;
        this.codeInfo = method.codeInfo;
        this.exitCallback = exitCallback;
        for(var i = 0; i < parameters.length; i++){
            this.localVariables.push(parameters[i]);
        }
    }
    
    startBlockingAsync(asyncAction : () => Promise<void>){
        this.thread.state = ThreadState.BLOCKING;
        asyncAction().then(() => {
            this.thread.state = ThreadState.RUNNING;
        });
    }

    readByte(){
        return this.codeInfo.code[this.pc++];
    }

    readU16(){
        this.pc += 2;
        return (this.codeInfo.code[this.pc - 2] << 8) | this.codeInfo.code[this.pc - 1];
    }

    cycle(){
        var opCode : number = this.readByte();

        switch (opCode) {

            case 0x2: this.thread.stack.push(new JInteger(-1)); break;  // iconst_m1
            case 0x3: this.thread.stack.push(new JInteger(0)); break;   // iconst_0
            case 0x4: this.thread.stack.push(new JInteger(1)); break;   // iconst_1
            case 0x5: this.thread.stack.push(new JInteger(2)); break;   // iconst_2
            case 0x6: this.thread.stack.push(new JInteger(3)); break;   // iconst_3
            case 0x7: this.thread.stack.push(new JInteger(4)); break;   // iconst_4
            case 0x8: this.thread.stack.push(new JInteger(5)); break;   // iconst_5
            
            case 0xb1: this.thread.exitFrame(); break;  // return

            case 0xb8:  // invokestatic
                this.startBlockingAsync(async () => {
                    var currentClass = this.method.declaringClass;
                    var methodRef = currentClass.constantPool[this.readU16()];
                    var classRef = currentClass.constantPool[methodRef.classIndex];
                    var className = currentClass.constantPool[classRef.nameIndex].value;
                    var nameAndTypeInfo = currentClass.constantPool[methodRef.nameAndTypeIndex];
                    var methodName = currentClass.constantPool[nameAndTypeInfo.nameIndex].value;
                    var methodDescriptor = currentClass.constantPool[nameAndTypeInfo.descriptorIndex].value;

                    var methodClass : Class = await ClassLoader.loadClass(this.thread, className);
                    var method : Method = methodClass.findMethod(methodName, methodDescriptor);

                    Utils.log("Invoking static method " + method.toString());

                    await this.thread.invokeStatic(method);
                })
                break;

            default:
                Utils.error("Unimplemented opcode: 0x" + opCode.toString(16));
                this.thread.stop();
                return;
        }

        if(this.pc >= this.codeInfo.code.length){
            this.thread.exitFrame();
            this.exitCallback();
        }
    }
}