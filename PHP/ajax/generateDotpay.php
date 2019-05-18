<?php
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
	
	header('Access-Control-Allow-Origin: *');
	define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
	$pos = strpos(getenv('HTTP_REFERER'), getenv('HTTP_HOST'));
	//if(!$pos && !IS_AJAX) die('Restricted Access');
	
	function GenerateChkDotpayRedirection($DotpayId, $DotpayPin, $Environment, $RedirectionMethod, $ParametersArray) {
		$ParametersArray['id'] = $DotpayId;
		$ChkParametersChain = $DotpayPin.
		(isset($ParametersArray ['api_version']) ? $ParametersArray ['api_version'] : null).
		(isset($ParametersArray ['charset']) ? $ParametersArray ['charset'] : null).
		(isset($ParametersArray ['lang']) ? $ParametersArray ['lang'] : null).
		(isset($ParametersArray ['id']) ? $ParametersArray ['id'] : null).
		(isset($ParametersArray ['amount']) ? $ParametersArray ['amount'] : null).
		(isset($ParametersArray ['currency']) ? $ParametersArray ['currency'] : null).
		(isset($ParametersArray ['description']) ? $ParametersArray ['description'] : null).
		(isset($ParametersArray ['control']) ? $ParametersArray ['control'] : null).
		(isset($ParametersArray ['channel']) ? $ParametersArray ['channel'] : null).
		(isset($ParametersArray ['credit_card_brand']) ? $ParametersArray ['credit_card_brand'] : null).
		(isset($ParametersArray ['ch_lock']) ? $ParametersArray ['ch_lock'] : null).
		(isset($ParametersArray ['channel_groups']) ? $ParametersArray ['channel_groups'] : null).
		(isset($ParametersArray ['onlinetransfer']) ? $ParametersArray ['onlinetransfer'] : null).
		(isset($ParametersArray ['url']) ? $ParametersArray ['url'] : null).
		(isset($ParametersArray ['type']) ? $ParametersArray ['type'] : null).
		(isset($ParametersArray ['buttontext']) ? $ParametersArray ['buttontext'] : null).
		(isset($ParametersArray ['urlc']) ? $ParametersArray ['urlc'] : null).
		(isset($ParametersArray ['firstname']) ? $ParametersArray ['firstname'] : null).
		(isset($ParametersArray ['lastname']) ? $ParametersArray ['lastname'] : null).
		(isset($ParametersArray ['email']) ? $ParametersArray ['email'] : null).
		(isset($ParametersArray ['street']) ? $ParametersArray ['street'] : null).
		(isset($ParametersArray ['street_n1']) ? $ParametersArray ['street_n1'] : null).
		(isset($ParametersArray ['street_n2']) ? $ParametersArray ['street_n2'] : null).
		(isset($ParametersArray ['state']) ? $ParametersArray ['state'] : null).
		(isset($ParametersArray ['addr3']) ? $ParametersArray ['addr3'] : null).
		(isset($ParametersArray ['city']) ? $ParametersArray ['city'] : null).
		(isset($ParametersArray ['postcode']) ? $ParametersArray ['postcode'] : null).
		(isset($ParametersArray ['phone']) ? $ParametersArray ['phone'] : null).
		(isset($ParametersArray ['country']) ? $ParametersArray ['country'] : null).
		(isset($ParametersArray ['code']) ? $ParametersArray ['code'] : null).
		(isset($ParametersArray ['p_info']) ? $ParametersArray ['p_info'] : null).
		(isset($ParametersArray ['p_email']) ? $ParametersArray ['p_email'] : null).
		(isset($ParametersArray ['n_email']) ? $ParametersArray ['n_email'] : null).
		(isset($ParametersArray ['expiration_date']) ? $ParametersArray ['expiration_date'] : null).
		(isset($ParametersArray ['deladdr']) ? $ParametersArray ['deladdr'] : null).
		(isset($ParametersArray ['recipient_account_number']) ? $ParametersArray ['recipient_account_number'] : null).
		(isset($ParametersArray ['recipient_company']) ? $ParametersArray ['recipient_company'] : null).
		(isset($ParametersArray ['recipient_first_name']) ? $ParametersArray ['recipient_first_ name'] : null).
		(isset($ParametersArray ['recipient_last_name']) ? $ParametersArray ['recipient_last_name'] : null).
		(isset($ParametersArray ['recipient_address_street']) ? $ParametersArray ['recipient_address_street'] : null).
		(isset($ParametersArray ['recipient_address_building']) ? $ParametersArray ['recipient_address_building'] : null).
		(isset($ParametersArray ['recipient_address_apartment']) ? $ParametersArray ['recipient_address_apartment'] : null).
		(isset($ParametersArray ['recipient_address_postcode']) ? $ParametersArray ['recipient_address_postcode'] : null).
		(isset($ParametersArray ['recipient_address_city']) ? $ParametersArray ['recipient_address_city'] : null).
		(isset($ParametersArray ['application']) ? $ParametersArray ['application'] : null).
		(isset($ParametersArray ['application_version']) ? $ParametersArray ['application_version'] : null).
		(isset($ParametersArray ['warranty']) ? $ParametersArray ['warranty'] : null).
		(isset($ParametersArray ['bylaw']) ? $ParametersArray ['bylaw'] : null).
		(isset($ParametersArray ['personal_data']) ? $ParametersArray ['personal_data'] : null).
		(isset($ParametersArray ['credit_card_number']) ? $ParametersArray ['credit_card_number'] : null).
		(isset($ParametersArray ['credit_card_expiration_date_year']) ? $ParametersArray ['credit_card_expiration_date_year'] : null).
		(isset($ParametersArray ['credit_card_expiration_date_month']) ? $ParametersArray ['credit_card_expiration_date_month'] : null).
		(isset($ParametersArray ['credit_card_security_code']) ? $ParametersArray ['credit_card_security_code'] : null).
		(isset($ParametersArray ['credit_card_ store']) ? $ParametersArray ['credit_card_store'] : null).
		(isset($ParametersArray ['credit_card_store_security_code']) ? $ParametersArray ['credit_card_store_security_code'] : null).
		(isset($ParametersArray ['credit_card_customer_id']) ? $ParametersArray ['credit_card_customer_id'] : null).
		(isset($ParametersArray ['credit_card_id']) ? $ParametersArray ['credit_card_id'] : null).
		(isset($ParametersArray ['blik_code']) ? $ParametersArray ['blik_code'] : null).
		(isset($ParametersArray ['credit_card_registration']) ? $ParametersArray ['credit_card_registration'] : null).
		(isset($ParametersArray ['recurring_frequency']) ? $ParametersArray ['recurring_frequency'] : null).
		(isset($ParametersArray ['recurring_interval']) ? $ParametersArray ['recurring_interval'] : null).
		(isset($ParametersArray ['recurring_start']) ? $ParametersArray ['recurring_start'] : null).
		(isset($ParametersArray ['recurring_count']) ? $ParametersArray ['recurring_count'] : null);
		
		$ChkValue = hash('sha256', $ChkParametersChain);
		
		if ($Environment =='production') {
			$EnvironmentAddress ='https://ssl.dotpay.pl/t2/';
		}
		else if ($Environment =='test') {
			$EnvironmentAddress ='https://ssl.dotpay.pl/test_payment/';
		}
		if ($RedirectionMethod =='POST') {
			/*$RedirectionCode = '<form action="'.$EnvironmentAddress.'" method="POST" id="dotpay_redirection_form">'.PHP_EOL;
			foreach($ParametersArray as $key => $value) {
				$RedirectionCode .= "\t".'<input name="'.$key.'" value="'.$value.'" type="hidden"/>'.PHP_EOL;
			}
			$RedirectionCode .= "\t".'<input name="chk" value="'.$ChkValue.'" type="hidden"/>'.PHP_EOL;
			$RedirectionCode .= '</form>'. PHP_EOL .'<button id="dotpay_redirection_button" type="submit" form="dotpay_redirection_form" value="Submit">Confirm and Pay</button>'.PHP_EOL;
			$data["chk"] = $ChkValue;
			return $RedirectionCode . ' ' . $ChkValue . ' ' . json_encode($data);*/
			$data = Array();
			$data["control"] = $ParametersArray ['control'];
			$data["desc"] = $ParametersArray ['description'];
			$data["chk"] = $ChkValue;
			$data["id"] = $DotpayId;
			return json_encode($data);
		}
		else if ($RedirectionMethod =='GET') { $RedirectionCode = $EnvironmentAddress.'?';
			foreach($ParametersArray as $key => $value) {
				$RedirectionCode .= $key.'='.rawurlencode($value).'&';
			}
			$RedirectionCode .= 'chk='.$ChkValue;
			return $RedirectionCode;
		}
	}
	
	$net_id = isSet($_POST['net_id']) ? $_POST['net_id'] : 1;
	$days = isSet($_POST['days']) ? $_POST['days'] : 30;
	$price = isSet($_POST['price']) ? $_POST['price'] : 10.00;
	//$id = "726022";
	$id = "310565";
	
	$Params = array(
		"api_version" => "dev",
		"amount" => $price,
		"currency" => "PLN",
		"description" => "Licencja SklepSMS ".$days." Dni",
		"url" => "https://sklepsms.pl/#/UserLicense",
		"type" => "2",
		"buttontext" => "Wróc do SklepSMS",
		"urlc" => "https://sklepsms.pl/dotpay_callback.php",
		"control" => $net_id . ":" . $days,
		"country" => "POL",
		"lang" => "pl"
	);
	
	//echo GenerateChkDotpayRedirection($id, "TL6dSNmM4u7er69UWu6PejhkJnFAdnW0", "test", "POST", $Params);
	echo GenerateChkDotpayRedirection($id, "RW7tB1zVJjL1MiIDCQ3gGWd7osAH8OB7", "production", "POST", $Params);
	
?>