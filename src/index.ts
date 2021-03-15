import * as webJVM from "./jvm";
import { Utils } from "./jvm";

// Create a new instance of the VM.
var vm = new webJVM.VM();

// Create a thread that will be used to run the main method.
var mainThread : webJVM.Thread = vm.createThread("Main Thread");

/* Load the main class 'org/benhess/Main' (in java: 'org.benhess.Main').
   The class file will be fetched from the server's root + '/classpath/org/benhess/Main.class'. */
webJVM.ClassLoader.loadClass(mainThread, "org/benhess/Main").then((mainClass : webJVM.Class) => {

    // Find the a method called "main" in the main.
    var mainMethod : webJVM.Method = mainClass.findMethod("main");

    // Call the main method on the main thread by invoking a new frame.
    mainThread.invokeNewFrame(mainMethod);
});


// Run the VM by calling cycle() in a loop.
setInterval(function() {
    vm.cycle(); // Steps each thread by one instruction.
}, 1);