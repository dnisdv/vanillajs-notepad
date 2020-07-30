export default {
  addNote(context, payload) {
    context.commit("addNote", payload);
  },
  updateNote(context, payload) {
    context.commit("updateNote", payload);
  },
  updateTodo(context, payload) {
    context.commit("updateTodo", payload);
  },
  addTodoToNote(context, payload) {
    context.commit("addTodoToNote", payload);
  },
  addTodoItemToNote(context, payload) {
    context.commit("addTodoItemToNote", payload);
  },
  removeNote(context, payload) {
    context.commit("removeNote", payload);
  },
  todoChanger(context, payload) {
    context.commit("todoChanger", payload);
  },
  todoTitleChanger(context, payload) {
    context.commit("todoTitleChanger", payload);
  },
  removeTodo(context, payload) {
    context.commit("removeTodo", payload);
  },
  removeTodoItem(context, payload) {
    context.commit("removeTodoItem", payload);
  },
};
