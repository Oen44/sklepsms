#include <amxmodx>
#include <amxmisc>
#include <sockets>
#include <sqlx>

#pragma compress 1
#pragma semicolon 1

#define PLUGIN "SklepSMS"
#define VERSION "1.1.0"
#define AUTHOR "oeN."

#define SITE "/sockets/amxx.php"
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

enum (+=768)
{
	EMPTY_ANSWER = 768,
	TASK_SMS_CODE,
	ADMIN_GEN_CODE,
	TASK_FREE_SERVICE
}

enum _:ServiceData {
	SERVICE_PlUGIN,
	SERVICE_ID[MAX_SERVICE_ID + 1],
	bool:SERVICE_ACTIVE,
	SERVICE_TITLE[MAX_SERVICE_TITLE + 1],
	SERVICE_DESC[MAX_SERVICE_DESC + 1],
	SERVICE_SUFFIX[MAX_SERVICE_SUFFIX + 1],
	SERVICE_TYPE,
	Array:SERVICE_PRICES,
	SERVICE_FLAGS[MAX_SERVICE_FLAGS + 1],
	SERVICE_WEAPONID,
	SERVICE_API,
	SERVICE_KEY[MAX_SERVICE_KEY + 1]
}
new Array:g_ServicesArray;

enum _:PricesData {
	PRICE_AMOUNT,
	PRICE_PRICE,
	PRICE_NAME[MAX_PRICE_NAME + 1]
}

enum _:ApiData {
	API_ID,
	API_VAT[MAX_API_PRICE + 1],
	API_PRICE[MAX_API_PRICE + 1],
	API_INCOME[MAX_API_INCOME + 1],
	API_MSG[MAX_API_MSG + 1],
	API_NUMBER
}
new Array:g_ApiArray[MAX_API + 1];

enum _:ServerData {
	NETWORK_ID,
	bool:LICENSE_STATUS,
	SERVER_ID
}
new serverData[ServerData];
new g_cNetworkID;

enum _:UserAccess {
	ACCESS_TYPE,
	ACCESS_PASS[MAX_ACCESS_PASS + 1],
	ACCESS_FLAGS[MAX_ACCESS_FLAGS + 1]
}
new Trie:g_accessTrie;
new Array:g_accessArray, g_iLastAccess;

new g_iService[MAX_PLAYERS + 1];
new g_iPrice[MAX_PLAYERS + 1];
new g_iAuthType[MAX_PLAYERS + 1];
new g_szPassword[MAX_PLAYERS + 1][MAX_ACCESS_PASS + 1];

new Handle:g_SqlConn, bool:gConnected;

new g_iSocket[MAX_PLAYERS + 1];
new lines[15][MAX_LINE + 1], line_variable[MAX_LINE_VARIABLE + 1], line_value[MAX_LINE_VALUE + 1];
new count, countPrices;
new arrayPrices[32][MAX_ARRAY_PRICES + 1], arrayPrice[5][64];

new g_fServiceBought, g_fServiceAddMenu, g_fServiceData;

new g_pAdminFlags, g_szAdminMenuFlags[32];

#include "api/setti.api"
#include "api/zabijaka.api"
#include "api/1shot1kill.api"
#include "api/hostplay.api"
#include "api/pukawka.api"

public plugin_init() {
	register_plugin(PLUGIN, VERSION, AUTHOR);
	register_cvar("shop_version", VERSION, FCVAR_SERVER | FCVAR_SPONLY);

	g_ServicesArray = ArrayCreate(ServiceData);
	g_accessArray = ArrayCreate(UserAccess);
	g_accessTrie = TrieCreate();

	for(new i = 1; i <= MAX_API; i++) {
		g_ApiArray[i] = ArrayCreate(ApiData);
	}

	g_cNetworkID = register_cvar("shop_netid", "1");
	g_pAdminFlags = register_cvar("shop_admin", "a");

	register_concmd("Sklep_Haslo", "cmd_Password");
	register_concmd("fSklep_Haslo", "cmd_FreePassword");
	register_concmd("Kod_SMS", "cmd_SmsCode");

	register_clcmd("say /sklepsms", "ShopMenu");
	register_clcmd("say_team /sklepsms", "ShopMenu");
}

public plugin_cfg() {
	new dir[64];
	get_configsdir(dir, 63);

	server_cmd("exec %s/sklepsms.cfg", dir);
	server_exec();

	get_pcvar_string(g_pAdminFlags, g_szAdminMenuFlags, 31);

	CreateAPI();
	set_task(1.0, "ConnectDB");
}

public ConnectDB() {
	g_SqlConn = SQL_MakeDbTuple("k1.unixstorm.org", "oen432_sklepsms", "NqVkG61r", "oen432_sklepsms");

	new error, szError[128];
	new Handle:qConn = SQL_Connect(g_SqlConn, error, szError, 127);
	if(error) {
		log_amx("Error: %s", szError);
		return;
	}
	else gConnected = true;

	SQL_FreeHandle(qConn);

	new iError, szSendBuffer[256];
	g_iSocket[0] = socket_open(HOST, 80, SOCKET_TCP, iError);
	new szIP[32];
	get_user_ip(0, szIP, charsmax(szIP));
	
	escape_string(VERSION, 5);
	escape_string(szIP, 31);

	formatex(szSendBuffer, charsmax(szSendBuffer), "GET %s?action=version&\
	         version=%s&\
	         ip=%s \
	         HTTP/1.1^r^n\
	         Host: %s^r^nConnection: Close^r^n^r^n", SITE,
	         VERSION,
	         szIP,
	         HOST);
	socket_send(g_iSocket[0], szSendBuffer, charsmax(szSendBuffer));
	set_task(0.5, "EmptyAnswer", EMPTY_ANSWER, .flags = "b");

	LoadAccess();
	CheckLicense();
}

public plugin_natives() {
	register_library("smsshop");
	register_native("shop_register_service", "RegisterService");
	register_native("shop_generate_code", "NativeGenerateCode");
}

public client_authorized(id) {
	return CheckAccess(id);
}

public client_disconnected(id) {
	if(task_exists(id))
		remove_task(id);
}

public ShopMenu(id) {
	new menu = menu_create("\rSklep SMS\d - wybierz usluge", "ShopMenuHandle");
	new callback = menu_makecallback("ShopMenuCallback");

	new service[ServiceData], szItem[MAX_SERVICE_TITLE + 1];
	new iSize = ArraySize(g_ServicesArray);

	for(new i = 0; i < iSize; i++) {
		ArrayGetArray(g_ServicesArray, i, service);
		if(service[SERVICE_ACTIVE]) {
			formatex(szItem, MAX_SERVICE_TITLE, "%s", service[SERVICE_TITLE]);
			menu_additem(menu, szItem, .callback=callback);
		}
		else {
			formatex(szItem, MAX_SERVICE_TITLE, "%s (nieaktywna)", service[SERVICE_ID]);
			menu_additem(menu, szItem, .callback=callback);
		}
	}
	if(is_user_vip(id, read_flags(g_szAdminMenuFlags)))
		menu_additem(menu, "Menu \yAdmina");
	menu_addblank2(menu);
	menu_addtext2(menu, "\dSklep by\y SklepSMS.pl");

	menu_setprop(menu, MPROP_EXITNAME, "Wyjdz");
	menu_display(id, menu);
}

public ShopMenuCallback(id, menu, item) {
	new ret = ITEM_ENABLED, service[ServiceData];
	ArrayGetArray(g_ServicesArray, item, service);
	if(!service[SERVICE_ACTIVE]) return ITEM_DISABLED;

	g_fServiceAddMenu = CreateOneForward(service[SERVICE_PlUGIN], "shop_service_addtomenu", FP_CELL);
	ExecuteForward(g_fServiceAddMenu, ret, id);
	DestroyForward(g_fServiceAddMenu);

	return ret;
}

