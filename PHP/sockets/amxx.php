<?php
    Header("Content-Type: text/plain");
    require '../include/DB_Functions.php';
    require '../api/API_Manager.php';
	
    $db = new DB_Functions();
	
    $action = $_GET['action'];
    
    switch($action) {
        case "ckl": {
            $netid = $_GET['netid'];
            $license = $db->checkLicense($netid);
            if($license !== false) {
                echo chr(13)."\"license\" \"$license\"";
            }
            else {
                echo chr(13)."\"error\" \"Brak licencji\"";
            }
            break;
        }

        case "getsrv": {
            $ip = $_GET['ip'];
            $netid = $_GET['netid'];
            $data = $db->getServerId($ip, $netid);
            if($data) {
                echo chr(13)."\"server_id\" \"{$data['id']}\"";
                echo chr(13)."\"server_name\" \"{$data['name']}\"";
            }
			else {
				echo chr(13)."\"error\" \"error\"";
			}
            break;
        }

        case "loadsrv": {
            $service = $_GET['service'];
            $server = $_GET['server'];
            $data = $db->getServiceData($service, $server);
            
            $semicolon = "[semicolon]";
            $separator = "[separator]";
            $star = "[star]";
            
            $title = str_replace(";", $semicolon, $data['service_title']);
            $desc = str_replace(";", $semicolon, $data['service_description']);
            $suffix = str_replace(";", $semicolon, $data['service_suffix']);
            $type = $data['service_type'];
            $flags = $data['flags'] ? $data['flags'] : '0';
            $weaponid = $data['weapon_id'];
            $api = $data['api'];
            $api_key = $data['api_key'];
            $prices = "";
            $pricesArray = unserialize($data['prices']);

            foreach($pricesArray as $price) {
                if($type == 2) {
                    $name = str_replace("*", $star, $price->name);
                    $prices .= $price->amount . '*' . $price->price . '*' . $name;
                }
                else {
                    $prices .= $price->amount . '*' . $price->price;
                }

                $prices .= "|";
            }

            $prices = substr($prices, 0, strlen($prices) - 1);

            $array = '"service" "' . $title . ';' . $desc . ';' . $suffix . ';' . $type . ';' . $prices . ';' . $flags . ';' . $weaponid . ';' . $api . ';' . $api_key . '"';

            echo chr(13).$array;
            break;
        }

        case "sms": {
            $api = new API_Manager();
            $sms_code = $_GET['sms_code'];
            $server_api = $_GET['api'];
            $api_key = $_GET['api_key'];
            $value = $_GET['value'];
            $service_id = $_GET['service_id'];
            $server_id = $_GET['server_id'];
            $cost = $_GET['cost'];
            $income = $_GET['income'];
            $amount = $_GET['amount'];
            $player = $_GET['player'];
            $authdata = $_GET['authdata'];
            $authtype = $_GET['authtype'];
            $password = $_GET['password'];
			
			$api_id = $db->getAPI($api_key);

            $api_result = $api->checkCode($api_id, $api_key, $sms_code, $value);
			
			if($api_result[0] == "success") {
				
				$service = $db->getServiceData($service_id, $server_id);
				
				if($service['service_type'] == 0) {
					$db->addFlags($server_id, $authtype, $authdata, $password, $service['flags'], $amount);
				}
				
				$db->insertIncome($server_id, $service_id, $player, $sms_code, $amount, $cost, $income);
			}
			
			echo "\"{$api_result[0]}\" \"{$api_result[1]}\"";

            break;
        }
    }
