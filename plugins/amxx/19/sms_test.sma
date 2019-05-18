#include <amxmodx>
#include <smsshop>

new const service_id[MAX_SERVICE_ID + 1] = "4fun_monety";
#define PLUGIN "Sklep-SMS: Usluga Test"

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
	client_print_color(id, id, "^1Dodano^3 %d^1 monet", amount);
}

public native_filter(const native_name[], index, trap) {
	if(trap == 0) {
		register_plugin(PLUGIN, VERSION, AUTHOR);
		pause_plugin();
		return PLUGIN_HANDLED;
	}

	return PLUGIN_CONTINUE;
}