public ShopMenuHandle(id, menu, item) {
	if( item == MENU_EXIT ) {
		g_szPassword[id] = "";
		g_iAuthType[id] = 0;
		g_iService[id] = 0;
		g_iPrice[id] = 0;
		menu_destroy(menu);
		return PLUGIN_HANDLED;
	}
	else if(item > ArraySize(g_ServicesArray) - 1)
	{
		AdminMenu(id);
		menu_destroy(menu);
		return PLUGIN_CONTINUE;
	}

	menu_destroy(menu);
	AmountMenu(id, item);
	return PLUGIN_CONTINUE;
}

public AdminMenu(id)
{
	new menu = menu_create("Menu Admina", "AdminMenuHandler");

	menu_additem(menu, "Dodaj usluge graczowi");
	menu_additem(menu, "Wygeneruj kod SMS");

	menu_setprop(menu, MPROP_EXITNAME, "Wyjdz");
	menu_display(id, menu);
}

public AdminMenuHandler(id, menu, item)
{
	if(item == MENU_EXIT)
	{
		menu_destroy(menu);
		return PLUGIN_HANDLED;
	}

	switch(item)
	{
		case 0:
		{
			AdminServiceMenu(id);
		}

		case 1:
		{
			AdminCodeMenu(id);
		}
	}

	menu_destroy(menu);
	return PLUGIN_CONTINUE;
}

public AdminServiceMenu(id)
{
	new menu = menu_create("Wybierz Usluge", "AdminServiceMenuHandler");
	new callback = menu_makecallback("AdminServiceMenuCallback");

	new service[ServiceData], szItem[MAX_SERVICE_TITLE + 1];
	new iSize = ArraySize(g_ServicesArray);

	for(new i = 0; i < iSize; i++)
	{
		ArrayGetArray(g_ServicesArray, i, service);
		if(service[SERVICE_ACTIVE])
		{
			formatex(szItem, MAX_SERVICE_TITLE, "%s", service[SERVICE_TITLE]);
			menu_additem(menu, szItem, .callback=callback);
		}
		else
		{
			formatex(szItem, MAX_SERVICE_TITLE, "%s (nieaktywna)", service[SERVICE_ID]);
			menu_additem(menu, szItem, .callback=callback);
		}
	}

	menu_setprop(menu, MPROP_EXITNAME, "Wyjdz");
	menu_display(id, menu);
}

public AdminServiceMenuCallback(id, menu, item)
{
	new service[ServiceData];
	ArrayGetArray(g_ServicesArray, item, service);
	if(!service[SERVICE_ACTIVE]) return ITEM_DISABLED;

	return ITEM_ENABLED;
}

new g_iAdminService[33];
new g_iAdminPrice[33];

public AdminServiceMenuHandler(id, menu, item)
{
	if(item == MENU_EXIT)
	{
		menu_destroy(menu);
		return PLUGIN_HANDLED;
	}

	AdminAmountMenu(id, item);

	menu_destroy(menu);
	return PLUGIN_CONTINUE;
}

public AdminAmountMenu(id, iIndex)
{
	new service[ServiceData];
	new price[PricesData];
	ArrayGetArray(g_ServicesArray, iIndex, service);

	new title[128];
	if(service[SERVICE_TYPE] == SERVICE_TYPE_SKINS)
	{
		formatex(title, charsmax(title), "\rSklep SMS\d - wybierz skin^n\y%s", service[SERVICE_DESC]);
	}
	else if(service[SERVICE_TYPE] == SERVICE_TYPE_CUSTOM)
	{
		formatex(title, charsmax(title), "\rSklep SMS\d - wybierz ilosc sztuk^n\y%s", service[SERVICE_DESC]);
	}
	else if(service[SERVICE_TYPE] == SERVICE_TYPE_FLAGS)
	{
		formatex(title, charsmax(title), "\rSklep SMS\d - wybierz ilosc dni^n\y%s", service[SERVICE_DESC]);
	}

	new menu = menu_create(title, "AdminAmountMenuHandle");

	new amount[64];
	new iPrices = ArraySize(service[SERVICE_PRICES]);
	new api[ApiData];
	for(new i = 0; i < iPrices; i++)
	{
		ArrayGetArray(service[SERVICE_PRICES], i, price);
		ArrayGetArray(g_ApiArray[service[SERVICE_API]], price[PRICE_PRICE], api);

		switch(service[SERVICE_TYPE])
		{
			case SERVICE_TYPE_SKINS:
			{
				formatex(amount, charsmax(amount), "\y%s\w - %szl + VAT\r (%szl)", price[PRICE_NAME], api[API_VAT], api[API_PRICE]);
			}
			case SERVICE_TYPE_CUSTOM:
			{
				formatex(amount, charsmax(amount), "\y%d %s\w - %szl + VAT\r (%szl)", price[PRICE_AMOUNT], service[SERVICE_SUFFIX], api[API_VAT], api[API_PRICE]);
			}
			case SERVICE_TYPE_FLAGS:
			{
				formatex(amount, charsmax(amount), "\y%d %s\w - %szl + VAT\r (%szl)", price[PRICE_AMOUNT], service[SERVICE_SUFFIX], api[API_VAT], api[API_PRICE]);
			}
		}
		new szService[4];
		num_to_str(iIndex, szService, 3);
		menu_additem(menu, amount, szService, 0);
	}

	menu_setprop(menu, MPROP_EXITNAME, "Wyjdz");
	menu_display(id, menu);
}

public AdminAmountMenuHandle(id, menu, item)
{
	if(item == MENU_EXIT)
	{
		menu_destroy(menu);
		return PLUGIN_HANDLED;
	}

	new data[6], szName[64];
	new access, callback;
	menu_item_getinfo(menu, item, access, data, charsmax(data), szName, charsmax(szName), callback);
	new iIndex = str_to_num(data);

	g_iAdminService[id] = iIndex;
	g_iAdminPrice[id] = item;

	AdminPlayerMenu(id);

	return PLUGIN_CONTINUE;
}

public AdminPlayerMenu(id)
{
	new menu = menu_create("Wybierz Gracza", "AdminPlayerMenuHandler");
	new players[32], pnum, tempid;
	new szName[32], szTempid[10];

	get_players(players, pnum);

	for( new i; i < pnum; i++ )
	{
		tempid = players[i];
		get_user_name(tempid, szName, charsmax(szName));
		num_to_str(tempid, szTempid, charsmax(szTempid));
		menu_additem(menu, szName, szTempid, 0);
	}

	menu_display(id, menu);
}

public AdminPlayerMenuHandler(id, menu, item)
{
	if(item == MENU_EXIT)
	{
		menu_destroy(menu);
		return PLUGIN_HANDLED;
	}

	new data[6], szName[64];
	new access, callback;
	menu_item_getinfo(menu, item, access, data, charsmax(data), szName, charsmax(szName), callback);

	new tempid = str_to_num(data);

	new service[ServiceData];
	ArrayGetArray(g_ServicesArray, g_iAdminService[id], service);

	g_iService[tempid] = g_iAdminService[id];
	g_iPrice[tempid] = g_iAdminPrice[id];

	if(service[SERVICE_TYPE] == SERVICE_TYPE_FLAGS && !g_iAuthType[tempid])
	{
		FreeAccessTypeMenu(tempid);
	}
	else
	{
		AddFreeService2(tempid);
	}

	menu_destroy(menu);
	return PLUGIN_CONTINUE;
}

