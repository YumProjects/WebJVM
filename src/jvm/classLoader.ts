import { Class } from "./class";
import { Attribute } from "./attributes";
import { BinaryReader } from "./binaryReader";
import { Utils } from "./utils";
import { Method } from "./method";
import { Field } from "./field";

export class ClassLoader {

    static loadedClasses = {};

    static readConstantPoolEntry(reader) : any {
        var tag = reader.readU8();
        switch(tag){
            case 7: // Class
                return { tag: tag, nameIndex: reader.readU16() };

            case 9: // Fieldref
            case 10: // Methodref
            case 11: // InterfaceMethodref
                return { tag: tag, classIndex: reader.readU16(), nameAndTypeIndex: reader.readU16() };

            case 8: // String
                return { tag: tag, stringIndex: reader.readU16() };

            case 3: // Integer
                return { tag: tag, value: reader.readS32() };

            case 4: // Float
                return { tag: tag, value: reader.readFloat() };

            case 5: // Long
                return { tag: tag, value: reader.readS64() };

            case 6: // Double
                return { tag: tag, value: reader.readDouble() };

            case 12: // NameAndType
                return { tag: tag, nameIndex: reader.readU16(), descriptorIndex: reader.readU16() };
            
            case 1: // Utf8
                return { tag: tag, value: reader.readString(reader.readU16()) };

            case 15: // MethodHandle
                return { tag: tag, referenceKind: reader.readU8(), referenceIndex: reader.readU16() };
            
            case 16: // MethodType
                return { tag: tag, descriptorIndex: reader.readU16() };

            case 18: // InvokeDynamic
                return { tag: tag, bootstrapMethodAttrIndex: reader.readU16(), nameAndTypeIndex: reader.readU16() };

            default:
                throw new Error("Unknown constant tag " + tag + ".");
        }
    }

    static readClass(buffer) : Class {
        var c = new Class();
        var reader = new BinaryReader(buffer);

        if(reader.readU32() !== 0xCAFEBABE){
            throw new Error("Invalid magic number on class.");
        }

        c.minorVersion = reader.readU16();
        c.majorVersion = reader.readU16();

        var constantPoolCount = reader.readU16();
        for(var i = 1; i < constantPoolCount; i++){
            c.constantPool[i] = this.readConstantPoolEntry(reader);
            if(c.constantPool[i].tag === 5 || c.constantPool[i].tag === 6){
                i++;
            }
        }

        c.accessFlags = reader.readU16();

        c.thisClassIndex = reader.readU16();
        c.superClassIndex = reader.readU16();

        var interfacesCount = reader.readU16();
        for(var i = 0; i < interfacesCount; i++){
            c.interfaces.push(reader.readU16());
        }

        var fieldCount = reader.readU16();
        for(var i = 0; i < fieldCount; i++){
            c.fields.push(Field.read(c, reader));
        }

        var methodCount = reader.readU16();
        for(var i = 0; i < methodCount; i++){
            c.methods.push(Method.read(c, reader));
        }

        var attributeCount = reader.readU16();
        for(var i = 0; i < attributeCount; i++){
            c.attributes.push(Attribute.read(c, reader));
        }

        return c;
    }

    static async loadClass(name) : Promise<Class> {
        if(this.loadedClasses[name] !== undefined){
            return this.loadedClasses[name];
        }

        var res = await fetch("classpath/" + name + ".class");
        var buffer = await res.arrayBuffer();
        var c = this.readClass(buffer);
        this.loadedClasses[name] = c;

        Utils.log("Loaded class '" + c.getName() + "'.");

        var clinit : Method = c.findMethod("<clinit>", "()V");

        var init : Method = c.findMethod("<init>");

        Utils.log("Class init: " + clinit);

        Utils.log("Constructor: " + init);

        return c;
    }
}