#include <WinSock2.h>
#include <WS2tcpip.h>
#include <malloc.h>
#include <string.h>
#include <stdlib.h>
#include <cstdio>
#include <string>
#include <iostream>
#include <thread>
#include "Math.h"
#pragma comment(lib, "ws2_32.lib")

HANDLE hSerial;
char buffer[100] = { 0 };


#define DEV_ID 1
#define INNER_PORT "27017" // just a magic number in 27015-27030
#define DEFAULT_BUFLEN 512

int connect(char* port, int bdRate) {
    hSerial = CreateFile(
        port,
        GENERIC_READ | GENERIC_WRITE,
        0,
        0,
        OPEN_EXISTING,
        FILE_ATTRIBUTE_NORMAL,
        0);
    if (hSerial == INVALID_HANDLE_VALUE) {
        if (GetLastError() == ERROR_FILE_NOT_FOUND) {
            //serial port does not exist. Inform user.
            return 1;
        }
        //some other error occurred. Inform user.
        return 2;
    }

    DCB dcbSerialParams = { 0 };
    dcbSerialParams.DCBlength = sizeof(dcbSerialParams);
    if (!GetCommState(hSerial, &dcbSerialParams)) {
        //error getting state
        return 3;
    }
    dcbSerialParams.BaudRate = bdRate;
    dcbSerialParams.ByteSize = 8;
    dcbSerialParams.StopBits = ONESTOPBIT;
    dcbSerialParams.Parity = NOPARITY;
    if (!SetCommState(hSerial, &dcbSerialParams)) {
        //error setting serial port state
        return 4;
    }
    return 0;
}

int start;
float value[20];
void get() {
    ReadFile(hSerial, buffer, 32, 0, 0);
    for (int i = 0; i < 40; i++) if (buffer[i] == '\n') {
        sscanf(buffer + i + 1, "%f%f%f", &value[0], &value[1], &value[2]);
        break;
    }
}

int read(int chel) {
    return buffer[start + chel];
}

int main()
{
  struct addrinfo *result = NULL, *ptr = NULL, hints;
  int iResult;
  // copy from
  // https://learn.microsoft.com/en-us/windows/win32/api/winsock/nf-winsock-wsastartup
  WORD wVersionRequested;
  WSADATA wsaData;
  /* Use the MAKEWORD(lowbyte, highbyte) macro declared in Windef.h */
  wVersionRequested = MAKEWORD(2, 2);

  iResult = WSAStartup(wVersionRequested, &wsaData);
  if (iResult != 0)
    {
      /* Tell the user that we could not find a usable */
      /* Winsock DLL.                                  */
      printf("WSAStartup failed with error: %d\n", iResult);
      return 1;
    }
  // socket part copied from
  // https://learn.microsoft.com/en-us/windows/win32/winsock/creating-a-socket-for-the-server

  memset(&hints, 0, sizeof(hints));
  hints.ai_family = AF_INET;
  hints.ai_socktype = SOCK_STREAM;
  hints.ai_protocol = IPPROTO_TCP;
  hints.ai_flags = AI_PASSIVE;

  // Resolve the local address and port to be used by the server
  iResult = getaddrinfo(NULL, INNER_PORT, &hints, &result);
  if (iResult != 0)
    {
      printf("getaddrinfo failed: %d\n", iResult);
      WSACleanup();
      return 1;
    }

  SOCKET ListenSocket = INVALID_SOCKET;
  ListenSocket = socket(result->ai_family, result->ai_socktype, result->ai_protocol);
  if (ListenSocket == INVALID_SOCKET)
    {
      printf("Error at socket(): %ld\n", WSAGetLastError());
      freeaddrinfo(result);
      WSACleanup();
      return 1;
    }

  // Setup the TCP listening socket
  iResult = bind(ListenSocket, result->ai_addr, (int)result->ai_addrlen);
  if (iResult == SOCKET_ERROR)
    {
      printf("bind failed with error: %d\n", WSAGetLastError());
      freeaddrinfo(result);
      closesocket(ListenSocket);
      WSACleanup();
      return 1;
    }
  freeaddrinfo(result);

  // start server socket
  if (listen(ListenSocket, SOMAXCONN) == SOCKET_ERROR)
    {
      printf("Listen failed with error: %ld\n", WSAGetLastError());
      closesocket(ListenSocket);
      WSACleanup();
      return 1;
    }

  // Accept a client socket
  SOCKET ClientSocket = INVALID_SOCKET;
  ClientSocket = accept(ListenSocket, NULL, NULL);
  if (ClientSocket == INVALID_SOCKET)
    {
      printf("accept failed: %d\n", WSAGetLastError());
      closesocket(ListenSocket);
      WSACleanup();
      return 1;
    }
	printf("ok\n");

  char recvbuf[DEFAULT_BUFLEN];
  int iSendResult;
  int recvbuflen = DEFAULT_BUFLEN;

  int iMessage;

  connect("com10", 115200);
  char buffer[8];
  int data;
  DWORD bytesRead;
  for (;;) {
      if (ReadFile(hSerial, buffer, sizeof(buffer), &bytesRead, NULL)) {
          for (int i = 0; i < 8; i++) if (buffer[i] == '\n')
              data = *((int*)(buffer + i + 1));
		  const char m[2] = {0x82, 0x4};
          iResult = send(ClientSocket, m, 2, 0);
          if (iResult <= 0) return 0;
          iResult = send(ClientSocket, (char *)&data, 2, 0);
          if (iResult <= 0) return 0;
      }
  }
}