public AddFreeService2(id)
{
	new service[ServiceData], price[PricesData];
	ArrayGetArray(g_ServicesArray, g_iService[id], service);
	ArrayGetArray(service[SERVICE_PRICES], g_iPrice[id], price);
	new ret;
	switch(service[SERVICE_TYPE])
	{
		case SERVICE_TYPE_SKINS:
		{
			g_fServiceBought = CreateOneForward(service[SERVICE_PlUGIN], "shop_service_bought", FP_CELL, FP_CELL, FP_STRING, FP_CELL);
			ExecuteForward(g_fServiceBought, ret, id, price[PRICE_AMOUNT], price[PRICE_NAME], service[SERVICE_WEAPONID]);
		}
		case SERVICE_TYPE_CUSTOM:
		{
			g_fServiceBought = CreateOneForward(service[SERVICE_PlUGIN], "shop_service_bought", FP_CELL, FP_CELL);
			ExecuteForward(g_fServiceBought, ret, id, price[PRICE_AMOUNT]);
		}
	}
	DestroyForward(g_fServiceBought);
	g_iService[id] = 0;
	g_iPrice[id] = 0;
}

public FreeAccessTypeMenu(id)
{
	new service[ServiceData];
	ArrayGetArray(g_ServicesArray, g_iService[id], service);
	new title[256], iLen;
	iLen = formatex(title, charsmax(title), "\wAdmin podarowal Ci darmowa usluge^n");
	iLen += formatex(title[iLen], charsmax(title) - iLen, "\y%s^n", service[SERVICE_TITLE]);
	iLen += formatex(title[iLen], charsmax(title) - iLen, "\wWybierz typ zapisu");
	new menu = menu_create(title, "FreeAccessTypeMenuHandle");

	menu_additem(menu, "Nick + Haslo");
	menu_additem(menu, "Adres IP");
	menu_additem(menu, "SteamID");

	menu_setprop(menu, MPROP_EXIT, MEXIT_NEVER);
	menu_display(id, menu);
}

public FreeAccessTypeMenuHandle(id, menu, item)
{
	if(item == MENU_EXIT)
	{
		menu_destroy(menu);
		return PLUGIN_HANDLED;
	}

	g_iAuthType[id] = 1<<item;

	if(g_iAuthType[id] == TYPE_NICK)
	{
		FreePasswordMenu(id);
		client_cmd(id, "messagemode fSklep_Haslo");
		return PLUGIN_CONTINUE;
	}

	AddFreeService(id, g_iService[id], g_iPrice[id]);

	return PLUGIN_CONTINUE;
}

public FreePasswordMenu(id)
{
	new title[256], iLen;

	iLen = formatex(title, charsmax(title), "\wHaslo do uslugi^n");
	if(strlen(g_szPassword[id]) > 0)
		iLen += formatex(title[iLen], charsmax(title) - iLen, "Podales haslo:\r %s^n", g_szPassword[id]);
	iLen += formatex(title[iLen], charsmax(title) - iLen, "\wJesli posiadasz juz podobna usluge^n");
	iLen += formatex(title[iLen], charsmax(title) - iLen, "z zapisem innym niz nick + haslo^n");
	iLen += formatex(title[iLen], charsmax(title) - iLen, "\ydane nie zostana zmienione^n");
	iLen += formatex(title[iLen], charsmax(title) - iLen, "\wnatomiast\y usluga zostanie przedluzona\w.");

	new menu = menu_create(title, "FreePasswordMenuHandle");
	new callback = menu_makecallback("FreePasswordMenuCallback");

	menu_additem(menu, "Kontynuuj", _, _, callback);
	menu_additem(menu, "Zmien Haslo");
	menu_additem(menu, "Anuluj");

	menu_setprop(menu, MPROP_EXIT, MEXIT_NEVER);
	menu_display(id, menu);
}

public FreePasswordMenuCallback(id, menu, item)
{
	if(item == 0 && strlen(g_szPassword[id]) < 1)
		return ITEM_DISABLED;

	return ITEM_ENABLED;
}

public FreePasswordMenuHandle(id, menu, item)
{
	if(item == MENU_EXIT || item == 2)
	{
		menu_destroy(menu);
		return PLUGIN_HANDLED;
	}

	switch(item)
	{
		case 0:
		{
			AddFreeService(id, g_iService[id], g_iPrice[id]);
		}

		case 1:
		{
			client_cmd(id, "messagemode fSklep_Haslo");
			PasswordMenu(id);
		}
	}

	return PLUGIN_CONTINUE;
}

public cmd_FreePassword(id)
{
	new szPassword[MAX_ACCESS_PASS + 1];
	read_args(szPassword, MAX_ACCESS_PASS);
	remove_quotes(szPassword);

	if(strlen(szPassword) < 4)
	{
		client_print(id, print_center, "Podaj przynajmniej 4 znaki");
		client_cmd(id, "messagemode fSklep_Haslo");
	}
	else
		formatex(g_szPassword[id], MAX_ACCESS_PASS, szPassword);

	FreePasswordMenu(id);
}

public AddFreeService(id, seviceId, priceId)
{
	new iError, szSendBuffer[640];

	g_iSocket[id] = socket_open(HOST, 80, SOCKET_TCP, iError);

	switch (iError)
	{
		case 1:
		{
			log_amx("[SMS] Unable to create socket.");
			return;
		}
		case 2: 
		{
			log_amx("[SMS] Unable to connect to hostname.");
			return;
		}
		case 3:
		{
			log_amx("[SMS] Unable to connect to the HTTP port.");
			return;
		}
	}

	new service[ServiceData];
	ArrayGetArray(g_ServicesArray, seviceId, service);

	new price[PricesData];
	ArrayGetArray(service[SERVICE_PRICES], priceId, price);

	new api[ApiData];
	ArrayGetArray(g_ApiArray[service[SERVICE_API]], price[PRICE_PRICE], api);

	new szName[256], szAuthData[256];
	get_user_name(id, szName, 255);

	escape_string(szName, 255);
	escape_string(g_szPassword[id], MAX_ACCESS_PASS);

	if(g_iAuthType[id] == TYPE_SID)
		get_user_authid(id, szAuthData, 255);
	else if(g_iAuthType[id] == TYPE_IP)
		get_user_ip(id, szAuthData, 255, 1);
	else
		copy(szAuthData, 255, szName);

	formatex(szSendBuffer, charsmax(szSendBuffer), "GET %s?action=free_service&\
	         service_id=%s&\
	         server_id=%d&\
	         amount=%d&\
	         player=%s&\
	         password=%s&\
	         authdata=%s&\
	         authtype=%d&\
	         net_id=%d \
	         HTTP/1.1^r^n\
	         Host: %s^r^nConnection: Close^r^n^r^n", SITE,
	         service[SERVICE_ID],
	         serverData[SERVER_ID],
	         price[PRICE_AMOUNT],
	         szName,
	         g_szPassword[id],
	         szAuthData,
	         g_iAuthType[id],
			 serverData[NETWORK_ID],
	         HOST);
	socket_send(g_iSocket[id], szSendBuffer, charsmax(szSendBuffer));

	set_task(0.5, "FreeSeviceAnswer", TASK_FREE_SERVICE + id, .flags="b");
}

