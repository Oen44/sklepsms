<?php
	
	class Mailer {
		
		private $mailer;
		
		function __construct() {
			require_once '../PHPMailer/PHPMailerAutoload.php';
			$this->mailer = new PHPMailer;
		}
		
		public function newReportMail($report_id, $email, $title, $content, $date) {
			$this->mailer->setFrom('lach@sklepsms.pl', 'Arkadiusz Lach');
			$this->mailer->addReplyTo('lach@sklepsms.pl', 'Arkadiusz Lach');
			$this->mailer->addAddress($email);
			$this->mailer->addAddress('lach@sklepsms.pl');
			$this->mailer->Subject = 'SklepSMS - Utworzono nowy raport #' . $report_id;
			$text = str_replace("%report_id%", $report_id, file_get_contents(__DIR__ . '/ReportMail.html'));
			$text = str_replace("%report_status%", "<font color='green'>Otwarty</font>", $text);
			$text = str_replace("%report_title%", $title, $text);
			$content = str_replace("\n", "<br/>", $content);
			$text = str_replace("%report_content%", $content, $text);
			$text = str_replace("%report_date%", $date, $text);
			$this->mailer->msgHTML($text);
			$this->mailer->CharSet = 'UTF-8';
			
			return $this->mailer->send();
		}
		
		public function newAnswerMail($report_id, $email, $title, $content, $date) {
			$this->mailer->setFrom('lach@sklepsms.pl', 'Arkadiusz Lach');
			$this->mailer->addReplyTo('lach@sklepsms.pl', 'Arkadiusz Lach');
			$this->mailer->addAddress($email);
			$this->mailer->addAddress('lach@sklepsms.pl');
			$this->mailer->Subject = 'SklepSMS - Nowa odpowiedź do raportu #' . $report_id;
			$text = str_replace("%report_id%", $report_id, file_get_contents(__DIR__ . '/AnswerMail.html'));
			$text = str_replace("%report_status%", "<font color='green'>Otwarty</font>", $text);
			$text = str_replace("%report_title%", $title, $text);
			$content = str_replace("\n", "<br/>", $content);
			$text = str_replace("%report_content%", $content, $text);
			$text = str_replace("%report_date%", $date, $text);
			$text = str_replace("%report_sign%", "Arkadiusz Lach,<br/>Właściciel SklepSMS.pl", $text);
			$this->mailer->msgHTML($text);
			$this->mailer->CharSet = 'UTF-8';
			
			return $this->mailer->send();
		}
		
		public function registerAccount($email, $code) {
			$this->mailer->setFrom('lach@sklepsms.pl', 'Arkadiusz Lach');
			$this->mailer->addReplyTo('lach@sklepsms.pl', 'Arkadiusz Lach');
			$this->mailer->addAddress($email);
			$this->mailer->Subject = 'SklepSMS - Rejestracja Konta';
			$text = str_replace("%code%", $code, file_get_contents(__DIR__ . '/RegisterMail.html'));
			$this->mailer->msgHTML($text);
			$this->mailer->CharSet = 'UTF-8';
			
			return $this->mailer->send();
		}
		
		public function openShop($email) {
			$this->mailer->setFrom('lach@sklepsms.pl', 'Arkadiusz Lach');
			$this->mailer->addReplyTo('lach@sklepsms.pl', 'Arkadiusz Lach');
			$this->mailer->addAddress($email);
			$this->mailer->Subject = 'SklepSMS - Oficjalnie otwarty';
			$text = file_get_contents(__DIR__ . '/SklepSMS-Open.html');
			$this->mailer->msgHTML($text);
			$this->mailer->CharSet = 'UTF-8';
			
			return $this->mailer->send();
		}
		
		public function getError() {
			return $this->mailer->ErrorInfo;
		}
		
	}
