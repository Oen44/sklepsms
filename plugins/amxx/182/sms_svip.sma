#include <amxmodx>
#include <smsshop>

/*
Odkomentuj ponizej (usun // przed #define) jesli chcesz zablokowac
kupowanie uslugi gdy gracz ma juz flagi tej uslugi
*/
//#define BLOKUJ

new const service_id[MAX_SERVICE_ID + 1] = "sklep_svip";
#define PLUGIN "Sklep-SMS: Usluga VIP"

#if defined BLOKUJ
new g_szFlags[MAX_SERVICE_FLAGS + 1];
public shop_service_data(const szTitle[], const szFlags[]) {
	formatex(g_szFlags, charsmax(g_szFlags), szFlags);
}

public shop_service_addtomenu(id) {
	return (get_user_flags(id) & read_flags(g_szFlags) == read_flags(g_szFlags)) ? ITEM_DISABLED : ITEM_ENABLED;
}
#endif

public plugin_init() {
	register_plugin(PLUGIN, VERSION, AUTHOR)
}

public plugin_cfg() {
	shop_register_service(service_id);
}

