import { CodeAttributeInfo } from "./attributes";
import { BinaryReader } from "./binaryReader";
import { Class } from "./class";
import { Member } from "./member";

export class Method extends Member {

    codeInfo : CodeAttributeInfo;

    isSynchronized() : boolean {
        return (this.accessFlags & 0x0020) > 0;
    }

    isBridge() : boolean {
        return (this.accessFlags & 0x0040) > 0;
    }

    isVarArgs() : boolean {
        return (this.accessFlags & 0x0080) > 0;
    }

    isNative() : boolean {
        return (this.accessFlags & 0x0100) > 0;
    }

    isAbstract() : boolean {
        return (this.accessFlags & 0x0400) > 0;
    }

    isStrict() : boolean {
        return (this.accessFlags & 0x0800) > 0;
    }

    static read(declaringClass : Class, reader : BinaryReader) : Method {
        var member : Member = Member.read(declaringClass, reader);
        var result : Method = new Method();
        result.accessFlags = member.accessFlags;
        result.attributes = member.attributes;
        result.declaringClass = member.declaringClass;
        result.descriptorIndex = member.descriptorIndex;
        result.nameIndex = member.nameIndex;

        var codeAttribute = result.findAttribute("Code");
        if(codeAttribute !== undefined){
            result.codeInfo = CodeAttributeInfo.read(codeAttribute);
        }
        return result;
    }
}