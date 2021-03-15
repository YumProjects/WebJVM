export class Utils {
    static log(message) : void {
        console.log("%c[WebJVM]%c " + message, "color: blue;", "color: black");
    }
    
    static error(message){
        console.error("[WebJVM] " + message);
    }
}