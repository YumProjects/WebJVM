import { Class } from "./class";
import { Thread } from "./thread";

export class Instance {
    definingClass : Class;
    monitorOwner : Thread;
}