public FreeSeviceAnswer(id)
{
	id -= TASK_FREE_SERVICE;
	if (socket_is_readable(g_iSocket[id]))
	{
		remove_task( TASK_FREE_SERVICE + id );

		new service[ServiceData], price[PricesData];
		ArrayGetArray(g_ServicesArray, g_iService[id], service);
		ArrayGetArray(service[SERVICE_PRICES], g_iPrice[id], price);

		new buf[1024];
		socket_recv(g_iSocket[id], buf, charsmax(buf));

		count = ExplodeString(lines, 14, SIZE, buf, 13);

		for(new i = 0; i < count; i++)
		{
			parse(lines[i], line_variable, SIZE, line_value, SIZE);

			if (equali(line_variable, "success"))
			{
				if(service[SERVICE_TYPE] == SERVICE_TYPE_FLAGS)
				{
					client_print_color(id, print_team_red, "^1[^3SklepSMS^1] Usluga dodana poprawnie!");
					if(g_iAuthType[id] == TYPE_NICK) client_print_color(id, print_team_red, "^1[^3SklepSMS^1] Wpisz w konsoli^x04 setinfo _pw ^"%s^"", g_szPassword[id]);
					client_print_color(id, print_team_red, "^1[^3SklepSMS^1] Usluga zostanie aktywna po ponownym polaczeniu z serwerem");
					LoadAccess();
				}
				break;
			}
		}

		g_iAuthType[id] = 0;
		g_szPassword[id] = "";
		g_iService[id] = 0;
		g_iPrice[id] = 0;

		socket_close(g_iSocket[id]);
	}
}

public AdminCodeMenu(id)
{
	new menu = menu_create("Wybierz wartosc kodu", "AdminCodeMenuHandler");

	menu_additem(menu, "1.23zl");
	menu_additem(menu, "2.46zl");
	menu_additem(menu, "3.69zl");
	menu_additem(menu, "4.92zl");
	menu_additem(menu, "6.15zl");
	menu_additem(menu, "7.38zl");
	menu_additem(menu, "11.07zl");
	menu_additem(menu, "17.22zl");
	menu_additem(menu, "23.37zl");
	menu_additem(menu, "30.75zl");

	menu_setprop(menu, MPROP_EXITNAME, "Wyjdz");
	menu_display(id, menu);
}

public AdminCodeMenuHandler(id, menu, item)
{
	if(item == MENU_EXIT)
	{
		menu_destroy(menu);
		return PLUGIN_HANDLED;
	}

	if(task_exists(ADMIN_GEN_CODE + id))
	{
		client_print_color(id, print_team_red, "^1[^3SklepSMS^1] Prosze nie spamowac!");
		menu_destroy(menu);
		return PLUGIN_HANDLED;
	}

	new iError, szSendBuffer[256];
	g_iSocket[id] = socket_open(HOST, 80, SOCKET_TCP, iError);

	formatex(szSendBuffer, charsmax(szSendBuffer), "GET %s?action=admin_code&\
	         net_id=%d&\
	         value=%d \
	         HTTP/1.1^r^n\
	         Host: %s^r^nConnection: Close^r^n^r^n", SITE,
	         serverData[NETWORK_ID],
	         item + 1,
	         HOST);
	socket_send(g_iSocket[id], szSendBuffer, charsmax(szSendBuffer));
	set_task(0.5, "AdminGenerateCode", ADMIN_GEN_CODE + id, .flags = "b");

	menu_destroy(menu);
	return PLUGIN_CONTINUE;
}

public AdminGenerateCode(id)
{
	id -= ADMIN_GEN_CODE;
	if (socket_is_readable(g_iSocket[id]))
	{
		remove_task(ADMIN_GEN_CODE + id);

		new buf[1024];
		socket_recv(g_iSocket[id], buf, charsmax(buf));

		count = ExplodeString(lines, 14, SIZE, buf, 13);

		for(new i = 0; i < count; i++)
		{
			parse(lines[i], line_variable, SIZE, line_value, SIZE);

			if (equali(line_variable, "success"))
			{
				client_print(id, print_console, "[SklepSMS] Wygenerowany kod SMS: %s", line_value);
				client_print_color(id, print_team_red, "^1[^3SklepSMS^1] Wygenerowany kod SMS:^4 %s", line_value);
			}
		}
	}
}

public NativeGenerateCode(plugin, params)
{
	if(params != 3)
		return PLUGIN_CONTINUE;

	new codeValue = get_param(1);
	new codeLen = get_param(2);
	new szCode[36];
	GenerateString(szCode, codeLen);

	new iError, szSendBuffer[256];
	g_iSocket[0] = socket_open(HOST, 80, SOCKET_TCP, iError);

	formatex(szSendBuffer, charsmax(szSendBuffer), "GET %s?action=generate_code&\
	         net_id=%d&\
	         value=%d&\
	         code=%s \
	         HTTP/1.1^r^n\
	         Host: %s^r^nConnection: Close^r^n^r^n", SITE,
	         serverData[NETWORK_ID],
			 codeValue,
	         szCode,
	         HOST);
	socket_send(g_iSocket[0], szSendBuffer, charsmax(szSendBuffer));
	set_task(0.5, "EmptyAnswer", EMPTY_ANSWER, .flags = "b");
	set_string(3, szCode, codeLen);

	return PLUGIN_CONTINUE;
}

public AmountMenu(id, iIndex) {
	new service[ServiceData];
	new price[PricesData];
	ArrayGetArray(g_ServicesArray, iIndex, service);

	new title[128];
	if(service[SERVICE_TYPE] == SERVICE_TYPE_SKINS) {
		formatex(title, charsmax(title), "\rSklep SMS\d - wybierz skin^n\y%s", service[SERVICE_DESC]);
	}
	else if(service[SERVICE_TYPE] == SERVICE_TYPE_CUSTOM) {
		formatex(title, charsmax(title), "\rSklep SMS\d - wybierz ilosc sztuk^n\y%s", service[SERVICE_DESC]);
	}
	else if(service[SERVICE_TYPE] == SERVICE_TYPE_FLAGS) {
		formatex(title, charsmax(title), "\rSklep SMS\d - wybierz ilosc dni^n\y%s", service[SERVICE_DESC]);
	}

	new menu = menu_create(title, "AmountMenuHandle");

	new amount[64];
	new iPrices = ArraySize(service[SERVICE_PRICES]);
	new api[ApiData];
	for(new i = 0; i < iPrices; i++) {
		ArrayGetArray(service[SERVICE_PRICES], i, price);
		ArrayGetArray(g_ApiArray[service[SERVICE_API]], price[PRICE_PRICE], api);

		switch(service[SERVICE_TYPE]) {
			case SERVICE_TYPE_SKINS: {
				formatex(amount, charsmax(amount), "\y%s\w - %szl + VAT\r (%szl)", price[PRICE_NAME], api[API_VAT], api[API_PRICE]);
			}
			case SERVICE_TYPE_CUSTOM: {
				formatex(amount, charsmax(amount), "\y%d %s\w - %szl + VAT\r (%szl)", price[PRICE_AMOUNT], service[SERVICE_SUFFIX], api[API_VAT], api[API_PRICE]);
			}
			case SERVICE_TYPE_FLAGS: {
				formatex(amount, charsmax(amount), "\y%d %s\w - %szl + VAT\r (%szl)", price[PRICE_AMOUNT], service[SERVICE_SUFFIX], api[API_VAT], api[API_PRICE]);
			}
		}
		new szService[4];
		num_to_str(iIndex, szService, 3);
		menu_additem(menu, amount, szService, 0);
	}

	menu_setprop(menu, MPROP_EXITNAME, "Wyjdz");
	menu_display(id, menu);
}

public AmountMenuHandle(id, menu, item) {
	if( item == MENU_EXIT ) {
		g_szPassword[id] = "";
		g_iAuthType[id] = 0;
		g_iService[id] = 0;
		g_iPrice[id] = 0;
		menu_destroy(menu);
		return PLUGIN_HANDLED;
	}

	g_szPassword[id] = "";
	g_iAuthType[id] = 0;

	new data[6], szName[64];
	new access, callback;
	menu_item_getinfo(menu, item, access, data, charsmax(data), szName, charsmax(szName), callback);
	new iIndex = str_to_num(data);

	g_iService[id] = iIndex;
	g_iPrice[id] = item;

	CodeMenu(id, iIndex, item);

	return PLUGIN_CONTINUE;
}

