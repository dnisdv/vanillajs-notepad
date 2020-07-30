export default function (e) {
  e.preventDefault();
  const value = e.clipboardData.getData("text/plain");
  document.execCommand("insertHTML", false, value);
}
