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
	$rep_id = $_POST['rep_id'];
	$description = $_POST['description'];
	$title = $_POST['title'];
	$date = $_POST['date'];
	$email = $_POST['email'];
	
	$description = htmlspecialchars($description, ENT_QUOTES, 'UTF-8');
	$title = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');

    $db->addAnswer($user_id, $rep_id, $description);
	$mailer->newAnswerMail($rep_id, $email, $title, $description, $date);