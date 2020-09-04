import store from "../../store";
import trashIcon from "../../assets/img/trash.svg";
import onPaste from "../../lib/pasteHandler";

import "./Todo.css";

export default class Todo extends HTMLElement {
  WrapperList;

  constructor() {
    super();
    this.noteId = this.getAttribute("note-id");
    this.noteIndex = store.state.notes.findIndex((i) => +i.id === +this.noteId);

    // store.events.subscribe("stateChange", () => {
    //   this.connectedCallback();
    // });
  }

  eventHandler() {
    const titleChangeHandler = (e) => {
      if (e.keyCode === 13) return e.preventDefault();

      const todoIndex = store.state.notes[this.noteIndex].todoes.findIndex(
        (i) => +i.id === +e.target.parentNode.parentNode.dataset.id
      );
      return store.dispatch("todoTitleChanger", {
        noteId: this.noteId,
        todoid: todoIndex,
        key: "title",
        data: e.target.innerHTML,
      });
    };

    document
      .querySelectorAll(".Note_Additional_Todo_Wrapper_Main_Title")
      .forEach((i) => {
        i.addEventListener("keydown", (e) => titleChangeHandler(e));
        i.addEventListener("input", (e) => titleChangeHandler(e));
        i.addEventListener("paste", onPaste);
      });

    document
      .querySelectorAll(".Note_Additional_Todo_Wrapper_Actions_Trash")
      .forEach((i) => {
        i.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();
          store.dispatch("removeTodo", {
            noteId: this.noteId,
            todoId: e.target.dataset.id,
          });
          return this.connectedCallback();
          // return this.render();
        });
      });

    document
      .querySelectorAll(".Note_Additional_Todo_Wrapper_Main")
      .forEach((i) => {
        i.addEventListener("click", (e) => {
          if (e.target.className === "Note_Additional_Todo_Wrapper_Main_Title")
            return e.preventDefault();
          store.dispatch("updateTodo", {
            noteId: this.noteId,
            todoId: +e.currentTarget.parentNode.dataset.id,
            data: {
              isOpen: !e.currentTarget.parentNode.className
                .split(" ")
                .includes("Open"),
            },
          });
          return this.connectedCallback();
          // return this.render();
        });
      });
  }

  render() {
    this.noteIndex = store.state.notes.findIndex((i) => +i.id === +this.noteId);

    const TodoTemplate = () => {
      return `${
        store.state.notes[this.noteIndex]
          ? store.state.notes[this.noteIndex].todoes
              .map((i) => {
                return `<div data-id=${
                  i.id
                } class='Note_Additional_Todo_Wrapper ${
                  i.isOpen ? "Open" : ""
                }'>
                        <div class='Note_Additional_Todo_Wrapper_Main'>
                            <h2 data-placeholder='Untitled List' spellcheck="false" contentEditable="true" class='Note_Additional_Todo_Wrapper_Main_Title'>${
                              i.title
                            }</h2>
                            <div class='Note_Additional_Todo_Wrapper_Actions'>
                                <div data-id=${
                                  i.id
                                } class='Note_Additional_Todo_Wrapper_Actions_Trash'>
                                    <img data-id=${
                                      i.id
                                    } class='Note_Additional_Todo_Wrapper_Actions_Trash_Icon' src=${trashIcon}></img>
                                </div>
                                <div class='Note_Additional_Todo_Wrapper_Actions_Expand'>
                                    <span class='Note_Additional_Todo_Wrapper_Actions_Expand_Icon'></span>
                                </div>
                            </div>
                        </div>
                        <todo-items note-id=${this.noteId} todo-id=${
                  i.id
                } class='Note_Additional_Todo_WrapperList'></todo-items>
                </div>`;
              })
              .join("")
          : ""
      }
        <div class='Note_Additional_Todo_Action'>
        ${
          store.state.notes[this.noteIndex].todoes.length === 0
            ? "<span>add list</span>"
            : ""
        }
          <button class='Note_Additional_Todo_Action_Add'>+ Add list</button>
        </div>
        `;
    };

    this.innerHTML = TodoTemplate();
  }

  connectedCallback() {
    store.events.subscribe("updateTodo", (noteId) => {
      if (+noteId === +this.noteId) {
        this.connectedCallback();
      }
    });

    this.noteIndex = store.state.notes.findIndex((i) => +i.id === +this.noteId);
    this.render();

    document
      .querySelector(".Note_Additional_Todo_Action_Add")
      .addEventListener("click", () => {
        store.dispatch("addTodoToNote", { noteId: this.noteId });
        this.connectedCallback();
        // this.render();
      });
    this.eventHandler();
  }

  disconnectedCallback() {}
}

window.customElements.define("note-todo", Todo);
