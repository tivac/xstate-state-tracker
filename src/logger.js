const machines = new Map();

const machineWalkerFactory = (logger) => {
    const walker = (machine = false, id = "") => machine.subscribe((update) => {
        // The first transition comes in with changed set to "undefined", so
        // only want to take this early-out when it's really-really set to false
        if(update.changed === false) {
            return;
        }

        // Return all updated state values
        logger(id || "root", update.value);

        if(!machine.children) {
            return;
        }
        
        machine.children.forEach((child, name) => {
            // Not a statechart, abort!
            if(!child.initialized || !child.state) {
                return;
            }
        
            const path = id.length ? `${id}.${name}` : name;
            
            if(!machines.has(path)) {
                machines.set(path, walker(child, path));
        
                // Clean up child after it's done
                child.onStop(() => {
                    machines.get(path).unsubscribe();
                    machines.delete(path);
                });
            }
        });
    });

    return walker;
};

export default machineWalkerFactory;
