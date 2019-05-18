#if defined _smsshop_included
	#endinput
#endif
#define _smsshop_included

#pragma library "smsshop"

#include <smsshop_const>

/*
*	shop_generate_code
*	value - wartosc kodu
*	len - dlugosc wygenerowanego kodu
*	szCode[] - do czego skopiowac kod
*
*	Generuje kod, zapisuje do bazy i zwraca do szCode[]
*	Brak zwracanej wartosci
*/
native shop_generate_code(value, len, szCode[]);

/*
*	shop_register_service
*	service_id[] - id uslugi dodanej w panelu
*
*	Rejestruje usluge i pobiera jej dane.
*	Brak zwracanej wartosci
*/
native shop_register_service(const service_id[]);

/*
*	shop_service_bought
*	index - id gracza
*	amount - ilosc (dni, przedmiotow lub id skina)
*	szName[] - nazwa skina jesli typ uslugi to skiny
*	weapon_id - id broni do ktorej przypisany zostanie skin (amount)
*
*	Funkcja wykonuje sie gdy kod SMS jest poprawny
*	Return nie wplywa na dalsze dzialanie sklepu
*/
forward shop_service_bought(index, amount, const szName[], weapon_id);

/*
*	shop_service_addtomenu
*	index - id gracza ktoremu pokazuje sie menu
*
*	Funkcja wykonuje sie gdy usluga jest dodana do menu /sklepsms
*	return ITEM_ENABLED aby usluga byla mozliwa do wyboru
*	return ITEM_DISABLED aby usluga byla zablokowana w menu
*/
forward shop_service_addtomenu(index);

/*
*	shop_service_load
*	szTitle[] - nazwa uslugi
*	szFlags[] - flagi przypisane do uslugi
*
*	Funkcja wykonuje sie gdy usluga zostala zaladowana
*	Return nie wplywa na dalsze dzialanie sklepu
*/
forward shop_service_load(const szTitle[], const szFlags[]);

/*
*	pause_plugin
*
*	Stock do zatrzymania pluginu
*/
stock pause_plugin() {
	static szFile[32];
	get_plugin(-1, szFile, sizeof szFile);
	pause("ad", szFile);
}
