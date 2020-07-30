import store from "../store/index";

export default class EmojiPicker extends HTMLElement {
  emojis = [
    "\ud83d\ude00",
    "\ud83d\ude03",
    "\ud83d\ude04",
    "\ud83d\ude01",
    "\ud83d\ude06",
    "\ud83d\ude05",
    "\ud83e\udd23",
    "\ud83d\ude02",
    "\ud83d\ude42",
    "\ud83d\ude43",
    "\ud83d\ude09",
    "\ud83d\ude0a",
    "\ud83d\ude07",
    "\ud83e\udd70",
    "\ud83d\ude0d",
    "\ud83e\udd29",
    "\ud83d\ude18",
    "\ud83d\ude17",
    "\ud83d\ude1a",
    "\ud83d\ude19",
  ];

  events(noteIndex) {
    document
      .querySelector(".Note_Main_Smile_emoji")
      .addEventListener("click", () =>
        document.querySelector(".Note_Main_Smile").classList.toggle("Hidden")
      );
    document
      .querySelectorAll(".Note_Main_Smile_EmojiPicker_Item")
      .forEach((i) =>
        i.addEventListener("click", (e) => {
          document.querySelector(".Note_Main_Smile_emoji").innerHTML =
            e.target.innerHTML;
          document.querySelector(".Note_Main_Smile").classList.add("Hidden");
          store.dispatch("updateNote", {
            index: noteIndex,
            data: { edited: new Date(), emoji: e.target.innerHTML },
          });
        })
      );
  }

  connectedCallback() {
    const noteIndex = this.getAttribute("note-id");
    this.innerHTML = `
      <div class='Note_Main_Smile Hidden'><span class='Note_Main_Smile_emoji'>😀</span>
          <div class="Note_Main_Smile_EmojiPicker"></div>
      </div>`;

    document.querySelector(
      ".Note_Main_Smile_EmojiPicker"
    ).innerHTML = this.emojis
      .map((i) => `<span class='Note_Main_Smile_EmojiPicker_Item'>${i}</span>`)
      .join("");

    document.querySelector(".Note_Main_Smile_emoji").innerHTML =
      store.state.notes[noteIndex].emoji;

    this.events(noteIndex);
  }
}

window.customElements.define("emoji-picker", EmojiPicker);
