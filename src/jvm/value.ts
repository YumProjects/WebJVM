export interface JValue {
}

export class JInteger implements JValue {
    value : number;
    constructor(value : number){
        this.value = value;
    }
}