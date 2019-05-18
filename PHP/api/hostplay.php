<?php
	function HostPlay($keyapi, $code, $value) {
		$paid = 'homepay_sms';
		$comment = 'SklepSMS';
		
		$api = @file_get_contents("http://hostplay.pl/api/payment/api_code_verify.php?payment=$paid&userid=$keyapi&comment=$comment&code=$code");
		
		if(isset($api)) {
			$api = json_decode($api);
			
			if(is_object($api)) {
				if(isset($api->error) && $api->error) {
					return Array('error', $api->error);
				}
				else {    
					if($api->status == 'OK') {
						return Array('success', $api->kwota);
					}
					else {
						return Array('error', "Kod jest bledny lub zostal juz wykorzystany");
					}
				}
			}
			else {
				return Array('error', "Nieoczekiwany blad API");
			}
		}
		else {
			return Array('error', "Brak polaczania z API");
		}
	}