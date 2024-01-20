var ws;
if ("WebSocket" in window) {
  ws = new WebSocket("ws://localhost:27017"); // use ###HOST### as this computer
} else {
  alert("WebSocket is not support!");
}

ws.onmessage = function(event) {
  console.log(event.data.toString());
  per = event.data/1000;
  if (per < 0) per = 0;
  if (per > 1) per = 1;

  controlTarget.querySelector(".pos").style.height = per * 100 + "%";
  html.getElementsByClassName("bar")[0].style.background =
    "hsl(" +
    Number(
      html
        .getElementsByClassName("bar")[0]
        .querySelector(".pos")
        .style.height.slice(0, -1)
    ) *
      1.2 +
    ",60%" +
    ",30%" +
    ")";
  html.getElementsByClassName("bar")[1].style.background =
    "hsl(" +
    Number(
      html
        .getElementsByClassName("bar")[1]
        .querySelector(".pos")
        .style.height.slice(0, -1)
    ) *
      1.2 +
    ",60%" +
    ",30%" +
    ")";
  controlTarget.style.background = "hsl(" + per * 120 + ",70%" + ",60%" + ")";

}
