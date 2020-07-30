export default {
  addNote(state, payload) {
    state.notes.push(payload);
    return state;
  },

  updateNote(state, payload) {
    state.notes[payload.index] = {
      ...state.notes[payload.index],
      ...payload.data,
    };
    return state;
  },
  updateTodo(state, { noteId, todoId, data }) {
    const todoIndex = state.notes[noteId].todoes.findIndex(
      (i) => +i.id === +todoId
    );
    state.notes[noteId].todoes[todoIndex] = {
      ...state.notes[noteId].todoes[todoIndex],
      ...data,
    };
    return state;
  },
  addTodoToNote(state, { noteId }) {
    const todoesTemplate = [
      ...state.notes[noteId].todoes,
      {
        isOpen: false,
        id:
          state.notes[noteId].todoes.length === 0
            ? 1
            : state.notes[noteId].todoes[state.notes[noteId].todoes.length - 1]
                .id + 1,
        title: "",
        data: [
          {
            id: 1,
            title: "",
            checked: false,
          },
          {
            id: 2,
            title: "",
            checked: false,
          },
        ],
      },
    ];
    state.notes[noteId].todoes = todoesTemplate;
    return state;
  },
  addTodoItemToNote(state, { index, todoId, todoItemId }) {
    const todoIndex = state.notes[index].todoes.findIndex(
      (i) => +i.id === +todoId
    );
    const todoItemIndex = state.notes[index].todoes[todoIndex].data.findIndex(
      (i) => +i.id === +todoItemId
    );
    const maxId = Math.max(
      ...state.notes[index].todoes[todoIndex].data.map((i) => i.id)
    );
    state.notes[index].todoes[todoIndex].data.splice(todoItemIndex + 1, 0, {
      id: maxId + 1,
      title: "",
      checked: false,
    });
    return state;
  },
  todoChanger(state, { noteId, todoId, dataId, key, data }) {
    const todoIndex = state.notes[noteId].todoes.findIndex(
      (i) => +i.id === +todoId
    );
    state.notes[+noteId].todoes[+todoIndex].data[+dataId][key] = data;
    return state;
  },
  todoTitleChanger(state, { index, todoid, key, data }) {
    state.notes[+index].todoes[+todoid][key] = data;
    return state;
  },
  removeNote(state, { noteId }) {
    const noteIndex = state.notes.findIndex((i) => +i.id === +noteId);
    state.notes.splice(noteIndex, 1);
    return state;
  },
  removeTodo(state, { noteId, todoId }) {
    const todoes = state.notes[+noteId].todoes.filter((i) => {
      return +i.id !== +todoId;
    });
    state.notes[+noteId].todoes = todoes;
    return state;
  },
  removeTodoItem(state, { noteId, todoId, todoItemId }) {
    const todoIndex = state.notes[+noteId].todoes.findIndex(
      (i) => +i.id === +todoId
    );
    const notes = state.notes[+noteId].todoes[+todoIndex].data.filter((i) => {
      return +i.id !== +todoItemId;
    });
    state.notes[+noteId].todoes[+todoIndex].data = notes;
    return state;
  },
};
