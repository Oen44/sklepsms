<?php
require ('cssetti.php');
require ('zabijaka.php');
require ('1shot1kill.php');
require ('hostplay.php');
require ('pukawka.php');

class API_Manager {
    private $apis = Array();

    function __construct() {
        $this->apis = Array(
            1 => 'CSSetti',
            'Zabijaka',
            'ShotKill',
            'HostPlay',
            'Pukawka'
        );
    }

    public function checkCode($api_id, $api_key, $sms, $value) {
        $result = call_user_func($this->apis[$api_id], $api_key, $sms, $value);
		return $result;
    }

}