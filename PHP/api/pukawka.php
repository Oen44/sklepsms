<?php
	function Pukawka($keyapi, $code, $value) {
		
		$get = file_get_contents("https://admin.pukawka.pl/api/?keyapi=$keyapi&type=sms&code=$code");
		
		if($get) {
			$get = json_decode($get);
			
			if(is_object($get)) {
				if($get->error) {
					return Array('error', $get->error);
				}
				else {
					$status = $get->status;
					
					if($status=="ok") {
						$kwota = $get->kwota;
						
						return Array('success', $kwota);
					}
					else {
						return Array('error', "Kod jest bledny lub zostal juz wykorzystany.");
					}
				}
			}
			else {
				return Array('error', "Nieznany blad API.");
			}
		}
		else {
			return Array('error', "Blad polaczenia z API.");
		}
	}