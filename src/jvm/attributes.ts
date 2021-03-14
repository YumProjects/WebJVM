import BinaryReader from "./binaryReader";
import Class from "./class";

export class Attribute {
    declaringClass : Class;
    nameIndex : number = 0;
    info : number[] = [];

    getName() : string {
        return this.declaringClass.constantPool[this.nameIndex].value;
    }

    static read(declaringClass : Class, reader : BinaryReader) : Attribute {
        var attribute = new Attribute();
        attribute.declaringClass = declaringClass;
        attribute.nameIndex = reader.readU16();
        attribute.info = reader.readBytes(reader.readU32());
        return attribute;
    }
}

export class ExceptionTableEntry {
    startPC : number;
    endPC : number;
    handlerPC : number;
    catchTypeIndex : number;

    static read(reader : BinaryReader){
        var entry = new ExceptionTableEntry();
        entry.startPC = reader.readU16();
        entry.endPC = reader.readU16();
        entry.handlerPC = reader.readU16();
        entry.catchTypeIndex = reader.readU16();
        return entry;
    }
}

export class CodeAttributeInfo {
    attribute : Attribute;
    maxStack : number;
    maxLocals : number;
    code : number[];
    exceptionTable : ExceptionTableEntry[];
    attributes : Attribute[];

    static read(attribute : Attribute) : CodeAttributeInfo {
        var result : CodeAttributeInfo = new CodeAttributeInfo();
        var reader : BinaryReader = BinaryReader.fromByteArray(attribute.info);

        result.attribute = attribute;

        result.maxStack = reader.readU16();
        result.maxLocals = reader.readU16();

        var codeLength = reader.readU32();
        result.code = reader.readBytes(codeLength);

        var exceptionTableCount = reader.readU16();
        for(var i = 0; i < exceptionTableCount; i++){
            result.exceptionTable.push(ExceptionTableEntry.read(reader));
        }

        return result;
    }
}