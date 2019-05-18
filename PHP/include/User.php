<?php

class User
{
    private $conn;

    private $id;
    private $username;
    private $password;

    function __construct($i = null, $u = null, $p = null) {
        require_once('DB_Connect.php');
        $db = new DB_Connect();
        $this->conn = $db->connect();

        $this->id = $i;
        $this->username = $u;
        $this->password = $p;
    }

    public function isLogged() {
        if(empty($_SESSION['username']) || empty($_SESSION['password']))
            return false;

        return true;
    }

    public function getId() {
        return $this->id;
    }

    public function getUsername() {
        return $this->username;
    }

    public function getPassword() {
        return $this->password;
    }

}