public AccessTypeMenu(id) {
	new menu = menu_create("Wybierz typ zapisu", "AccessTypeMenuHandle");

	menu_additem(menu, "Nick + Haslo");
	menu_additem(menu, "Adres IP");
	menu_additem(menu, "SteamID");

	menu_setprop(menu, MPROP_EXIT, MEXIT_NEVER);
	menu_display(id, menu);
}

public AccessTypeMenuHandle(id, menu, item) {
	if( item == MENU_EXIT ) {
		menu_destroy(menu);
		return PLUGIN_HANDLED;
	}

	g_iAuthType[id] = 1<<item;

	if(g_iAuthType[id] == TYPE_NICK) {
		PasswordMenu(id);
		client_cmd(id, "messagemode Sklep_Haslo");
		return PLUGIN_CONTINUE;
	}

	CodeMenu(id, g_iService[id], g_iPrice[id]);

	return PLUGIN_CONTINUE;
}

public PasswordMenu(id) {
	new title[256], iLen;

	iLen = formatex(title, charsmax(title), "\wHaslo do uslugi^n");
	if(strlen(g_szPassword[id]) > 0)
		iLen += formatex(title[iLen], charsmax(title) - iLen, "Podales haslo:\r %s^n", g_szPassword[id]);
	iLen += formatex(title[iLen], charsmax(title) - iLen, "\wJesli posiadasz juz podobna usluge^n");
	iLen += formatex(title[iLen], charsmax(title) - iLen, "z zapisem innym niz nick + haslo^n");
	iLen += formatex(title[iLen], charsmax(title) - iLen, "\ydane nie zostana zmienione^n");
	iLen += formatex(title[iLen], charsmax(title) - iLen, "\wnatomiast\y usluga zostanie przedluzona\w.");

	new menu = menu_create(title, "PasswordMenuHandle");
	new callback = menu_makecallback("PasswordMenuCallback");

	menu_additem(menu, "Kontynuuj", _, _, callback);
	menu_additem(menu, "Zmien Haslo");
	menu_additem(menu, "Anuluj");

	menu_setprop(menu, MPROP_EXIT, MEXIT_NEVER);
	menu_display(id, menu);
}

public PasswordMenuCallback(id, menu, item) {
	if(item == 0 && strlen(g_szPassword[id]) < 1)
		return ITEM_DISABLED;

	return ITEM_ENABLED;
}

public PasswordMenuHandle(id, menu, item) {
	if( item == MENU_EXIT || item == 2 ) {
		menu_destroy(menu);
		return PLUGIN_HANDLED;
	}

	switch(item) {
		case 0: {
			CodeMenu(id, g_iService[id], g_iPrice[id]);
		}

		case 1: {
			client_cmd(id, "messagemode Sklep_Haslo");
			PasswordMenu(id);
		}
	}

	return PLUGIN_CONTINUE;
}

public cmd_Password(id) {
	new szPassword[MAX_ACCESS_PASS + 1];
	read_args(szPassword, MAX_ACCESS_PASS);
	remove_quotes(szPassword);

	if(strlen(szPassword) < 4) {
		client_print(id, print_center, "Podaj przynajmniej 4 znaki");
		client_cmd(id, "messagemode Sklep_Haslo");
	}
	else
		formatex(g_szPassword[id], MAX_ACCESS_PASS, szPassword);

	PasswordMenu(id);
}

public CodeMenu(id, iIndex, item) {

	new service[ServiceData];
	ArrayGetArray(g_ServicesArray, iIndex, service);

	if(service[SERVICE_TYPE] == SERVICE_TYPE_FLAGS && !g_iAuthType[id]) {
		AccessTypeMenu(id);
		return;
	}

	new price[PricesData];
	ArrayGetArray(service[SERVICE_PRICES], item, price);

	new api[ApiData];
	ArrayGetArray(g_ApiArray[service[SERVICE_API]], price[PRICE_PRICE], api);

	new title[256], szOption[MAX_PRICE_NAME + 1];
	switch(service[SERVICE_TYPE]) {
		case SERVICE_TYPE_SKINS: {
			formatex(szOption, MAX_PRICE_NAME, price[PRICE_NAME]);
		}
		case SERVICE_TYPE_CUSTOM: {
			formatex(szOption, MAX_PRICE_NAME, "%d %s", price[PRICE_AMOUNT], service[SERVICE_SUFFIX]);
		}
		case SERVICE_TYPE_FLAGS: {
			formatex(szOption, MAX_PRICE_NAME, "%d %s", price[PRICE_AMOUNT], service[SERVICE_SUFFIX]);
		}
	}
	formatex(title, charsmax(title), "\rSklep SMS^n^n\
	       							\rWybrales usluge \w%s^n\
	       							\wOpcja: \y%s^n^n\
	       							\rWyslij SMS by dokonac zakupu^n\
	       							\rTresc SMS:\w %s^n\
	       							\rNumer SMS:\w %d^n\
	       							\rKoszt:\w %szl + VAT\d (%szl)^n\
	       							\yPo otrzymaniu kodu zwrotnego,^n\
	       							wybierz opcje (1) i wpisz kod", service[SERVICE_TITLE], szOption, api[API_MSG], api[API_NUMBER], api[API_VAT], api[API_PRICE]);

	new menu = menu_create(title, "CodeMenuHandle");

	menu_additem(menu, "Podaj Kod SMS");
	menu_additem(menu, "Anuluj");

	menu_setprop(menu, MPROP_EXIT, MEXIT_NEVER);
	menu_display(id, menu);
}

public CodeMenuHandle(id, menu, item) {
	if( item == MENU_EXIT || item == 1 ) {
		g_szPassword[id] = "";
		g_iAuthType[id] = 0;
		g_iService[id] = 0;
		g_iPrice[id] = 0;
		menu_destroy(menu);
		return PLUGIN_HANDLED;
	}

	client_print(id, print_center, "Wpisz teraz kod zwrotny SMS");
	client_cmd(id, "messagemode Kod_SMS");

	return PLUGIN_CONTINUE;
}

public cmd_SmsCode(id) {
	new szCode[13];
	read_args(szCode, 13);
	remove_quotes(szCode);

	SendSMSCode(id, szCode);

	client_print_color(id, print_team_red, "^1[^3SklepSMS^1] Sprawdzam Kod SMS...");
}

CheckLicense() {
	if(!gConnected) return;

	new qCommand[512];

	formatex(qCommand, charsmax(qCommand), "SELECT UNIX_TIMESTAMP(`license_expire`) AS `expire`, `license_expire` FROM \
	         `networks` WHERE `id` = %d AND `active` = 1;", get_pcvar_num(g_cNetworkID));

	SQL_ThreadQuery(g_SqlConn, "CheckLicenseHandler", qCommand);
}

