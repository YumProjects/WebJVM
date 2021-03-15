import { Attribute } from "./attributes";
import { Class } from "./class";

export class Member {
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

    isPublic() : boolean {
        return (this.accessFlags & 0x0001) > 0;
    }

    isPrivate() : boolean {
        return (this.accessFlags & 0x0002) > 0;
    }

    isProtected() : boolean {
        return (this.accessFlags & 0x0004) > 0;
    }

    isStatic() : boolean {
        return (this.accessFlags & 0x0008) > 0;
    }

    isFinal() : boolean {
        return (this.accessFlags & 0x0010) > 0;
    }

    isSynthetic() : boolean {
        return (this.accessFlags & 0x1000) > 0;
    }

    toString() : string {
        return this.declaringClass.getName() + "." + this.getName() + this.getDescriptor();
    }

    static read(declaringClass, reader) : Member {
        var result : Member = new Member();
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