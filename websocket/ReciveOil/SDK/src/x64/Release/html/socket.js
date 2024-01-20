var ws;
if ("WebSocket" in window) {
  ws = new WebSocket("ws://###HOST###/in"); // use ###HOST### as this computer
} else {
  alert("WebSocket is not support!");
}

function send(a) {
  ws.send(a);
}

/* send the value to vJoy
 *
 * if isButtom
 *   control value -> buttom number (start from 0)
 *   transfer value -> 0/1
 * else
 *   control value -> axis number (referance to vJoy's axis)
 *   transfer value -> the axis value
 * @param {int} controlValue controlValue
 * @param {int} transferValue transferValue
 * @param {boolean} isButtom isButtom
 */
var buttomStage = 0;
function control(controlValue, transferValue, isButtom) {
  if (isButtom){
    if (transferValue != 0 && transferValue != 1) {
      console.log("transferValue Error");
      return;
    }
    // b & 0 | a = a
    buttomStage = buttomStage & ~(1 << controlValue) | (transferValue << controlValue);
    var m = String.fromCharCode(19)
      + String.fromCharCode((buttomStage >> 8) & 255) + String.fromCharCode(buttomStage & 255);
  } else {
    if (transferValue < 0 && transferValue > 0x8000) {
      console.log("transferValue Error");
      return;
    }
    var m = String.fromCharCode(controlValue)
      + String.fromCharCode((transferValue >> 8) & 255) + String.fromCharCode(transferValue & 255);
  }
  m = btoa(m);
  document.querySelector(".debug").textContent = m;
  send(m);
}