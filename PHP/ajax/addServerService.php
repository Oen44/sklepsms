<?php
	header('Access-Control-Allow-Origin: *');
	define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
	$pos = strpos(getenv('HTTP_REFERER'), getenv('HTTP_HOST'));
	//if(!$pos && !IS_AJAX) die('Restricted Access');
    require '../include/DB_Functions.php';

    $db = new DB_Functions();
	
	$server_id = $_POST['server_id'];
	$service_id = $_POST['service_id'];
	$prices_json = $_POST['prices'];
	$prices = serialize(json_decode($prices_json));
	$flags = $_POST['flags'];
	$weapon_id = $_POST['weapon_id'];
	$service_api = $_POST['service_api'];
	
	$db->addServerService($server_id, $service_id, $prices, $prices_json, $flags, $weapon_id, $service_api);