<?php
	header('Access-Control-Allow-Origin: *');
	define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
	$pos = strpos(getenv('HTTP_REFERER'), getenv('HTTP_HOST'));
	//if(!$pos && !IS_AJAX) die('Restricted Access');
    
	$content = "<?php header('Access-Control-Allow-Origin: https://panel.sklepsms.pl'); die('%code%'); ?>";
	
	$code = md5($_POST['web_page']);
	
	$code = substr($code, 0, 16);
	
	$content = str_replace("%code%", $code, $content);
	
	$file = fopen(__DIR__ . '/../verify/' . $code . '.php', 'w');
	fwrite($file, $content);
	fclose($file);
	
	echo $code;