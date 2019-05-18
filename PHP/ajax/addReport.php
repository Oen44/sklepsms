<?php
	header('Access-Control-Allow-Origin: *');
	define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
	$pos = strpos(getenv('HTTP_REFERER'), getenv('HTTP_HOST'));
	//if(!$pos && !IS_AJAX) die('Restricted Access');
    require '../include/DB_Functions.php';
	require '../include/Mailer.php';

    $db = new DB_Functions();
	$mailer = new Mailer();
	
	$user_id = $_POST['user_id'];
	$title = $_POST['title'];
	$description = $_POST['description'];
	$email = $_POST['email'];
	
	$description = htmlspecialchars($description, ENT_QUOTES, 'UTF-8');
	$title = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');

    $report_id = $db->addReport($user_id, $title, $description);
	$mailer->newReportMail($report_id, $email, $title, $description, date("Y-m-d H:i:s"));