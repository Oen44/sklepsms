#pragma semicolon 1

#define DEBUG

#define PLUGIN_AUTHOR "oeN."
#define PLUGIN_VERSION "1.0.0"

#include <sourcemod>
#include <sdktools>
#include <cstrike>
#include <socket>
#include <adt_array>
//#include <sdkhooks>

#pragma newdecls required

EngineVersion g_Game;

public Plugin myinfo = 
{
	name = "SklepSMS",
	author = PLUGIN_AUTHOR,
	description = "Automatyczny SklepSMS",
	version = PLUGIN_VERSION,
	url = "https://sklepsms.pl"
};

#define SITE "/sockets/sm.php"
#define HOST "sklepsms.pl"

#define MAX_PLAYERS			32

#define MAX_SERVICE_ID		15
#define MAX_SERVICE_TITLE	63
#define MAX_SERVICE_DESC	63
#define MAX_SERVICE_SUFFIX	63
#define MAX_SERVICE_FLAGS	25
#define MAX_SERVICE_KEY		63

#define MAX_PRICE_NAME		63

#define MAX_API				5
#define MAX_API_PRICE		5
#define MAX_API_INCOME		5
#define MAX_API_MSG			31

#define API_SETTI			1
#define API_ZABIJAKA		2
#define API_1SHOT1KILL		3
#define API_HOSTPLAY		4
#define API_PUKAWKA			5

#define SERVICE_TYPE_FLAGS	0
#define SERVICE_TYPE_CUSTOM	1
#define SERVICE_TYPE_SKINS	2

#define MAX_LINE			511
#define MAX_LINE_VARIABLE	511
#define MAX_LINE_VALUE		1027
#define SIZE				2047

#define MAX_ARRAY_PRICES	511

#define TYPE_NICK	1<<0
#define TYPE_IP		1<<1
#define TYPE_SID	1<<2

#define MAX_ACCESS_FLAGS	32
#define MAX_ACCESS_PASS		33

enum (+=768) {
	TASK_SMS_CODE = 768
}

methodmap ServiceData {

	property int SERVICE_PLUGIN {
		public native get();
		public native set(int value);
	}
	public char SERVICE_ID[MAX_SERVICE_ID + 1];
	public bool SERVICE_ACTIVE;
	public char SERVICE_TITLE[MAX_SERVICE_TITLE + 1];
	public char SERVICE_DESC[MAX_SERVICE_DESC + 1];
	public char SERVICE_SUFFIX[MAX_SERVICE_SUFFIX + 1];
	public int SERVICE_TYPE;
	public Handle SERVICE_PRICES;
	public char SERVICE_FLAGS[MAX_SERVICE_FLAGS + 1];
	public int SERVICE_WEAPONID;
	public int SERVICE_API;
	public char SERVICE_KEY[MAX_SERVICE_KEY + 1];
}
ArrayList g_ServicesArray;

public void OnPluginStart()
{
	g_Game = GetEngineVersion();
	if(g_Game != Engine_CSGO && g_Game != Engine_CSS)
	{
		SetFailState("Plugin dla gier CSGO/CSS.");	
	}
	
	g_ServicesArray = new ArrayList();
	ServiceData service;
	service.SERVICE_PLUGIN = 1;
	g_ServicesArray.Push(service);
	
	Handle socket = SocketCreate(SOCKET_TCP, OnSocketError);

	SocketConnect(socket, OnSocketConnected, OnSocketReceive, OnSocketDisconnected, "www.sourcemod.net", 80);
}

public void OnSocketConnected(Handle socket, any arg) {
	// socket is connected, send the http request

	char requestStr[100];
	Format(requestStr, sizeof(requestStr), "GET /%s HTTP/1.0\r\nHost: %s\r\nConnection: close\r\n\r\n", "index.php", "www.sourcemod.net");
	SocketSend(socket, requestStr);
}

public void OnSocketReceive(Handle socket, char[] receiveData, const int dataSize, any hFile) {
	// receive another chunk and write it to <modfolder>/dl.htm
	// we could strip the http response header here, but for example's sake we'll leave it in

	WriteFileString(hFile, receiveData, false);
}

public void OnSocketDisconnected(Handle socket, any hFile) {
	// Connection: close advises the webserver to close the connection when the transfer is finished
	// we're done here

	CloseHandle(hFile);
	CloseHandle(socket);
}

public void OnSocketError(Handle socket, const int errorType, const int errorNum, any hFile) {
	// a socket error occured

	LogError("socket error %d (errno %d)", errorType, errorNum);
	CloseHandle(hFile);
	CloseHandle(socket);
}