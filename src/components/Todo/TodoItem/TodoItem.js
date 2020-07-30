import store from "../../../store";
import isMobile from "../../../lib/isMobile";
import onPaste from "../../../lib/pasteHandler";
import placeCaretAtEnd from "../../../lib/placeCaretAtEnd";

import "./TodoItem.css";

export default class TodoItem extends HTMLElement {
  constructor() {
    super();
    this.noteId = this.getAttribute("note-id");
    this.todoId = +this.getAttribute("todo-id");
    this.todoIndex = store.state.notes[this.noteId].todoes.findIndex(
      (i) => i.id === this.todoId
    );
  }

  todoChangeHandler(e) {
    this.WrapperList = e.target.parentNode.parentNode;
    const Wrapper = e.target.parentNode.parentNode.parentNode;
    if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
      store.state.notes[this.noteId].todoes[this.todoIndex].data.forEach(
        (k, index) => {
          if (k.id === +e.target.parentNode.dataset.id) {
            store.dispatch("todoChanger", {
              noteId: this.noteId,
              todoId: this.todoId,
              dataId: index,
              key: "checked",
              data: e.target.checked,
            });
          }
        }
      );
    }
    if (e.target.tagName === "SPAN" && e.target.dataset.value === "true") {
      if (e.target.innerHTML.length === 0 && e.keyCode === 8) {
        e.preventDefault();
        if (this.WrapperList.children.length === 1) {
          store.dispatch("removeTodo", {
            noteId: this.noteId,
            todoId: this.todoId,
          });
          return Wrapper.remove();
        }

        if (e.target.parentNode.previousElementSibling) {
          placeCaretAtEnd(
            e.target.parentNode.previousElementSibling.children[1]
          );
        } else if (e.target.parentNode.nextElementSibling)
          placeCaretAtEnd(e.target.parentNode.nextElementSibling.children[1]);

        store.dispatch("removeTodoItem", {
          noteId: this.noteId,
          todoId: this.todoId,
          todoItemId: +e.target.parentNode.dataset.id,
        });

        return e.target.parentNode.remove();
      }

      if (e.keyCode === 13) {
        e.preventDefault();
        const maxId = Math.max(
          ...store.state.notes[this.noteId].todoes[this.todoIndex].data.map(
            (i) => i.id
          )
        );

        const insertAfter = (newNode, referenceNode) => {
          referenceNode.parentNode.insertBefore(
            newNode,
            referenceNode.nextSibling
          );
        };
        store.dispatch("addTodoItemToNote", {
          index: this.noteId,
          todoId: this.todoId,
          todoItemId: +e.target.parentNode.dataset.id,
        });

        const li = document.createElement("li");

        li.setAttribute("data-id", maxId + 1);
        li.innerHTML = `
                            <input class='Note_Additional_Todo_WrapperList_Checkbox' type='checkbox' />
                            <span data-placeholder='To do' 
                                spellcheck="false" 
                                contentEditable="true" 
                                data-value='true' 
                                class='Note_Additional_Todo_WrapperList_Value Note_Additional_Todo_WrapperList_Value${
                                  this.todoIndex
                                }-${maxId + 1}'></span>
                            ${
                              isMobile()
                                ? `<div class='Note_Additional_Todo_Wrapper_Actions_Remove'>
                                    <div class='Note_Additional_Todo_Wrapper_Actions_Remove_Icon'></div>
                                </div>`
                                : ""
                            }`;

        li.className = "Note_Additional_Todo_WrapperList_Item";
        li.addEventListener("paste", onPaste);
        insertAfter(li, e.target.parentNode);
        placeCaretAtEnd(
          document.querySelector(
            `.Note_Additional_Todo_WrapperList_Value${this.todoIndex}-${
              maxId + 1
            }`
          )
        );
      }
      const todoIndex = store.state.notes[this.noteId].todoes.findIndex(
        (i) => +i.id === +this.todoId
      );
      store.state.notes[this.noteId].todoes[todoIndex].data.forEach(
        (i, index) => {
          if (i.id === +e.target.parentNode.dataset.id) {
            store.dispatch("todoChanger", {
              noteId: this.noteId,
              todoId: this.todoId,
              dataId: index,
              key: "title",
              data: e.target.innerHTML,
            });
          }
          return i;
        }
      );
    }
    return undefined;
  }

  events() {
    this.addEventListener("click", (e) => {
      if (
        e.target.classList.value ===
        "Note_Additional_Todo_Wrapper_Actions_Remove_Icon"
      ) {
        e.preventDefault();
        e.stopPropagation();
        if (!store.state.notes[this.noteId].todoes[this.todoIndex]) {
          return false;
        }
        if (
          store.state.notes[this.noteId].todoes[this.todoIndex].data.length -
            1 ===
          0
        ) {
          store.dispatch("removeTodo", {
            noteId: this.noteId,
            todoId: this.todoId,
          });
          return store.events.publish("removeTodo");
        }
        store.dispatch("removeTodoItem", {
          noteId: this.noteId,
          todoId: this.todoId,
          todoItemId: +e.target.parentNode.parentNode.dataset.id,
        });
        this.render();
        return undefined;
      }
      return undefined;
    });

    document
      .querySelectorAll(".Note_Additional_Todo_WrapperList_Value")
      .forEach((i) => i.addEventListener("paste", onPaste));

    this.addEventListener("keydown", (e) =>
      this.todoChangeHandler(e, this.noteId)
    );
    this.addEventListener("input", (e) =>
      this.todoChangeHandler(e, this.noteId)
    );
  }

  render() {
    const todoIndex = store.state.notes[this.noteId].todoes.findIndex(
      (i) => +i.id === +this.todoId
    );
    const template = store.state.notes[this.noteId].todoes[todoIndex]
      ? store.state.notes[this.noteId].todoes[todoIndex].data
          .map(
            (k) =>
              `<li data-id=${
                k.id
              } class='Note_Additional_Todo_WrapperList_Item'>
                                  <input ${
                                    k.checked ? "checked" : ""
                                  } class='Note_Additional_Todo_WrapperList_Checkbox' type='checkbox' />
                                  <span data-placeholder='To do' spellcheck="false" contentEditable="true" data-value='true' class='Note_Additional_Todo_WrapperList_Value'>${
                                    k.title
                                  }</span>
                                  ${
                                    isMobile()
                                      ? `<div class='Note_Additional_Todo_Wrapper_Actions_Remove'>
                                      <div class='Note_Additional_Todo_Wrapper_Actions_Remove_Icon'></div>
                                  </div>`
                                      : ""
                                  }
                          </li>`
          )
          .join("")
      : "";

    this.innerHTML = template;
  }

  connectedCallback() {
    this.render();
    this.events(this.todoId);
  }

  disconnectedCallback() {}
}

window.customElements.define("todo-items", TodoItem);
