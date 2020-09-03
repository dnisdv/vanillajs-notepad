export default {
  addNote(state, payload) {
    state.notes.push(payload);
    return state;
  },

  updateNote(state, { noteId, data }) {
    const noteIndex = state.notes.findIndex((i) => +i.id === +noteId);
    state.notes[noteIndex] = {
      ...state.notes[noteIndex],
      ...data,
    };
    return state;
  },
  updateTodo(state, { noteId, todoId, data }) {
    const noteIndex = state.notes.findIndex((i) => +i.id === +noteId);
    const todoIndex = state.notes[noteIndex].todoes.findIndex(
      (i) => +i.id === +todoId
    );
    state.notes[noteIndex].todoes[todoIndex] = {
      ...state.notes[noteIndex].todoes[todoIndex],
      ...data,
    };
    return state;
  },
  addTodoToNote(state, { noteId }) {
    const noteIndex = state.notes.findIndex((i) => +i.id === +noteId);
    const todoesTemplate = [
      ...state.notes[noteIndex].todoes,
      {
        isOpen: false,
        id:
          state.notes[noteIndex].todoes.length === 0
            ? 1
            : state.notes[noteIndex].todoes[
                state.notes[noteIndex].todoes.length - 1
              ].id + 1,
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
    state.notes[noteIndex].todoes = todoesTemplate;
    return state;
  },
  addTodoItemToNote(state, { noteId, todoId, todoItemId }) {
    const noteIndex = state.notes.findIndex((i) => +i.id === +noteId);
    const todoIndex = state.notes[noteIndex].todoes.findIndex(
      (i) => +i.id === +todoId
    );
    const todoItemIndex = state.notes[noteIndex].todoes[
      todoIndex
    ].data.findIndex((i) => +i.id === +todoItemId);
    const maxId = Math.max(
      ...state.notes[noteIndex].todoes[todoIndex].data.map((i) => i.id)
    );
    state.notes[noteIndex].todoes[todoIndex].data.splice(todoItemIndex + 1, 0, {
      id: maxId + 1,
      title: "",
      checked: false,
    });
    return state;
  },
  todoChanger(state, { noteId, todoId, dataId, key, data }) {
    const noteIndex = state.notes.findIndex((i) => +i.id === +noteId);
    const todoIndex = state.notes[+noteIndex].todoes.findIndex(
      (i) => +i.id === +todoId
    );
    state.notes[+noteIndex].todoes[+todoIndex].data[+dataId][key] = data;
    return state;
  },
  todoTitleChanger(state, { noteId, todoid, key, data }) {
    const noteIndex = state.notes.findIndex((i) => +i.id === +noteId);
    state.notes[+noteIndex].todoes[+todoid][key] = data;
    return state;
  },
  removeNote(state, { noteId }) {
    const noteIndex = state.notes.findIndex((i) => +i.id === +noteId);
    state.notes.splice(noteIndex, 1);
    return state;
  },
  removeTodo(state, { noteId, todoId }) {
    const noteIndex = state.notes.findIndex((i) => +i.id === +noteId);
    const todoes = state.notes[+noteIndex].todoes.filter((i) => {
      return +i.id !== +todoId;
    });
    state.notes[+noteIndex].todoes = todoes;
    return state;
  },
  removeTodoItem(state, { noteId, todoId, todoItemId }) {
    const noteIndex = state.notes.findIndex((i) => +i.id === +noteId);
    const todoIndex = state.notes[+noteIndex].todoes.findIndex(
      (i) => +i.id === +todoId
    );
    const notes = state.notes[+noteIndex].todoes[+todoIndex].data.filter(
      (i) => {
        return +i.id !== +todoItemId;
      }
    );
    state.notes[+noteIndex].todoes[+todoIndex].data = notes;
    return state;
  },
};
