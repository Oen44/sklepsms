<?php
	header('Access-Control-Allow-Origin: *');
	define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
	$pos = strpos(getenv('HTTP_REFERER'), getenv('HTTP_HOST'));
	//if(!$pos && !IS_AJAX) die('Restricted Access');
?>

{
    "version": "1.0.5",
    "amxx": {
        "v182": {
            "pack": "sklepsms-182-v1_0_5.rar",
            "update": "sklepsms-182-v1_0_5u.rar"
        },

        "v183": {
            "pack": "sklepsms-183-v1_0_5.rar",
            "update": "sklepsms-183-v1_0_5u.rar"
        }
    }
}