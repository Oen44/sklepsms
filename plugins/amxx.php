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
                echo "\"license\" \"$license\"";
            }
            else {
                echo "\"error\" \"Brak licencji\"";
            }
            break;
        }

        case "getsrv": {
            $ip = $_GET['ip'];
            $data = $db->getServerId($ip);
            if($data !== null) {
                echo chr(13)."\"server_id\" \"{$data['id']}\"";
                echo chr(13)."\"server_name\" \"{$data['name']}\"";
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

            echo $array;
            break;
        }

        case "sms": {
            $api = new API_Manager();
            $sms_code = $_GET['sms_code'];
            $api_id = $_GET['api'];
            $api_key = $_GET['api_key'];

            $api_result = $api->checkCode($api_id, $api_key, $sms_code);

            break;
        }
    }
