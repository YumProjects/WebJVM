import { BinaryReader } from "./binaryReader";
import { Class } from "./class";
import { Member } from "./member";

export class Field extends Member {
    static read(declaringClass : Class, reader : BinaryReader){
        return Member.read(declaringClass, reader) as Field;
    }
}