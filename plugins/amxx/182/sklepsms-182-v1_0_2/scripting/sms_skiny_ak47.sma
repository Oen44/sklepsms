#include <amxmodx>
#include <smsshop>

native csgo_add_skin(index, weapon, skin);

new const service_id[MAX_SERVICE_ID + 1] = "csgo_skiny_ak47";
#define PLUGIN "Sklep-SMS: Usluga Skiny AK47"

public plugin_natives() {
	set_native_filter("native_filter");
}

public plugin_init() {
	register_plugin(PLUGIN, VERSION, AUTHOR)
}

public plugin_cfg() {
	shop_register_service(service_id)
}

public shop_service_bought(id, amount, const szName[], weapon_id) {
	client_print(id, print_center, "Skin %s zostal dodany", szName);
	csgo_add_skin(id, weapon_id, amount);
}

public native_filter(const native_name[], index, trap) {
	if(trap == 0) {
		register_plugin(PLUGIN, VERSION, AUTHOR);
		pause_plugin();
		return PLUGIN_HANDLED;
	}

	return PLUGIN_CONTINUE;
}
