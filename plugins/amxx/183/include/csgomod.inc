#if defined _csgomod_included
  #endinput
#endif
#define _csgomod_included

native set_player_case_ak47(index, amount);
native get_player_case_ak47(index);

native set_player_case_m4a1(index, amount);
native get_player_case_m4a1(index);

native set_player_case_awp(index, amount);
native get_player_case_awp(index);

native set_player_case_dgl(index, amount);
native get_player_case_dgl(index);

native set_player_case_famas(index, amount);
native get_player_case_famas(index);

native set_player_key(index, amount);
native get_player_key(index);

native set_player_ak47(index, skin);
native get_player_ak47(index, skin);

native set_player_m4a1(index, skin);
native get_player_m4a1(index, skin);

native set_player_awp(index, skin);
native get_player_awp(index, skin);

native set_player_deagle(index, skin);
native get_player_deagle(index, skin);

native set_player_famas(index, skin);
native get_player_famas(index, skin);

native set_player_knife(index, skin);
native get_player_knife(index, skin);

native set_player_glock(index, skin);
native get_player_glock(index, skin);

native set_player_usp(index, skin);
native get_player_usp(index, skin);

native set_player_case_usp(index, amount);
native get_player_case_usp(index);

native set_player_case_glock(index, amount);
native get_player_case_glock(index);

native set_player_case_mp5(index, amount);
native get_player_case_mp5(index);

native csgo_add_case(index, Case);

native csgo_reset_skins(index);
native csgo_check_skins(index);

native csgo_add_depotcase(id, casetype, amount);

native csgo_get_skin_name(id, szSkin[], len);

native Float:csgo_get_money(id);
native csgo_add_money(id, Float:amount);
native csgo_set_money(id, Float:amount);

forward OnOperationChange();
/* AMXX-Studio Notes - DO NOT MODIFY BELOW HERE
*{\\ rtf1\\ ansi\\ deff0{\\ fonttbl{\\ f0\\ fnil Tahoma;}}\n\\ viewkind4\\ uc1\\ pard\\ lang1045\\ f0\\ fs16 \n\\ par }
*/
