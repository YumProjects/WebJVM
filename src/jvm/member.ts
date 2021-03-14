import { Attribute } from "./attributes";
import Class from "./class";

export default class Member {
    declaringClass : Class;

    accessFlags : number = 0;
    nameIndex : number = 0;
    descriptorIndex : number = 0;
    attributes : Attribute[] = [];

    getName() : string {
        return this.declaringClass.constantPool[this.nameIndex].value;
    }

    getDescriptor() : string {
        return this.declaringClass.constantPool[this.descriptorIndex].value;
    }

    findAttribute(name : string) : Attribute {
        for(var i = 0; i < this.attributes.length; i++){
            if(this.attributes[i].getName() === name){
                return this.attributes[i];
            }
        }
    }

    toString() : string {
        return this.declaringClass.getName() + "." + this.getName() + this.getDescriptor();
    }

    static read(declaringClass, reader) : Member {
        var result = new Member();
        result.declaringClass = declaringClass;

        result.accessFlags = reader.readU16();
        result.nameIndex = reader.readU16();
        result.descriptorIndex = reader.readU16();

        var attributeCount = reader.readU16();
        for(var i = 0; i < attributeCount; i++){
            result.attributes.push(Attribute.read(declaringClass, reader));
        }

        return result;
    }
}