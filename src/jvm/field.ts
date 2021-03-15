import { BinaryReader } from "./binaryReader";
import { Class } from "./class";
import { Member } from "./member";

export class Field extends Member {

    isVolatile() : boolean {
        return (this.accessFlags & 0x0040) > 0;
    }

    isTransient() : boolean {
        return (this.accessFlags & 0x0080) > 0;
    }

    isEnum() : boolean {
        return (this.accessFlags & 0x4000) > 0;
    }

    static read(declaringClass : Class, reader : BinaryReader){
        return Member.read(declaringClass, reader) as Field;
    }
}