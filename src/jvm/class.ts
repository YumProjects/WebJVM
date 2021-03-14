import { Attribute } from "./attributes";
import Member from "./member";
import { Method } from "./method";

export default class Class {

    minorVersion : number = 0;
    majorVersion : number = 0;

    constantPool : any[] = [];

    accessFlags : number = 0;

    thisClassIndex : number = 0;
    superClassIndex : number = 0;

    interfaces : number[] = [];
    fields : Member[] = [];
    methods : Method[] = [];
    attributes : Attribute[] = [];

    getName() : string {
        return this.constantPool[this.constantPool[this.thisClassIndex].nameIndex].value;
    }

    getSuperClassName() : string {
        return this.constantPool[this.constantPool[this.superClassIndex].nameIndex].value;
    }

    getAttributeInfo(name) : number[] {
        for(var i = 0; i < this.attributes.length; i++){
            if(name === this.constantPool[this.attributes[i].nameIndex]){
                return this.attributes[i].info;
            }
        }
    }

    findMethod(name : string, descriptor : string = undefined){
        for(var i = 0; i < this.methods.length; i++){
            if(this.methods[i].getName() === name){
                if(descriptor === undefined || descriptor === this.methods[i].getDescriptor()){
                    return this.methods[i];
                }
            }
        }
    }

    toString() : string {
        return this.getName();
    }
}