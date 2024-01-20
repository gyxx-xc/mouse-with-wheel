html = document.querySelector("html");

var touches = false;
if ("ontouchstart" in window) {
  touches = true;
  document.addEventListener("touchstart", getTouchPos);
  document.addEventListener("touchmove", getTouchPos);
} else {
  document.addEventListener("mousedown", function (e) {
    touches = true;
    getMousePos(e);
  });
  document.addEventListener("mousemove", getMousePos);
  document.addEventListener("mouseup", function () {
    touches = false;
  });
}

var a = false;
function getTouchPos(event) {
  if (!a) {
    html.requestFullscreen();
    a = true;
  }
  var e = event || window.event;
  for (var i = 0; i < e.touches.length; i++) {
    transfer(e.touches[i]);
  }
}
function getMousePos(event) {
  var e = event || window.event;
  transfer(e);
}

function transfer(p) {
  if (!touches) return;
  height = document.documentElement.scrollHeight;
  var controlValue;
  var isButtom;
  if (p.target.className != "detect") return;
  var controlTarget = p.target.parentElement;
  if (controlTarget.className == "bar") {
    isButtom = false;
    if (controlTarget.id == "throttle") {
      controlValue = 4;
    }
    if (controlTarget.id == "zoom") {
      controlValue = 5;
    }
  } else if (controlTarget.className == "buttom") {
  }

  var transferValue;
  if (!isButtom) {
    per = (p.pageY - controlTarget.offsetTop) / controlTarget.offsetHeight;
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

    per = (per * (1 << 15)) | 0;
    transferValue = per;
  }
}
