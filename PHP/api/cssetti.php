<?php
	function CSSetti($keyapi, $code, $value) {
		
		//if($code == "test1")
		//	return Array('success', $value);
		
		if(!ctype_alnum($code))
			return Array('error', 'Podany kod SMS jest nieprawidlowy.');
		
		$Response = file_get_contents(sprintf('https://cssetti.pl/Api/SmsApiV2CheckCode.php?UserId=%d&Code=%s', $keyapi, $code));
		
		if(is_numeric($Response)) {
			if($Response == 0)
				return Array('error', 'Podany kod SMS jest nieprawidlowy.');
			elseif($Response == -1)
				return Array('error', 'Uzytkownik o podanym ID nie zostal znaleziony.');
			elseif($Response == -2)
				return Array('error', 'Pole UserID lub kod SMS zawiera niedozwolona wartosc.');
			elseif($Response == -3)
				return Array('error', 'Pole UserID lub kod SMS nie zostalo podane');
			if(($Response = floatval($Response)) && $Response > 0)
				return Array('success', $Response);
		}
		
		return Array('error', 'Nieznany blad.');
	}