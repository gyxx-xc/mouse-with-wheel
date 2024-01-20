#include <hidboot.h>
#include <usbhub.h>

// Satisfy the IDE, which needs to see the include statment in the ino too.
#ifdef dobogusinclude
#include <spi4teensy3.h>
#endif
#include <SPI.h>
#define MAXPOS 1000
#define BARRIERPOS 800
#define CORRECTAREA 50

int pos = 0;
int offset = 0;

class MouseRptParser : public MouseReportParser
{
protected:
  void OnMouseMove  (MOUSEINFO *mi);
  void OnLeftButtonUp (MOUSEINFO *mi);
  void OnLeftButtonDown (MOUSEINFO *mi);
  void OnRightButtonUp  (MOUSEINFO *mi);
  void OnRightButtonDown  (MOUSEINFO *mi);
  void OnMiddleButtonUp (MOUSEINFO *mi);
  void OnMiddleButtonDown (MOUSEINFO *mi);
};

char *buffer = (char *) malloc(5);

void MouseRptParser::OnMouseMove(MOUSEINFO *mi)
{
    char *message = buffer;
    memset(message, 0, sizeof(char)*5);
    *message = pos;
    Serial.println(message);
    pos += mi->dY;
    offset += mi->dX;
    if (pos > MAXPOS) {
      analogWrite(11, 255);
      analogWrite(6, 255);
      digitalWrite(13, LOW);
      digitalWrite(5, LOW);
    } else if (pos < 0) {
      analogWrite(13, 255);
      analogWrite(5, 255);
      digitalWrite(11, LOW);
      digitalWrite(6, LOW);
    } else if (BARRIERPOS - CORRECTAREA < pos && pos < BARRIERPOS) {
      analogWrite(13, 128);
      analogWrite(5, 128);
      digitalWrite(11, LOW);
      digitalWrite(6, LOW);
    } else if (BARRIERPOS < pos && pos < BARRIERPOS + CORRECTAREA) {
      analogWrite(13, 128);
      analogWrite(5, 128);
      digitalWrite(11, LOW);
      digitalWrite(6, LOW);
    } else {
      digitalWrite(13, LOW);
      digitalWrite(5, LOW);
      digitalWrite(13, LOW);
      digitalWrite(6, LOW);
    }
};

void MouseRptParser::OnLeftButtonUp (MOUSEINFO *mi){};
void MouseRptParser::OnLeftButtonDown (MOUSEINFO *mi){};
void MouseRptParser::OnRightButtonUp  (MOUSEINFO *mi){};
void MouseRptParser::OnRightButtonDown  (MOUSEINFO *mi){};
void MouseRptParser::OnMiddleButtonUp (MOUSEINFO *mi){};
void MouseRptParser::OnMiddleButtonDown (MOUSEINFO *mi){};

USB Usb;
USBHub Hub(&Usb);
HIDBoot<USB_HID_PROTOCOL_MOUSE> HidMouse(&Usb);

MouseRptParser Prs;

void setup() {
    Serial.begin( 115200 );
    while (!Serial); // Wait for serial port to connect - used on Leonardo, Teensy and other boards with built-in USB CDC serial connection
  Serial.println();
    if (Usb.Init() == -1)
        Serial.println("OSC did not start.");

    delay( 200 );

    HidMouse.SetReportParser(0, &Prs);

    pinMode(11, OUTPUT);
    pinMode(13, OUTPUT);
    pinMode(5, OUTPUT);
    pinMode(6, OUTPUT);
}

void loop() {
  Usb.Task();
}
