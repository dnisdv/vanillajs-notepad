import Router from "./src/router/router";
import "./src/components/note/note";
import store from "./src/store";
import "./src/components/notes/notes";
import "./src/components/emojiPicker";
import "./src/components/Todo/Todo";
import "./src/components/Todo/TodoItem/TodoItem";
import "./index.css";

const router = new Router({
  mode: "hash",
  root: "/",
});

class App extends HTMLElement {
  connectedCallback() {
    router
      .add(/note\/(.*)/, (id) => {
        const alreadyNote = store.state.notes.map((i) => +i.id === +id);

        if (!alreadyNote.includes(true)) {
          const lastNote = store.state.notes[store.state.notes.length - 1];
          const noteId = lastNote ? lastNote.id + 1 : 1;

          store.dispatch("addNote", {
            emoji: "\ud83d\ude00",
            id: noteId,
            title: "",
            moto: "",
            basic_information: "",
            additional_information: "",
            todoes: [
              {
                isOpen: true,
                id: 1,
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
                  {
                    id: 3,
                    title: "",
                    checked: false,
                  },
                  {
                    id: 4,
                    title: "",
                    checked: false,
                  },
                ],
              },
            ],
            additional_other_information: "",
            created_date: new Date(),
            edited: new Date(),
          });

          window.history.pushState(
            null,
            null,
            `#note/${
              store.state.notes[store.state.notes.length - 1]
                ? store.state.notes[store.state.notes.length - 1].id || 1
                : 1
            }`
          );
          this.innerHTML = `<note-pad note-id=${noteId}></note-pad>`;
          return store.events.publish("hashChange", noteId);
        }
        this.innerHTML = `<note-pad note-id=${id}></note-pad>`;
        return store.events.publish("hashChange", id);
      })
      .add("", () => {
        return window.history.pushState(
          null,
          null,
          `#note/${
            store.state.notes[store.state.notes.length - 1]
              ? store.state.notes[store.state.notes.length - 1].id || 1
              : 1
          }`
        );
      });
  }
}

window.customElements.define("main-app", App);
