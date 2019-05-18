<?php
	header('Access-Control-Allow-Origin: https://panel.sklepsms.pl');
	header('Access-Control-Allow-Headers: content-type');
	define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
	$pos = strpos(getenv('HTTP_REFERER'), getenv('HTTP_HOST'));
	if(!$pos && !IS_AJAX) die('Restricted Access');
	
	$agent = 'Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.0.3705; .NET CLR 1.1.4322)';
	
	$url = $_POST['url'];
	
	$curl = curl_init(); 

	curl_setopt($curl, CURLOPT_URL, $url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HEADER, false);
	curl_setopt($curl, CURLOPT_USERAGENT, $agent);

	$result = curl_exec($curl);

	curl_close($curl);

	echo $result;
