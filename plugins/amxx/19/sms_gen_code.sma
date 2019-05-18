#include <amxmodx>
#include <smsshop>

#define PLUGIN "Generate Code"

#define CODE_LEN 8

public plugin_init()
{
	register_plugin(PLUGIN, VERSION, AUTHOR);
	register_clcmd("say /gen", "GenerateCode");
}

public GenerateCode(id)
{
	new szCode[CODE_LEN];
	shop_generate_code(VALUE_7_38, CODE_LEN, szCode);
	client_print(id, print_chat, "Wygenerowany kod SMS o wartosci 7.38zl: %s", szCode);
}
