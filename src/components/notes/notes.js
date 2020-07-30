import store from "../../store";
import "./notes.css";
import isMobile from "../../lib/isMobile";

class Notes extends HTMLElement {
  constructor() {
    super();
    this.classList.add("Notes_List_Wrap");
    this.classList.add("Hidden");
    this.noteId =
      this.getAttribute("app-id") || window.location.hash.split("/")[1];

    store.events.subscribe("stateChange", () => this.connectedCallback());

    store.events.subscribe("hashChange", (noteId) => {
      this.noteId = noteId;
      document
        .querySelectorAll(".Notes_List_Item")
        .forEach((node) => node.classList.remove("Notes_List_Item-Active"));
      document
        .querySelector(`.Notes_List_Item[data-id="${noteId}"]`)
        .classList.add("Notes_List_Item-Active");
    });
  }

  toggleStatusHandler() {
    this.addEventListener("mouseover", (e) => {
      if (isMobile()) return e.preventDefault();
      this.classList.remove("Hidden");
      return this.addEventListener("mouseleave", () => {
        this.classList.add("Hidden");
      });
    });

    this.swipeHandler();
  }

  swipeHandler() {
    let startX;
    let endX;
    const treshold = 100;

    const handleTouch = () => {
      if (endX - startX + treshold < 0) {
        this.classList.add("Hidden");
      } else if (endX - startX > 0 + treshold) {
        this.classList.remove("Hidden");
      }
    };

    window.onload = function () {
      window.addEventListener("touchstart", function (event) {
        startX = event.touches[0].clientX;
      });

      window.addEventListener("touchend", function (event) {
        endX = event.changedTouches[0].clientX;
        handleTouch();
      });
    };
  }

  scrollPositionHandler() {
    const scrollpos = sessionStorage.getItem("scrollpos");
    if (scrollpos) {
      document.querySelector(".Notes_List").scrollTo(0, +scrollpos);
    }

    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem(
        "scrollpos",
        document.querySelector(".Notes_List").scrollTop
      );
    });
  }

  events() {
    document.querySelectorAll(".Notes_List_Item_Delete").forEach((i) => {
      i.addEventListener("click", (e) => {
        e.preventDefault();
        store.dispatch("removeNote", {
          noteId: +e.currentTarget.parentNode.dataset.id,
        });

        if (+e.currentTarget.parentNode.dataset.id === +this.noteId) {
          if (e.currentTarget.parentNode.previousElementSibling) {
            window.history.pushState(
              null,
              null,
              e.currentTarget.parentNode.previousElementSibling.children[0].hash
            );
          } else if (e.currentTarget.parentNode.nextElementSibling) {
            window.history.pushState(
              null,
              null,
              e.currentTarget.parentNode.nextElementSibling.children[0].hash
            );
          }
        }
      });
    });

    document.querySelector(".Notes_Toggler").addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        this.classList.toggle("Hidden");
      },
      false
    );

    document.querySelectorAll(".Notes_List_Item_Link").forEach((i) => {
      i.addEventListener("click", () => {
        this.classList.add("Hidden");
      });
    });

    document
      .querySelector(".Notes_Create_Link")
      .addEventListener("click", () => {
        sessionStorage.setItem(
          "scrollpos",
          document.querySelector(".Notes_List").scrollHeight
        );
      });
    this.scrollPositionHandler();
    this.toggleStatusHandler();
    this.swipeHandler();
  }

  render() {
    const lastNote = store.state.notes[store.state.notes.length - 1];
    const notes = `
                <div class='Notes_Toggler'>
                    <span class='Notes_Toggler-decoration'></span>
                    <span class='Notes_Toggler-decoration'></span>
                    <span class='Notes_Toggler-decoration'></span>
                </div>
                <ul class='Notes_List'>
                    ${store.state.notes
                      .map((i) => {
                        let title;

                        if (i.title && i.title.length > 16) {
                          title = `${i.title.slice(0, 16)}...`;
                        } else {
                          title = i.title || "Untitled";
                        }
                        if (i.title.includes("<br>")) {
                          title = `${i.title.split("<br>")[0].slice(0, 16)}...`;
                        }
                        return `<li data-id=${i.id} class='Notes_List_Item ${
                          +this.noteId === +i.id ? "Notes_List_Item-Active" : ""
                        }'>
                        <a href="#note/${i.id}" class='Notes_List_Item_Link'>
                            <span class='Notes_List_Item_IMG'>${i.emoji}</span>
                            <h2 class='Notes_List_Item_Title'>${title}</h2>
                        </a>
                        ${
                          store.state.notes.length === 1
                            ? ""
                            : `<div class='Notes_List_Item_Delete'><span class='Notes_List_Item_IMG_Delete'><span class="Notes_List_Item_IMG_Delete_Icon"></span></span></div>`
                        } 
                        </li>`;
                      })
                      .join("")}  
                </ul>            
                <div class='Notes_Create'>
                    <a class='Notes_Create_Link' href="#note/${
                      lastNote ? lastNote.id + 1 : 1
                    }" >
                        <span class='Notes_Create_Link_Icon'>+</span>
                        <h2 class='Notes_Create_Link_Title'>Add New</h2>
                    </a>
                </div>
            `;
    this.innerHTML = notes;
  }

  connectedCallback() {
    this.render();
    this.events();
  }
}

window.customElements.define("notes-element", Notes);
