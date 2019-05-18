<?php
	header('Access-Control-Allow-Origin: *');
	//define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
	//$pos = strpos(getenv('HTTP_REFERER'), getenv('HTTP_HOST'));
	//if(!$pos && !IS_AJAX) die('Restricted Access');
    require '../include/DB_Functions.php';

    $db = new DB_Functions();

    $json = $db->getServerInfo($_POST['user_id'], $_POST['net_id'], $_POST['version']);
	
	function filter(&$value) {
		$value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
	}
	
	array_walk_recursive($json, "filter");
	
	echo json_encode($json);
