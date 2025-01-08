const machines = new Map();

const ROOT_ID = "root";

const stateTracker = (machine, logger) => {
    const walker = (machine, id = ROOT_ID) => {
        let lastState = machine.getSnapshot();

        logger(id, lastState.value);

        const { unsubscribe } = machine.subscribe({
            next(state) {
                if(state === lastState) {
                    return;
                }

                lastState = state;

                // Return all updated state values
                logger(id, state.value);

                if(!state.children) {
                    return;
                }
                
                for(const name in state.children) {
                    const child = state.children[name];

                    // Not a statechart, ignore it
                    if(!child?.logic?.__xstatenode) {
                        continue;
                    }
                
                    const path = id !== ROOT_ID ? `${id}.${name}` : name;
                    
                    if(!machines.has(path)) {
                        walker(child, path);
                    }
                }
            },

            // Clean up when finished
            complete() {
                if(!machines.has(id)) {
                    return;
                }

                machines.get(id)();
                machines.delete(id);
                lastState = null;
            }
        });

        machines.set(id, unsubscribe);

        return unsubscribe;
    };

    return walker(machine);
};

export default stateTracker;
