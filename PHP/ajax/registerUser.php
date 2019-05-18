<?php
	define('IS_AJAX', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest');
	$pos = strpos(getenv('HTTP_REFERER'), getenv('HTTP_HOST'));
	if(!$pos && !IS_AJAX) die('Restricted Access');
    require '../include/DB_Functions.php';
    require '../include/Mailer.php';
	
    $db = new DB_Functions();
	$mail = new Mailer();
	
    if($db->registerUser($_POST['username'], $_POST['password'], $_POST['salt'], $_POST['email'], $_POST['code'])) {
        if (!$mail->registerAccount($_POST['email'], $_POST['code'])) {
            echo "Błąd Email: " . $mail->getError();
		} else {
            echo "Konto zarejestrowane!<br>Na podany e-mail wysłano link do aktywacji konta<br><small>Przekierowanie na stronę logowania za 5 sekund...</small>";
		}
	}
    else {
        echo "Bląd podczas rejestracji";
	}
