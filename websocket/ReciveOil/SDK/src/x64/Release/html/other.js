html = document.querySelector('html');

if ("ontouchstart" in window) {
  document.addEventListener("touchstart", touchStart);
  document.addEventListener("touchmove", touchMove);
  document.addEventListener("touchend", touchEnd);
} else {
  alert("a touch screen is required");
}

var isFullScreen = false;
function touchStart(event) {
  if (!isFullScreen) {
    html.requestFullscreen();
    isFullScreen = true;
  }
  for (var i = 0; i < event.touches.length; i ++){
    ComponentUtil.getComponent(event.touches[i].target).touchStart(event.touches[i]);
  }
}

function touchMove(event) {
  for (var i = 0; i < event.touches.length; i ++){
    ComponentUtil.getComponent(event.touches[i].target).touchMove(event.touches[i]);
  }
}

function touchEnd(event) {
  for (var i = 0; i < event.touches.length; i ++){
    ComponentUtil.getComponent(event.touches[i].target).touchEnd(event.touches[i]);
  }
}
