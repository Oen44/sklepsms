<?php
	header('Access-Control-Allow-Origin: *');
	define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
	$pos = strpos(getenv('HTTP_REFERER'), getenv('HTTP_HOST'));
	//if(!$pos && !IS_AJAX) die('Restricted Access');
    require '../include/DB_Functions.php';

    $db = new DB_Functions();
	
	$net_id = $_POST['net_id'];
	$s_id = $_POST['s_id'];
	$s_title = $_POST['s_title'];
	$s_desc = $_POST['s_desc'];
	$s_suffix = $_POST['s_suffix'];
	$s_type = $_POST['s_type'];
	
	$db->addService($net_id, $s_id, $s_title, $s_desc, $s_suffix, $s_type);