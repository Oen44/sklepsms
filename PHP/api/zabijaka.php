<?php
	function Zabijaka($keyapi, $code, $value) {
		
		$_apiAnswer = file_get_contents("http://api.zabijaka.pl/1.1/".$keyapi."/sms/".$value."/".$code."/sms.json/add");
		$answer = json_decode($_apiAnswer);
		
		if($answer->error){
			return Array('error', $answer->txt);
		}
		else if ($answer->success) {;
			return Array('success', $answer->amount);
		}
	}