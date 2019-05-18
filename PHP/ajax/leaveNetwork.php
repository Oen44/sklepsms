<?php
	header('Access-Control-Allow-Origin: *');
	define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
	$pos = strpos(getenv('HTTP_REFERER'), getenv('HTTP_HOST'));
	//if(!$pos && !IS_AJAX) die('Restricted Access');
    require '../include/DB_Functions.php';

    $db = new DB_Functions();
	
	$user_id = $_POST['user_id'];
	$net_id = $_POST['net_id'];
	
	$data = $db->getPartners($net_id);
	$partners = $data[0];
	$owner = $data[1];
	
	if($owner == $user_id)
		return;
	
	$partners = unserialize($partners);
	$index = array_search($user_id, $partners);
	
	array_splice($partners, $index, 1);
	
	if(count($partners) == 0)
		$partners = null;
	else
		$partners = serialize($partners);
	
	$db->leaveNetwork($net_id, $partners);
	