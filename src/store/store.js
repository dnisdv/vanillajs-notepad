import PubSub from "../lib/pubsub";

export default class Store {
  constructor(params) {
    const self = this;
    self.actions = {};
    self.mutations = {};
    self.state = {};

    self.status = "resting";

    self.events = new PubSub();

    if ({}.hasOwnProperty.call(params, "actions")) {
      self.actions = params.actions;
    }

    if ({}.hasOwnProperty.call(params, "mutations")) {
      self.mutations = params.mutations;
    }

    self.state = new Proxy(params.state || {}, {
      set(state, key, value) {
        state[key] = value;
        self.events.publish("stateChange", self.state);
        localStorage.setItem("Notes", JSON.stringify(self.state));
        if (self.status !== "mutation") {
          throw new Error(`You should use a mutation to set ${key}`);
        }

        self.status = "resting";
        return true;
      },
    });
  }

  dispatch(actionKey, payload) {
    const self = this;

    if (typeof self.actions[actionKey] !== "function") {
      return false;
    }

    self.status = "action";

    self.actions[actionKey](self, payload);
    return true;
  }

  commit(mutationKey, payload) {
    const self = this;

    if (typeof self.mutations[mutationKey] !== "function") {
      throw new Error(`Mutation "${mutationKey}" doesn't exist`) && false;
    }

    self.status = "mutation";

    const newState = self.mutations[mutationKey](self.state, payload);
    self.state = Object.assign(self.state, newState);
    return true;
  }
}