public CheckLicenseHandler(FailState, Handle:Query, Error[], Errorcode) {
	if(Errorcode) log_amx("Blad w zapytaniu: %s [CheckLicenseHandler]", Error);

	if(FailState == TQUERY_CONNECT_FAILED) {
		log_amx("Nie mozna podlaczyc sie do bazy danych.");
		return PLUGIN_CONTINUE;
	}
	else if(FailState == TQUERY_QUERY_FAILED) {
		log_amx("Zapytanie anulowane [CheckLicenseHandler]");
		return PLUGIN_CONTINUE;
	}

	if(!SQL_NumResults(Query)) {
		log_amx("[SklepSMS] Licencja #%d nie jest aktywna", get_pcvar_num(g_cNetworkID));
		return set_fail_state("Brak licencji! Zakup i odnowa w panelu SklepSMS.pl");
	}

	new expire = SQL_ReadResult(Query, SQL_FieldNameToNum(Query, "expire"));
	new current_time = get_systime();

	if(current_time > expire) {
		log_amx("[SklepSMS] Licencja #%d nie jest aktywna", get_pcvar_num(g_cNetworkID));
		return set_fail_state("Brak licencji! Zakup i odnowa w panelu SklepSMS.pl");
	}

	new szTime[26];
	SQL_ReadResult(Query, SQL_FieldNameToNum(Query, "license_expire"), szTime, 25);

	serverData[NETWORK_ID] = get_pcvar_num(g_cNetworkID);
	log_amx("[SklepSMS] Licencja #%d aktywna do %s", serverData[NETWORK_ID], szTime);
	serverData[LICENSE_STATUS] = true;

	GetServer();

	return PLUGIN_CONTINUE;
}

GetServer() {
	if(!gConnected) return;

	new qCommand[512];

	new szIP[32];
	get_user_ip(0, szIP, charsmax(szIP));

	formatex(qCommand, charsmax(qCommand), "SELECT \
												srv.`id`, \
												srv.`name` \
											FROM \
												`servers` AS srv \
												INNER JOIN `networks` AS net \
											WHERE \
												srv.`ip_address` = '%s' \
												AND srv.`net_id` = %d \
												AND net.`license_expire` > CURRENT_TIMESTAMP \
											GROUP BY \
												srv.`name`;", szIP, serverData[NETWORK_ID]);
	SQL_ThreadQuery(g_SqlConn, "GetServerHandler", qCommand);
}

public GetServerHandler(FailState, Handle:Query, Error[], Errorcode) {
	if(Errorcode) log_amx("Blad w zapytaniu: %s [GetServerHandler]", Error);

	if(FailState == TQUERY_CONNECT_FAILED) {
		log_amx("Nie mozna podlaczyc sie do bazy danych.");
		return PLUGIN_CONTINUE;
	}
	else if(FailState == TQUERY_QUERY_FAILED) {
		log_amx("Zapytanie anulowane [GetServerHandler]");
		return PLUGIN_CONTINUE;
	}

	if(!SQL_NumResults(Query)) {
		log_amx("[SklepSMS] Serwer nie jest przypisany do sieci #%d", serverData[NETWORK_ID]);
		return set_fail_state("Popraw cvar shop_netid");
	}

	new szServer[64];
	serverData[SERVER_ID] = SQL_ReadResult(Query, SQL_FieldNameToNum(Query, "id"));
	SQL_ReadResult(Query, SQL_FieldNameToNum(Query, "name"), szServer, 63);
	log_amx("[SklepSMS] Serwer %s znaleziony", szServer);

	if(ArraySize(g_ServicesArray) > 0) {
		LoadService();
	}

	return PLUGIN_CONTINUE;
}

LoadService() {
	if(!gConnected) return;

	new qCommand[1512], iLen, service[ServiceData], services[512];
	new iSize = ArraySize(g_ServicesArray);

	for(new i = 0; i < iSize; i++) {
		ArrayGetArray(g_ServicesArray, i, service);

		add(services, charsmax(services), "'");
		add(services, charsmax(services), service[SERVICE_ID]);
		add(services, charsmax(services), "'");
		if(i != iSize - 1) add(services, charsmax(services), ",");
	}

	iLen = formatex(qCommand, charsmax(qCommand), "SELECT `s`.`service_id`, `s`.`service_title`, `s`.`service_description`, `s`.`service_suffix`, `s`.`service_type`, ");
	iLen += formatex(qCommand[iLen], charsmax(qCommand) - iLen, "`ss`.`prices_json`, `ss`.`flags`, `ss`.`weapon_id`, `na`.`api_key`, `na`.`api_id` ");
	iLen += formatex(qCommand[iLen], charsmax(qCommand) - iLen, "FROM `services` AS `s` INNER JOIN `server_services` AS `ss` ON `ss`.`service_id` = `s`.`service_id` ");
	iLen += formatex(qCommand[iLen], charsmax(qCommand) - iLen, "INNER JOIN `network_apis` AS `na` ON `ss`.`api` = `na`.`id` WHERE ");
	iLen += formatex(qCommand[iLen], charsmax(qCommand) - iLen, "`ss`.`server_id` = %d AND FIELD(`s`.`service_id`, %s) ORDER BY FIELD(`s`.`service_id`, %s)", serverData[SERVER_ID], services, services);

	SQL_ThreadQuery(g_SqlConn, "LoadServiceHandler", qCommand);
}

