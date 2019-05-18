<?php
	header('Access-Control-Allow-Origin: *');
	define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
	$pos = strpos(getenv('HTTP_REFERER'), getenv('HTTP_HOST'));
	//if(!$pos && !IS_AJAX) die('Restricted Access');
    require '../include/DB_Functions.php';

    $db = new DB_Functions();
	
	$net_id = $_POST['net_id'];

    $partners = $db->getPartners($net_id);
    $partners = $partners[0];
	
	$partners = unserialize($partners);
	$data = Array();
	if($partners) {
		for($i = 0; $i < count($partners); $i++) {
			$user = $db->getUserById($partners[$i]);
			$data[$i] = Array(
				"id" => $partners[$i],
				"username" => $user['username']
			);
		}
	}
	echo json_encode($data);
