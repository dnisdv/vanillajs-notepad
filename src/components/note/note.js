import store from "../../store";
import onPaste from "../../lib/pasteHandler";
import trashIcon from "../../assets/img/trash.svg";
import "./note.css";

export default class Note extends HTMLElement {
  constructor() {
    super();
    this.noteId = this.getAttribute("note-id");
    this.noteIndex = store.state.notes.findIndex((i) => +i.id === +this.noteId);
    this.note = store.state.notes[this.noteIndex];
  }

  events() {
    const nodes = [
      document.querySelector(".Note_Main_Title"),
      document.querySelector(".Note_Main_Moto"),
      document.querySelector(".Note_Additional_Description"),
      document.querySelector(".Note_Additional_Other"),
    ];

    const changeHandler = (e) => {
      store.dispatch("updateNote", {
        noteId: this.noteId,
        data: {
          edited: new Date(),
          [e.target.getAttribute("key")]: e.target.innerHTML,
        },
      });
      if (e.key === "Enter") {
        e.preventDefault();
        document.execCommand("insertLineBreak");
      }
      if (e.target.innerHTML === "<br>") {
        e.target.innerHTML = "";
      }
      if (e.target.className === "Note_Main_Title") {
        store.events.publish("updateNote");
      }
    };

    nodes.forEach((node) => {
      node.addEventListener("paste", (e) => onPaste(e));
      node.addEventListener("keydown", (e) => changeHandler(e));
      node.addEventListener("input", (e) => changeHandler(e));
    });

    nodes.forEach((node) => {
      node.innerHTML =
        store.state.notes[this.noteIndex][node.getAttribute("key")] || "";
    });
    if (document.querySelector(".Note_Remove_Icon")) {
      document
        .querySelector(".Note_Remove_Icon")
        .addEventListener("click", (e) => {
          e.preventDefault();
          if (store.state.notes.length !== 1) {
            const NOTEINDEX = store.state.notes.findIndex(
              (i) => +i.id === +this.noteId
            );

            store.dispatch("removeNote", { noteId: +this.noteId });
            if (store.state.notes[NOTEINDEX - 1]) {
              return window.history.pushState(
                null,
                null,
                `#note/${store.state.notes[NOTEINDEX - 1].id}`
              );
            }
            if (store.state.notes[NOTEINDEX + 1]) {
              return window.history.pushState(
                null,
                null,
                `#note/${store.state.notes[NOTEINDEX].id}`
              );
            }
            if (store.state.notes[NOTEINDEX]) {
              return window.history.pushState(
                null,
                null,
                `#note/${store.state.notes[NOTEINDEX].id}`
              );
            }
          }
          return undefined;
        });
    }
  }

  returnDateWithZeroes(date) {
    const MyDate = new Date(date);
    const result = MyDate.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return result;
  }

  render() {
    this.innerHTML = `
            ${
              store.state.notes.length - 1 > 0
                ? `<div class="Note_Remove"><img class='Note_Remove_Icon' src='${trashIcon}' alt='remove note' /></div>`
                : ""
            }
            <div class="Note">
              <div class="Note_Main">
                  <emoji-picker note-id=${this.noteId}></emoji-picker>

                  <h1 key='title' contenteditable spellcheck="false" data-placeholder="Untitled" class="Note_Main_Title"></h1>
                  <div key='moto' contenteditable spellcheck="false" data-placeholder='“Your Motto”' class="Note_Main_Moto"></div>
              </div>

              <div class="Note_Additional">
                  <ul  class="Note_Additional_Date">
                      <li class="Note_Additional_Date_Item">
                          <span class="Note_Additional_Date_Title">Date</span>    
                          <span class="Note_Additional_Date_Value Note_Additional_Date_Value_CREATED">00.00.0000</span>
                      </li>
                      <li class="Note_Additional_Date_Item">
                          <span class="Note_Additional_Date_Title">Edited</span>
                          <span class="Note_Additional_Date_Value Note_Additional_Date_Value_EDITED">00.00.0000</span>
                      </li>                   
                  </ul>

                  <div key='additional_information' spellcheck="false" contenteditable data-placeholder="Additional Information" data-placeholder="Write Information" class="Note_Additional_Description"></div>
                  <note-todo note-id=${
                    this.noteId
                  } class='Note_Additional_Todo'></note-todo>
                  
                  <div key='additional_other_information' spellcheck="false" contenteditable data-placeholder="Other Information" class='Note_Additional_Other'></div>
              </div>
          </div>
        `;
  }

  connectedCallback() {
    this.render();
    document.querySelector(
      ".Note_Additional_Date_Value_CREATED"
    ).innerHTML = this.note
      ? this.returnDateWithZeroes(this.note.created_date)
      : "";
    document.querySelector(
      ".Note_Additional_Date_Value_EDITED"
    ).innerHTML = this.note ? this.returnDateWithZeroes(this.note.edited) : "";

    this.events();
  }

  disconnectedCallback() {}
}

window.customElements.define("note-pad", Note);
