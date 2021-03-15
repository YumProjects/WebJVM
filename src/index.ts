import * as webJVM from "./jvm";

var vm = new webJVM.VM();

var mainThread : webJVM.Thread = vm.createThread("Main Thread");

webJVM.ClassLoader.loadClass("org/benhess/Main").then((mainClass : webJVM.Class) => {
    var mainMethod : webJVM.Method = mainClass.findMethod("main");
    mainThread.enterFrame(mainMethod);
});


setInterval(function() {
    vm.cycle();
}, 1);