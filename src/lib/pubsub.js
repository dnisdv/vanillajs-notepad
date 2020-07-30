export default class PubSub {
  constructor() {
    this.events = {};
  }

  subscribe(event, callback) {
    const self = this;

    if (!{}.hasOwnProperty.call(self.events, event)) {
      self.events[event] = [];
    }

    return self.events[event].push(callback);
  }

  publish(event, data = {}) {
    const self = this;
    if (!{}.hasOwnProperty.call(self.events, event)) {
      return [];
    }
    return self.events[event].map((callback) => callback(data));
  }
}
