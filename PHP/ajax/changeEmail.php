<?php
	header('Access-Control-Allow-Origin: *');
	define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
	$pos = strpos(getenv('HTTP_REFERER'), getenv('HTTP_HOST'));
	//if(!$pos && !IS_AJAX) die('Restricted Access');
    require '../include/DB_Functions.php';

    $db = new DB_Functions();
	
	$user_id = $_POST['user_id'];
	$email = $_POST['email'];
	
	$db->changeEmail($user_id, $email);
	
