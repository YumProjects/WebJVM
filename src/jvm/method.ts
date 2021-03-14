import { CodeAttributeInfo } from "./attributes";
import BinaryReader from "./binaryReader";
import Class from "./class";
import Member from "./member";

export class Method extends Member {

    codeInfo : CodeAttributeInfo;

    static read(declaringClass : Class, reader : BinaryReader) : Method {
        var result = Member.read(declaringClass, true, reader) as Method;
        var codeAttribute = result.findAttribute("Code");
        if(codeAttribute !== undefined){
            result.codeInfo = CodeAttributeInfo.read(codeAttribute);
        }
        return result;
    }
}