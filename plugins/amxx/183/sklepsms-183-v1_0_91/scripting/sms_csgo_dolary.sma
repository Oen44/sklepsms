#include <amxmodx>
#include <smsshop>

native csgo_add_money(id, Float:amount);

new const service_id[MAX_SERVICE_ID + 1] = "csgo_dolary";
#define PLUGIN "Sklep-SMS: Usluga CSGO Dolary"

public plugin_natives() {
	set_native_filter("native_filter");
}

public plugin_init() {
	register_plugin(PLUGIN, VERSION, AUTHOR)
}

public plugin_cfg() {
	shop_register_service(service_id)
}

public shop_service_bought(id, amount) {
	client_print(id, print_center, "Dodano $%.2f", amount);
	csgo_add_money(id, float(amount));
}

public native_filter(const native_name[], index, trap) {
	if(trap == 0) {
		register_plugin(PLUGIN, VERSION, AUTHOR);
		pause_plugin();
		return PLUGIN_HANDLED;
	}

	return PLUGIN_CONTINUE;
}
