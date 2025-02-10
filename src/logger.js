const machines = new Map();

const ROOT_ID = "root";

const findChildren = (id, state, logger) => {
	if(!state.children) {
		return;
	}

	for(const name in state.children) {
		const child = state.children[name];

		// Not a statechart, ignore it
		if(!child?.logic?.__xstatenode) {
			continue;
		}

		const path = id === ROOT_ID ? name : `${id}.${name}`;

		if(!machines.has(path)) {
			// eslint-disable-next-line no-use-before-define -- It's fine, but weird I agree
			walker(path, child, logger);
		}
	}
};

const handleState = (id, state, logger) => {
	logger(id, state.value, state);
	findChildren(id, state, logger);
};

const walker = (id, machine, logger) => {
	let lastState = machine.getSnapshot();

	handleState(id, lastState, logger);

	const { unsubscribe } = machine.subscribe({
		next(state) {
			if(state === lastState) {
				return;
			}

			lastState = state;

			handleState(id, state, logger);
		},

		// Clean up when finished
		complete() {
			if(!machines.has(id)) {
				return;
			}

			machines.get(id)();
			machines.delete(id);
			lastState = undefined;
		},
	});

	machines.set(id, unsubscribe);

	return unsubscribe;
};

const stateTracker = (machine, logger) => walker(ROOT_ID, machine, logger);

export default stateTracker;
