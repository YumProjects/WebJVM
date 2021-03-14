export default class Utils {
    static log(message) : void {
        console.log("%c[WebJVM]%c " + message, "color: blue;", "color: black");
    }
}