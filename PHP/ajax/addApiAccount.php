<?php
	header('Access-Control-Allow-Origin: *');
	define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
	$pos = strpos(getenv('HTTP_REFERER'), getenv('HTTP_HOST'));
	//if(!$pos && !IS_AJAX) die('Restricted Access');
    require '../include/DB_Functions.php';

    $db = new DB_Functions();
	
	$net_id = $_POST['net_id'];
	$api_id = $_POST['api_id'];
	$api_key = $_POST['api_key'];
	$api_title = $_POST['api_title'];

    $db->addApiAccount($net_id, $api_id, $api_key, $api_title);
