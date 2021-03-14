export default class BinaryReader {

    buffer : ArrayBuffer;
    dataView : DataView;
    index : number = 0;

    constructor(buffer : ArrayBuffer){
        this.buffer = buffer;
        this.dataView = new DataView(buffer);
    }

    static fromByteArray(arr : any[]){
        return new BinaryReader(new Uint8Array(arr).buffer);
    }

    readS8() : number {
        this.index += 1;
        return this.dataView.getInt8(this.index - 1);
    }

    readS16() : number {
        this.index += 2;
        return this.dataView.getInt16(this.index - 2, false);
    }

    readS32() : number {
        this.index += 4;
        return this.dataView.getInt32(this.index - 4, false);
    }

    readS64() : number {
        var high = this.readU32();
        var low = this.readU32();
        return (high << 32) | low;
    }

    readU8() : number {
        this.index += 1;
        return this.dataView.getUint8(this.index - 1);
    }

    readU16() : number {
        this.index += 2;
        return this.dataView.getUint16(this.index - 2, false);
    }

    readU32() : number {
        this.index += 4;
        return this.dataView.getUint32(this.index - 4, false);
    }

    readU64() : number {
        return this.readS64() >>> 0;
    }

    readFloat() : number  {
        this.index += 4;
        return this.dataView.getFloat32(this.index - 4, false);
    }

    readDouble() : number {
        this.index += 8;
        return this.dataView.getFloat64(this.index - 8, false);
    }

    readBytes(length : number) : number[] {
        var bytes : number[] = [];
        for(var i = 0; i < length; i++){
            bytes.push(this.readU8());
        }
        return bytes;
    }

    readChar() : string {
        return String.fromCharCode(this.readU8());
    }

    readString(length : number) : string {
        var result = "";
        for(var i = 0; i < length; i++){
            result += this.readChar();
        }
        return result;
    }
}
