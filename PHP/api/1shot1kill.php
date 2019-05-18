<?php
	function ShotKill($keyapi, $code, $value) {
		
		$_apiAnswer = file_get_contents("https://www.1shot1kill.pl/api?type=sms&key=" . $keyapi . "&sms_code=" . $code . "&comment=SklepSMS");
		$answer = json_decode($_apiAnswer);
		
		if($answer->status == "fail"){
			return Array('error', $answer->desc);
		}
		else if($answer->status == "error"){
			return Array('error', $answer->desc);
		}
		else if ($answer->status == "ok") {
			return Array('success', $answer->amount);
		}
	}