public LoadServiceHandler(FailState, Handle:Query, Error[], Errorcode) {
	if(Errorcode) log_amx("Blad w zapytaniu: %s [LoadServiceHandler]", Error);

	if(FailState == TQUERY_CONNECT_FAILED) {
		log_amx("Nie mozna podlaczyc sie do bazy danych.");
		return PLUGIN_CONTINUE;
	}
	else if(FailState == TQUERY_QUERY_FAILED) {
		log_amx("Zapytanie anulowane [LoadServiceHandler]");
		return PLUGIN_CONTINUE;
	}

	if(SQL_NumRows(Query)) {
		new service[ServiceData], price[PricesData], json[2048], g_iServiceLoad, s_id[MAX_SERVICE_ID + 1];
		new service_id = SQL_FieldNameToNum(Query, "service_id");
		new serviceTitle = SQL_FieldNameToNum(Query, "service_title");
		new service_description = SQL_FieldNameToNum(Query, "service_description");
		new service_suffix = SQL_FieldNameToNum(Query, "service_suffix");
		new service_type = SQL_FieldNameToNum(Query, "service_type");
		new prices_json = SQL_FieldNameToNum(Query, "prices_json");
		new weapon_id = SQL_FieldNameToNum(Query, "weapon_id");
		new api_id = SQL_FieldNameToNum(Query, "api_id");
		new api_key = SQL_FieldNameToNum(Query, "api_key");
		new flags = SQL_FieldNameToNum(Query, "flags");

		while(SQL_MoreResults(Query)) {
			ArrayGetArray(g_ServicesArray, g_iServiceLoad, service);
			json = "";

			SQL_ReadResult(Query, service_id, s_id, MAX_SERVICE_ID);

			SQL_ReadResult(Query, serviceTitle, service[SERVICE_TITLE], MAX_SERVICE_TITLE);
			SQL_ReadResult(Query, service_description, service[SERVICE_DESC], MAX_SERVICE_DESC);
			SQL_ReadResult(Query, service_suffix, service[SERVICE_SUFFIX], MAX_SERVICE_SUFFIX);
			service[SERVICE_TYPE] = SQL_ReadResult(Query, service_type);
			SQL_ReadResult(Query, prices_json, json, charsmax(json));
			service[SERVICE_PRICES] = _:ArrayCreate(PricesData);

			replace_all(json, charsmax(json), "[", "");
			replace_all(json, charsmax(json), "]", "");
			replace_all(json, charsmax(json), "},{", "@");
			replace_all(json, charsmax(json), "{", "");
			replace_all(json, charsmax(json), "}", "");
			replace_all(json, charsmax(json), "^"", "");
			replace_all(json, charsmax(json), "id:", "");
			replace_all(json, charsmax(json), "price:", "");
			replace_all(json, charsmax(json), "amount:", "");
			replace_all(json, charsmax(json), "name:", "");

			countPrices = ExplodeString(arrayPrices, 32, MAX_ARRAY_PRICES, json, '@');
			for(new i = 0; i < countPrices; i++) {
				ExplodeString(arrayPrice, 4, 63, arrayPrices[i], ',');

				price[PRICE_AMOUNT] = str_to_num(arrayPrice[1]);
				price[PRICE_PRICE] = str_to_num(arrayPrice[2]);
				if(service[SERVICE_TYPE] == SERVICE_TYPE_SKINS)
					formatex(price[PRICE_NAME], MAX_PRICE_NAME, arrayPrice[3]);

				ArrayPushArray(service[SERVICE_PRICES], price);
			}

			if(service[SERVICE_TYPE] == SERVICE_TYPE_FLAGS)
				SQL_ReadResult(Query, flags, service[SERVICE_FLAGS], MAX_SERVICE_FLAGS);
			if(service[SERVICE_TYPE] == SERVICE_TYPE_SKINS)
				service[SERVICE_WEAPONID] = SQL_ReadResult(Query, weapon_id);
			service[SERVICE_API] = SQL_ReadResult(Query, api_id);
			SQL_ReadResult(Query, api_key, service[SERVICE_KEY], MAX_SERVICE_KEY);

			service[SERVICE_ACTIVE] = true;

			if(service[SERVICE_TYPE] == SERVICE_TYPE_FLAGS) {
				new ret;
				g_fServiceData = CreateOneForward(service[SERVICE_PlUGIN], "shop_service_load", FP_STRING, FP_STRING);
				ExecuteForward(g_fServiceData, ret, service[SERVICE_TITLE], service[SERVICE_FLAGS]);
				DestroyForward(g_fServiceData);
			}

			ArraySetArray(g_ServicesArray, g_iServiceLoad, service);

			log_amx("[SklepSMS] Usluga %s pomyslnie wczytana", service[SERVICE_TITLE]);

			g_iServiceLoad++;
			SQL_NextRow(Query);
		}
	}

	return PLUGIN_CONTINUE;
}

LoadAccess() {
	if(!gConnected) return;

	new qCommand[1024];
	if(serverData[SERVER_ID] == 0) {
		new szIP[32];
		get_user_ip(0, szIP, charsmax(szIP));
		formatex(qCommand, charsmax(qCommand), "SELECT \
													`pf`.* \
												FROM \
													`players_flags` AS `pf`\
												    INNER JOIN `servers` AS `s` ON `s`.`ip_address` = '%s'\
												WHERE \
													`pf`.`server` = `s`.`id`", szIP);
	}
	else {
		formatex(qCommand, charsmax(qCommand), "SELECT * FROM `players_flags` WHERE `server` = %d", serverData[SERVER_ID]);
	}
	SQL_ThreadQuery(g_SqlConn, "LoadAccessHandler", qCommand);
}

public LoadAccessHandler(FailState, Handle:Query, Error[], Errorcode) {
	if(Errorcode) log_amx("Blad w zapytaniu: %s [LoadAccessHandler]", Error);

	if(FailState == TQUERY_CONNECT_FAILED) {
		log_amx("Nie mozna podlaczyc sie do bazy danych.");
		return PLUGIN_CONTINUE;
	}
	else if(FailState == TQUERY_QUERY_FAILED) {
		log_amx("Zapytanie anulowane [LoadAccessHandler]");
		return PLUGIN_CONTINUE;
	}

	TrieClear(g_accessTrie);
	ArrayClear(g_accessArray);
	g_iLastAccess = 0;

	new access[UserAccess];

	new iAuthType = SQL_FieldNameToNum(Query, "type");
	new iAuthData = SQL_FieldNameToNum(Query, "auth_data");
	new iAuthPassword = SQL_FieldNameToNum(Query, "password");
	new iFlags[MAX_ACCESS_FLAGS + 1], flag[2];
	for(new i = 'a', x = 0; i <= 'z'; i++, x++) {
		formatex(flag, 1, "%s", i);
		iFlags[x] = SQL_FieldNameToNum(Query, flag);
	}

	new authType, authData[44], authPassword[MAX_ACCESS_PASS + 1], authFlags[MAX_ACCESS_FLAGS + 1], tempFlag[2];

	if(SQL_NumRows(Query)) {

		while(SQL_MoreResults(Query)) {
			authType = SQL_ReadResult(Query, iAuthType);
			SQL_ReadResult(Query, iAuthData, authData, 43);
			SQL_ReadResult(Query, iAuthPassword, authPassword, MAX_ACCESS_PASS);

			for(new i = 0; i < sizeof(iFlags); i++) {
				if(iFlags[i] <= 0) continue;
				new iTime = SQL_ReadResult(Query, iFlags[i]);
				if(iTime > get_systime()) {
					SQL_FieldNumToName(Query, iFlags[i], tempFlag, 1);
					add(authFlags, MAX_ACCESS_FLAGS, tempFlag);
				}
			}

			access[ACCESS_TYPE] = authType;
			formatex(access[ACCESS_PASS], MAX_ACCESS_PASS, authPassword);
			formatex(access[ACCESS_FLAGS], MAX_ACCESS_FLAGS, authFlags);
			ArrayPushArray(g_accessArray, access);
			TrieSetCell(g_accessTrie, authData, g_iLastAccess++);
			count++;

			authFlags = "";

			SQL_NextRow(Query);
		}
	}

	log_amx("[SklepSMS] Znaleziono %d uslug na flagi", SQL_NumRows(Query));

	return PLUGIN_CONTINUE;
}

CheckAccess(id) {
	static userip[32], userauthid[32], password[40], username[32];
	new iIndex, access[UserAccess];

	get_user_ip(id, userip, 31, 1);
	get_user_authid(id, userauthid, 31);
	get_user_name(id, username, 31);

	if(TrieKeyExists(g_accessTrie, userip)) {
		TrieGetCell(g_accessTrie, userip, iIndex);
		ArrayGetArray(g_accessArray, iIndex, access);

		return set_user_flags(id, read_flags(access[ACCESS_FLAGS]));
	}
	else if(TrieKeyExists(g_accessTrie, userauthid)) {
		TrieGetCell(g_accessTrie, userauthid, iIndex);
		ArrayGetArray(g_accessArray, iIndex, access);

		return set_user_flags(id, read_flags(access[ACCESS_FLAGS]));
	}
	else if(TrieKeyExists(g_accessTrie, username)) {
		static md5Password[MAX_ACCESS_PASS + 1];
		TrieGetCell(g_accessTrie, username, iIndex);
		ArrayGetArray(g_accessArray, iIndex, access);

		get_user_info(id, "_pw", password, 39);
		hash_string(password, Hash_Md5, md5Password, MAX_ACCESS_PASS);

		if(equal(md5Password, access[ACCESS_PASS]))
			return set_user_flags(id, read_flags(access[ACCESS_FLAGS]));

		return server_cmd("kick #%d  SklepSMS: Bledne haslo (setinfo _pw)", get_user_userid(id));
	}

	return PLUGIN_CONTINUE;
}

public RegisterService(plugin, params) {

	if(params != 1)
		return PLUGIN_CONTINUE;

	new service[ServiceData];

	service[SERVICE_PlUGIN] = plugin;
	get_string(1, service[SERVICE_ID], MAX_SERVICE_ID);

	ArrayPushArray(g_ServicesArray, service);

	log_amx("[SklepSMS] Znaleziono plugin uslugi %s", service[SERVICE_ID]);

	return PLUGIN_CONTINUE;
}

public SendSMSCode(id, const smsCode[]) {
	new iError, szSendBuffer[640];

	g_iSocket[id] = socket_open(HOST, 80, SOCKET_TCP, iError);

	switch (iError) {
		case 1: {
			log_amx("[SMS] Unable to create socket.");
			return;
		}
		case 2: {
			log_amx("[SMS] Unable to connect to hostname.");
			return;
		}
		case 3: {
			log_amx("[SMS] Unable to connect to the HTTP port.");
			return;
		}
	}

	new service[ServiceData];
	ArrayGetArray(g_ServicesArray, g_iService[id], service);

	new price[PricesData];
	ArrayGetArray(service[SERVICE_PRICES], g_iPrice[id], price);

	new api[ApiData];
	ArrayGetArray(g_ApiArray[service[SERVICE_API]], price[PRICE_PRICE], api);

	new szName[256], szAuthData[256];
	get_user_name(id, szName, 255);

	escape_string(szName, 255);
	escape_string(g_szPassword[id], MAX_ACCESS_PASS);

	if(g_iAuthType[id] == TYPE_SID)
		get_user_authid(id, szAuthData, 255);
	else if(g_iAuthType[id] == TYPE_IP)
		get_user_ip(id, szAuthData, 255, 1);
	else {
		copy(szAuthData, 255, szName);
	}

	formatex(szSendBuffer, charsmax(szSendBuffer), "GET %s?action=sms&\
	         sms_code=%s&\
	         service_id=%s&\
	         server_id=%d&\
	         api=%d&\
	         api_key=%s&\
	         value=%s&\
	         cost=%s&\
	         amount=%d&\
	         income=%s&\
	         player=%s&\
	         password=%s&\
	         authdata=%s&\
	         authtype=%d&\
	         net_id=%d \
	         HTTP/1.1^r^n\
	         Host: %s^r^nConnection: Close^r^n^r^n", SITE,
	         smsCode,
	         service[SERVICE_ID],
	         serverData[SERVER_ID],
	         api[API_ID],
	         service[SERVICE_KEY],
	         api[API_VAT],
	         api[API_PRICE],
	         price[PRICE_AMOUNT],
	         api[API_INCOME],
	         szName,
	         g_szPassword[id],
	         szAuthData,
	         g_iAuthType[id],
			 serverData[NETWORK_ID],
	         HOST);
	socket_send(g_iSocket[id], szSendBuffer, charsmax(szSendBuffer));

	set_task(0.5, "SendSMSCodeAnswer", TASK_SMS_CODE + id, .flags = "b");
}

public SendSMSCodeAnswer(id) {
	id -= TASK_SMS_CODE;
	if (socket_is_readable(g_iSocket[id])) {
		remove_task( TASK_SMS_CODE + id );

		new service[ServiceData], price[PricesData], api[ApiData];
		ArrayGetArray(g_ServicesArray, g_iService[id], service);
		ArrayGetArray(service[SERVICE_PRICES], g_iPrice[id], price);
		ArrayGetArray(g_ApiArray[service[SERVICE_API]], price[PRICE_PRICE], api);

		new buf[1024];
		socket_recv(g_iSocket[id], buf, charsmax(buf));

		count = ExplodeString(lines, 14, SIZE, buf, 13);

		for(new i = 0; i < count; i++) {
			parse(lines[i], line_variable, SIZE, line_value, SIZE);

			if (equali(line_variable, "success")) {
				new Float:returnValue = str_to_float(line_value);
				new Float:serviceValue = str_to_float(api[API_INCOME]);
				if(returnValue < serviceValue) {
					client_print_color(id, print_team_red, "^1[^3SklepSMS^1] Wartosc wpisanego kodu wynosi^3 %.2f^1 a uslugi^3 %.2f", returnValue, serviceValue);
					client_print_color(id, print_team_red, "^1[^3SklepSMS^1] Usluga nie bedzie dodana a kod zostal wykorzystany, prosimy nie oszukiwac.");
				}
				else {
					new ret;
					switch(service[SERVICE_TYPE]) {
						case SERVICE_TYPE_SKINS: {
							g_fServiceBought = CreateOneForward(service[SERVICE_PlUGIN], "shop_service_bought", FP_CELL, FP_CELL, FP_STRING, FP_CELL);
							ExecuteForward(g_fServiceBought, ret, id, price[PRICE_AMOUNT], price[PRICE_NAME], service[SERVICE_WEAPONID]);
						}
						case SERVICE_TYPE_CUSTOM: {
							g_fServiceBought = CreateOneForward(service[SERVICE_PlUGIN], "shop_service_bought", FP_CELL, FP_CELL);
							ExecuteForward(g_fServiceBought, ret, id, price[PRICE_AMOUNT]);
						}
						case SERVICE_TYPE_FLAGS: {
							g_fServiceBought = CreateOneForward(service[SERVICE_PlUGIN], "shop_service_bought", FP_CELL, FP_CELL);
							ExecuteForward(g_fServiceBought, ret, id, price[PRICE_AMOUNT]);
							client_print_color(id, print_team_red, "^1[^3SklepSMS^1] Usluga zakupiona poprawnie!");
							if(g_iAuthType[id] == TYPE_NICK) client_print_color(id, print_team_red, "^1[^3SklepSMS^1] Wpisz w konsoli^x04 setinfo _pw ^"%s^"", g_szPassword[id]);
							client_print_color(id, print_team_red, "^1[^3SklepSMS^1] Usluga zostanie aktywna po ponownym polaczeniu z serwerem");
							LoadAccess();
						}
					}
					DestroyForward(g_fServiceBought);
				}
				break;
			}
			else if(equali(line_variable, "error")) {
				client_print_color(id, print_team_red, "^1[^3SklepSMS^1] Blad:^3 %s", line_value);
				break;
			}
		}

		g_iAuthType[id] = 0;
		g_szPassword[id] = "";
		g_iService[id] = 0;
		g_iPrice[id] = 0;

		socket_close(g_iSocket[id]);
	}
}

CreateAPI() {
	SettiAPI();
	ZabijakaAPI();
	ShotAPI();
	HostPlayAPI();
	PukawkaAPI();
}

stock ExplodeString( Output[][], Max, Size, Input[], Delimiter ) {
	new Idx, l = strlen(Input), Len;
	do Len += (1 + copyc( Output[Idx], Size, Input[Len], Delimiter ));
	while( (Len < l) && (++Idx < Max) );

	return Idx + 1;
}

public escape_string( temp[], Len ) {
	new string[256];
	copy(string, Len, temp);
	replace_all(string, Len, "%", "%%25");
	replace_all(string, Len, " ", "%%20");
	replace_all(string, Len, "!", "%%21");
	replace_all(string, Len, "*", "%%2A");
	replace_all(string, Len, "'", "%%27");
	replace_all(string, Len, "(", "%%28");
	replace_all(string, Len, ")", "%%29");
	replace_all(string, Len, ";", "%%3B");
	replace_all(string, Len, ":", "%%3A");
	replace_all(string, Len, "@", "%%40");
	replace_all(string, Len, "&", "%%26");
	replace_all(string, Len, "=", "%%3D");
	replace_all(string, Len, "+", "%%2B");
	replace_all(string, Len, "$", "%%24");
	replace_all(string, Len, ",", "%%2C");
	replace_all(string, Len, "/", "%%2F");
	replace_all(string, Len, "?", "%%3F");
	replace_all(string, Len, "#", "%%23");
	replace_all(string, Len, "[", "%%5B");
	replace_all(string, Len, "]", "%%5D");

	formatex(temp, Len, string);
}

public EmptyAnswer()
{
	if (socket_is_readable(g_iSocket[0]))
	{
		remove_task(EMPTY_ANSWER);
		socket_close(g_iSocket[0]);
	}
}

new const choices[] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
GenerateString(output[], const len)
{
    for(new i = 0; i < len; i++)
    {
        output[i] = choices[random(charsmax(choices))];
    }
    
    return len;
}
