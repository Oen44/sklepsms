<?php
	
	class DB_Functions {
		private $conn;
		
		function __construct() {
			require_once ('DB_Connect.php');
			
			$db = new DB_Connect();
			$this->conn = $db->connect();
			$this->conn->set_charset('utf8');
		}
		
		public function registerUser($username, $password, $salt, $email, $code) {
			$stmt = $this->conn->prepare("INSERT INTO `members` (`username`, `password`, `pass_hash`, `email`, `act_code`) VALUES (?, ?, ?, ?, ?)");
			
			$hash = md5(md5($password) . md5($salt));
			
			$stmt->bind_param("sssss", $username, $hash, $salt, $email, $code);
			
			if($stmt->execute())
			return true;
			
			return false;
		}
		
		public function getUserData($username, $password) {
			$stmt = $this->conn->prepare("SELECT * FROM `members` WHERE `username` LIKE ? AND `password` LIKE ?");
			
			$stmt->bind_param("ss", $username, $password);
			
			if($stmt->execute()) {
				$user = $stmt->get_result()->fetch_assoc();
				$stmt->close();
				
				$stmt = $this->conn->prepare("SELECT `id` AS `net_id` FROM `networks` WHERE `owner_id` = ? AND `active` = 1");
				
				$stmt->bind_param("d", $user['id']);
				$stmt->execute();
				$net_id = $stmt->get_result()->fetch_assoc();
				if(!$net_id['net_id'])
				$user['net_id'] = 0;
				else
				$user['net_id'] = $net_id['net_id'];
				
				return $user;
			}
			
			return NULL;
		}
		
		public function checkHash($password, $salt) {
			$hash = md5(md5($password) . md5($salt));
			
			return $hash;
		}
		
		public function loginByCookie($cookie) {
			$stmt = $this->conn->prepare("SELECT mem.*, net.`id` AS `net_id` FROM `members` AS mem INNER JOIN `networks` as net WHERE mem.`cookie` LIKE ? AND net.`owner_id` = mem.`id` AND net.`active` = 1");
			
			$stmt->bind_param("s", $cookie);
			
			if($stmt->execute()) {
				$data = $stmt->get_result()->fetch_assoc();
				if(!$data) {
					setcookie("remember", '', time() - 3600, 'sklepsms.pl');
					return null;
				}
				$stmt->close();
				
				if(!$data['active']) {
					setcookie("remember", "", time() - 3600, 'sklepsms.pl');
					echo "<script>alert('Konto nie jest aktywne!')</script>";
					return null;
				}
				
				$stmt = $this->conn->prepare("SELECT `id` AS `net_id` FROM `networks` WHERE `owner_id` = ? AND `active` = 1");
				
				$stmt->bind_param("d", $data['id']);
				$stmt->execute();
				$net_id = $stmt->get_result()->fetch_assoc();
				if(!$net_id['net_id'])
				$data['net_id'] = 0;
				else
				$data['net_id'] = $net_id['net_id'];
				
				return $data;
			}
		}
		
		public function loginByForm($username, $password, $remember) {
			if (!$username or empty($username)) {
				return null;
			}
			
			if (!$password or empty($password)) {
				return null;
			}
			
			$stmt = $this->conn->prepare("SELECT * FROM `members` WHERE `username` LIKE ?");
			
			$stmt->bind_param("s", $username);
			
			if($stmt->execute()) {
				$data = $stmt->get_result()->fetch_assoc();
				if(!$data) {
					return null;
				}
				$stmt->close();
				
				if(!$data['active']) {
					echo "<script>alert('Konto nie jest aktywne!')</script>";
					return null;
				}
				
				$pass_hash = $this->checkHash($password, $data['pass_hash']);
				if($pass_hash == $data['password']) {
					if($remember) {
						$hash = md5($username.$data['password']);
						
						$stmt = $this->conn->prepare("UPDATE `members` SET `cookie` = ? WHERE `username` LIKE ?");
						$stmt->bind_param("ss", $hash, $username);
						$stmt->execute();
						
						setcookie("remember", $hash, time()+60*60*24*30, 'sklepsms.pl');
					}
					else {
						setcookie("remember", "", time() - 3600, 'sklepsms.pl');
					}
					return $data;
				}
			}
			
			return null;
		}
		
		public function activeAccount($code) {
			$stmt = $this->conn->prepare("UPDATE `members` SET `active` = 1 WHERE `act_code` LIKE ?");
			$stmt->bind_param("s", $code);
			$stmt->execute();
			
			if($this->conn->affected_rows > 0)
				return true;
			
			return false;
		}
		
		public function checkLogin($username) {
			$data = array();
			$stmt = $this->conn->prepare("SELECT * FROM `members` WHERE `username` LIKE ?");
			
			$stmt->bind_param("s", $username);
			$stmt->execute();
			$row = $stmt->get_result()->fetch_assoc();
			$stmt->close();
			if(!$row) {
				$data['exist'] = false;
				return json_encode($data);
			}
			
			$data['exist'] = true;
			return json_encode($data);
		}
		
		public function checkEmail($email) {
			$data = array();
			$stmt = $this->conn->prepare("SELECT * FROM `members` WHERE `email` LIKE ?");
			
			$stmt->bind_param("s", $email);
			$stmt->execute();
			$row = $stmt->get_result()->fetch_assoc();
			$stmt->close();
			if(!$row) {
				$data['exist'] = false;
				return json_encode($data);
			}
			
			$data['exist'] = true;
			return json_encode($data);
		}
		
		public function changeEmail($user_id, $email) {
			$stmt = $this->conn->prepare("UPDATE `members` SET `email` = ? WHERE `id` = ?");
			$stmt->bind_param("sd", $email, $user_id);
			$stmt->execute();
			$stmt->close();
		}
		
		public function changePassword($user_id, $password) {
			$stmt = $this->conn->prepare("SELECT * FROM `members` WHERE `id` = ?");
			$stmt->bind_param("d", $user_id);
			$stmt->execute();
			$data = $stmt->get_result()->fetch_assoc();
			$stmt->close();
			
			$salt = $data['pass_hash'];
			$new = md5(md5($password) . md5($salt));
			
			$stmt = $this->conn->prepare("UPDATE `members` SET `password` = ? WHERE `id` = ?");
			$stmt->bind_param("sd", $new, $user_id);
			$stmt->execute();
			$stmt->close();
		}
		
		public function getUserById($id) {
			$stmt = $this->conn->prepare("SELECT * FROM `members` WHERE `id` = ?");
			$stmt->bind_param("d", $id);
			$stmt->execute();
			$user = $stmt->get_result()->fetch_assoc();
			$stmt->close();
			
			return $user;
		}
		
		public function getUserByName($name) {
			$stmt = $this->conn->prepare("SELECT * FROM `members` WHERE `username` LIKE ?");
			$stmt->bind_param("s", $name);
			$stmt->execute();
			$user = $stmt->get_result()->fetch_assoc();
			$stmt->close();
			
			return $user;
		}
		
		public function getEmail($uid) {
			$stmt = $this->conn->prepare("SELECT `email` FROM `members` WHERE `id` = ?");
			
			$stmt->bind_param("d", $uid);
			$stmt->execute();
			$data = $stmt->get_result()->fetch_assoc();
			$stmt->close();
			return $data;
		}
		
		public function printServerInfo($id, $info) {
			$stmt = $this->conn->prepare("SELECT * FROM `servers` WHERE `id` = ?");
			
			$stmt->bind_param("d", $id);
			$stmt->execute();
			$data = $stmt->get_result()->fetch_assoc();
			$stmt->close();
			
			return htmlspecialchars($data[$info]);
		}
		
		public function printServerPage($id) {
			$stmt = $this->conn->prepare("SELECT net.`web_page` FROM `networks` AS net INNER JOIN `servers` as serv WHERE net.`id` = ? AND net.`active` = 1;");
			
			$stmt->bind_param("d", $id);
			$stmt->execute();
			$data = $stmt->get_result()->fetch_assoc();
			$stmt->close();
			
			return htmlspecialchars($data['web_page']);
		}
		
		private function filter(&$value) {
			$value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
		}
		
		public function getServerId($ip, $net_id) {
			$stmt = $this->conn->prepare("SELECT 
											srv.`id`, 
											srv.`name` 
										FROM 
											`servers` AS srv 
											INNER JOIN `networks` AS net
										WHERE 
											srv.`ip_address` = ? 
											AND srv.`net_id` = ? 
											AND net.`license_expire` > CURRENT_TIMESTAMP;");
			
			$stmt->bind_param("sd", $ip, $net_id);
			$stmt->execute();
			$result = $stmt->get_result();
			$stmt->close();
			if($result->num_rows < 1) return null;
			$data = $result->fetch_assoc();
			
			return $data;
		}
		
		public function getServerInfo($user_id, $net_id, $shop_version) {
			$stmt = $this->conn->prepare("SELECT 
											net.`web_page`, 
											serv.* 
										FROM 
											`servers` AS serv 
											INNER JOIN `networks` AS net ON net.`id` = serv.`net_id` 
										WHERE 
											(
												net.`id` = ? 
												OR 1 = ?
											)");
			
			$stmt->bind_param("dd", $net_id, $user_id);
			$stmt->execute();
			$result = $stmt->get_result();
			$data = Array();
			while(($row = $result->fetch_assoc())) {
				if($row['shop_version'] != $shop_version)
				$row['shop_version'] .= " (" . $shop_version . ")";
				$data[$row['id']] = $row;
				
				$stmt2 = $this->conn->prepare("SELECT 
												COUNT(*) AS `solds`, 
												SUM(`income`) AS `total`, 
												(
													SELECT 
														SUM(`income`) AS `monthly`
													FROM 
														`services_bought` AS `sb` 
													WHERE 
														MONTH(`sb`.`date`) = MONTH(
															CURRENT_DATE()
														) 
														AND YEAR(`sb`.`date`) = YEAR(
															CURRENT_DATE()
														) 
														AND `server_id` = ?
												) AS `monthly` 
											FROM 
												`services_bought` 
											WHERE 
												`server_id` = ?;");
														
				$stmt2->bind_param("dd", $row['id'], $row['id']);
				$stmt2->execute();
				$result2 = $stmt2->get_result();
				while(($row2 = $result2->fetch_assoc())) {
					$data[$row['id']]['total'] = $row2['total'] ? $row2['total'] : 0;
					$data[$row['id']]['monthly'] = $row2['monthly'] ? $row2['monthly'] : 0;
					$data[$row['id']]['solds'] = $row2['solds'] ? $row2['solds'] : 0;
				}
				
				$stmt2->close();
			
			}
			
			$stmt->close();
			
			
			
			return $data;
		}
		
		public function getServerStats($id) {
			$stmt = $this->conn->prepare("SELECT 
											MONTH(`date`) AS `month`, 
											SUM(`income`) AS `income`
										FROM 
											`services_bought` 
										WHERE
											`server_id` = ?
										GROUP BY 
											YEAR(`date`), 
											MONTH(`date`);");
			
			$stmt->bind_param("d", $id);
			$stmt->execute();
			$result = $stmt->get_result();
			$stmt->close();
			
			$data = [];
			$data[] = [];
			while($row = $result->fetch_assoc()) {
				$data[0][$row['month']] = $row;
			}
			
			$stmt = $this->conn->prepare("SELECT 
											`serv`.`service_title` AS `service`, 
											COUNT(*) AS `solds` 
										FROM 
											`services_bought` AS `sb` 
										INNER JOIN
											`services` AS `serv`
										ON
											`serv`.`service_id` = `sb`.`service_id` 
										WHERE 
											`sb`.`server_id` = ?
										GROUP BY 
											`serv`.`service_title`;");
			
			$stmt->bind_param("d", $id);
			$stmt->execute();
			$result = $stmt->get_result();
			$stmt->close();
			
			while($row = $result->fetch_assoc()) {
				$data[1][] = $row;
			}
			
			return $data;
		}		
		
		public function serverSettings($id, $name, $ip) {
			$stmt = $this->conn->prepare("UPDATE `servers` SET `name` = ?, `ip_address` = ? WHERE `id` = ?");
			$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
			$stmt->bind_param("ssd", $name, $ip, $id);
			$stmt->execute();
			$stmt->close();
		}
		
		public function getNetworkServices($net_id, $user_id) {
			$stmt = $this->conn->prepare("SELECT 
											src.* 
										FROM 
											`network_services` AS ss 
											INNER JOIN `services` AS src ON src.`service_id` = ss.`service_id` 
											INNER JOIN `networks` AS net ON ss.`network_id` = net.`id` 
											AND net.`id` = ? 
											OR 1 = ? 
										GROUP BY 
											src.`service_id`");
			
			$stmt->bind_param("dd", $net_id, $user_id);
			$stmt->execute();
			$result = $stmt->get_result();
			$output = array();
			
			while($data = $result->fetch_assoc()){
				$output[] = $data;
			}
			
			$stmt->close();
			
			return $output;
		}
		
		public function getServices($id) {
			$stmt = $this->conn->prepare("SELECT src.*, ss.`server_id`, ss.`id` AS `ss_id` FROM `server_services` AS ss INNER JOIN `services` AS src ON src.`service_id` = ss.`service_id` INNER JOIN `servers` AS serv ON ss.`server_id` = serv.`id` AND serv.`id` = ?");
			
			$stmt->bind_param("d", $id);
			$stmt->execute();
			$result = $stmt->get_result();
			$output = array();
			
			while($data = $result->fetch_assoc()){
				$output[] = $data;
			}
			
			$stmt->close();
			
			return $output;
		}
		
		public function getNetworkService($id) {
			$stmt = $this->conn->prepare("SELECT * FROM `services` WHERE `id` = ?");
			$stmt->bind_param("d", $id);
			$stmt->execute();
			$result = $stmt->get_result()->fetch_assoc();
			$stmt->close();
			
			return $result;
		}
		
		public function getServiceData($service, $server) {
			$stmt = $this->conn->prepare("SELECT 
                                        `s`.`service_title`, 
                                        `s`.`service_description`, 
                                        `s`.`service_suffix`, 
                                        `s`.`service_type`, 
                                        `ss`.`prices`, 
                                        `ss`.`flags`, 
                                        `ss`.`weapon_id`, 
										`na`.`api_key`,
                                        `na`.`api_id` AS `api` 
                                    FROM 
                                        `services` AS `s` 
                                        INNER JOIN `server_services` AS `ss` ON `ss`.`service_id` = `s`.`service_id`
										INNER JOIN `network_apis` AS `na` ON `ss`.`api` = `na`.`id` 										
                                    WHERE 
                                        `ss`.`server_id` = ? AND `s`.`service_id` = ?");
			$stmt->bind_param("ds", $server, $service);
			$stmt->execute();
			$result = $stmt->get_result()->fetch_assoc();
			$stmt->close();
			
			return $result;
		}
		
		public function getService($id) {
			$stmt = $this->conn->prepare("SELECT * FROM `server_services` WHERE `id` = ?");
			$stmt->bind_param("d", $id);
			$stmt->execute();
			$result = $stmt->get_result()->fetch_assoc();
			$stmt->close();
			
			return $result;
		}
		
		public function deleteNetworkService($id) {
			$stmt = $this->conn->prepare("DELETE FROM `services` WHERE `id` = ?");
			
			$stmt->bind_param("d", $id);
			$stmt->execute();
			$stmt->close();
		}
		
		public function deleteService($id) {
			$stmt = $this->conn->prepare("DELETE FROM `server_services` WHERE `id` = ?");
			
			$stmt->bind_param("d", $id);
			$stmt->execute();
			$stmt->close();
		}
		
		public function addService($net_id, $s_id, $s_title, $s_desc, $s_suffix, $s_type) {
			$stmt = $this->conn->prepare("INSERT INTO `services` (`service_id`, `service_title`, `service_description`, `service_suffix`, `service_type`) VALUES (?, ?, ?, ?, ?)");
			$s_title = htmlspecialchars($s_title, ENT_QUOTES, 'UTF-8');
			$s_desc = htmlspecialchars($s_desc, ENT_QUOTES, 'UTF-8');
			$s_suffix = htmlspecialchars($s_suffix, ENT_QUOTES, 'UTF-8');
			$stmt->bind_param("ssssd", $s_id, $s_title, $s_desc, $s_suffix, $s_type);
			if($stmt->execute()) {
				$stmt->close();
				
				$stmt = $this->conn->prepare("INSERT INTO `network_services` (`network_id`, `service_id`) VALUES (?, ?)");
				$stmt->bind_param("ds", $net_id, $s_id);
				$stmt->execute();
				$stmt->close();
			}
		}
		
		public function editService($id, $s_id, $s_title, $s_desc, $s_suffix, $s_type) {
			$stmt = $this->conn->prepare("UPDATE `services` SET `service_id` = ?, `service_title` = ?, `service_description` = ?, `service_suffix` = ?, `service_type` = ? WHERE `id` = ?");
			$s_title = htmlspecialchars($s_title, ENT_QUOTES, 'UTF-8');
			$s_desc = htmlspecialchars($s_desc, ENT_QUOTES, 'UTF-8');
			$s_suffix = htmlspecialchars($s_suffix, ENT_QUOTES, 'UTF-8');
			$stmt->bind_param("ssssdd", $s_id, $s_title, $s_desc, $s_suffix, $s_type, $id);
			$stmt->execute();
			$stmt->close();
		}
		
		public function addServerService($server_id, $service_id, $prices, $prices_json, $flags, $weapon_id, $service_api) {
			$stmt = $this->conn->prepare("INSERT INTO `server_services` (`service_id`, `server_id`, `prices`, `prices_json`, `flags`, `weapon_id`, `api`) VALUES (?, ?, ?, ?, ?, ?, ?)");
			$stmt->bind_param("sdsssdd", $service_id, $server_id, $prices, $prices_json, $flags, $weapon_id, $service_api);
			$stmt->execute();
			$stmt->close();
		}
		
		public function editServerService($id, $service_id, $prices, $prices_json, $flags, $weapon_id, $service_api) {
			$stmt = $this->conn->prepare("UPDATE `server_services` SET `service_id` = ?, `prices` = ?, `prices_json` = ?, `flags` = ?, `weapon_id` = ?, `api` = ? WHERE `id` = ?");
			$stmt->bind_param("ssssddd", $service_id, $prices, $prices_json, $flags, $weapon_id, $service_api, $id);
			$stmt->execute();
			$stmt->close();
		}
		
		public function getNotifications($uid) {
			$stmt = $this->conn->prepare("SELECT * FROM `notifis` WHERE `id` NOT IN (SELECT `not_id` FROM `notifis_read` WHERE `user_id` = ?)");
			
			$stmt->bind_param("d", $uid);
			$stmt->execute();
			$result = $stmt->get_result();
			$output = array();
			
			while($data = $result->fetch_assoc()){
				$output[] = $data;
			}
			
			$stmt->close();
			
			return $output;
		}
		
		public function setNotifiRead($not_id, $user_id) {
			$stmt = $this->conn->prepare("INSERT INTO `notifis_read` (`not_id`, `user_id`) VALUES (?, ?)");
			
			$stmt->bind_param("dd", $not_id, $user_id);
			$stmt->execute();
			$stmt->close();
		}
		
		public function sendNotification($title, $desc) {
			$stmt = $this->conn->prepare("INSERT INTO `notifis` (`title`, `desc`) VALUES (?, ?)");
			
			$stmt->bind_param("ss", $title, $desc);
			$stmt->execute();
			$stmt->close();
		}
		
		public function checkPartner($uid) {
			$stmt = $this->conn->prepare("SELECT * FROM `networks` WHERE `active` = 1");
			
			$stmt->execute();
			$result = $stmt->get_result();
			$output = null;
			
			while($data = $result->fetch_assoc()){
				$owner = $this->getUserById($data['owner_id']);
				$owner = $owner['username'];
				if($uid == $data['owner_id']) {
					$output = Array(
					"net_id" => $data['id'],
					"web_page" => $data['web_page'],
					"date" => $data['date'],
					"expire" => $data['license_expire'],
					"update" => $data['license_update'],
					"owner_id" => $data['owner_id'],
					"owner" => $owner,
					"trial" => $data['trial'],
					"balance" => $data['balance']
					);
					break;
				}
				else if($data['partners'] != null) {
					$output = unserialize($data['partners']);
					if(in_array($uid, $output)) {
						$output = Array(
						"net_id" => $data['id'],
						"web_page" => $data['web_page'],
						"date" => $data['date'],
						"expire" => $data['license_expire'],
						"update" => $data['license_update'],
						"owner_id" => $data['owner_id'],
						"owner" => $owner,
						"trial" => $data['trial']
						);
						break;
					}
				}
			}
			
			$stmt->close();
			
			return $output;
		}
		
		public function getPartners($net_id) {
			$stmt = $this->conn->prepare("SELECT * FROM `networks` WHERE `id` = ? AND `active` = 1");
			
			$stmt->bind_param("d", $net_id);
			$stmt->execute();
			$result = $stmt->get_result()->fetch_assoc();
			$stmt->close();
			
			return Array($result['partners'], $result['owner_id']);
		}
		
		public function checkLicense($net_id) {
			$stmt = $this->conn->prepare("SELECT * FROM `networks` WHERE `id` = ? AND `active` = 1");
			$stmt->bind_param("d", $net_id);
			$stmt->execute();
			$data = $stmt->get_result()->fetch_assoc();
			$stmt->close();
			$data = $data['license_expire'];
			if(!$data || time() > strtotime($data))
			return false;
			
			return $data;
		}
		
		public function activeLicense($net_id, $days) {
			if($this->checkLicense($net_id)) {
				$stmt = $this->conn->prepare("UPDATE `networks` SET `license_update` = FROM_UNIXTIME(?), `license_expire` = TIMESTAMPADD(DAY, ?, `license_expire`) WHERE `id` = ?");
			}
			else {
				$stmt = $this->conn->prepare("UPDATE `networks` SET `license_update` = FROM_UNIXTIME(?), `license_expire` = FROM_UNIXTIME(?) WHERE `id` = ?");
				$days = time() + $days*24*60*60;
			}
			$update = time();
			$stmt->bind_param("ssd", $update, $days, $net_id);
			$stmt->execute();
			$stmt->close();
		}
		
		public function activeTrial($net_id) {
			if($this->checkLicense($net_id)) {
				$stmt = $this->conn->prepare("UPDATE `networks` SET `trial` = 1, `license_update` = FROM_UNIXTIME(?), `license_expire` = TIMESTAMPADD(DAY, ?, `license_expire`) WHERE `id` = ? AND `trial` = 0");
				$days = 3;
			}
			else {
				$stmt = $this->conn->prepare("UPDATE `networks` SET `trial` = 1, `license_update` = FROM_UNIXTIME(?), `license_expire` = FROM_UNIXTIME(?) WHERE `id` = ? AND `trial` = 0");
				$days = time() + 3*24*60*60;
			}
			$update = time();
			$stmt->bind_param("ssd", $update, $days, $net_id);
			$stmt->execute();
			$stmt->close();
		}
		
		public function addNetwork($user_id, $web_page) {
			$stmt = $this->conn->prepare("INSERT INTO `networks` (`owner_id`, `web_page`, `date`) VALUES (?, ?, FROM_UNIXTIME(?))");
			
			$stmt->bind_param("dss", $user_id, $web_page, time());
			$stmt->execute();
			$stmt->close();
		}
		
		public function leaveNetwork($net_id, $partners) {
			$stmt = $this->conn->prepare("UPDATE `networks` SET `partners` = ? WHERE `id` = ?");
			
			$stmt->bind_param("sd", $partners, $net_id);
			$stmt->execute();
			$stmt->close();
		}
		
		public function deleteNetwork($net_id) {
			$stmt = $this->conn->prepare("UPDATE `networks` SET `active` = 0 WHERE `id` = ?");
			$stmt->bind_param("d", $net_id);
			$stmt->execute();
			$stmt->close();
		}
		
		public function addApiAccount($net_id, $api_id, $api_key, $api_title) {
			$stmt = $this->conn->prepare("INSERT INTO `network_apis` (`api_id`, `net_id`, `title`, `api_key`) VALUES (?, ?, ?, ?)");
			
			$stmt->bind_param("ddss", $api_id, $net_id, $api_title, $api_key);
			$stmt->execute();
			$stmt->close();
		}
		
		public function editApiAccount($id, $api_id, $api_key, $api_title) {
			$stmt = $this->conn->prepare("UPDATE `network_apis` SET `api_id` = ?, `title` = ?, `api_key` = ? WHERE `id` = ?");
			
			$stmt->bind_param("dssd", $api_id, $api_title, $api_key, $id);
			$stmt->execute();
			$stmt->close();
		}
		
		public function deleteApiAccount($id) {
			$stmt = $this->conn->prepare("DELETE FROM `network_apis` WHERE `id` = ?");
			
			$stmt->bind_param("d", $id);
			$stmt->execute();
			$stmt->close();
		}
		
		public function getNetworkApis($net_id) {
			$stmt = $this->conn->prepare("SELECT * FROM `apis` ORDER BY `id` ASC");
			$stmt->execute();
			$apis = $stmt->get_result();
			$stmt->close();
			
			$json = Array();
			while($api = $apis->fetch_assoc()) {
				$stmt = $this->conn->prepare("SELECT * FROM `network_apis` WHERE (`net_id` = ? OR ?=1) AND `api_id` = ?");
				$stmt->bind_param("ddd", $net_id, $net_id, $api['id']);
				$stmt->execute();
				$data = $stmt->get_result();
				$temp = Array();
				while($row = $data->fetch_assoc()) {
					$temp[] = $row;
				}
				$json[] = Array("id" => $api['id'], "name" => $api['name'], "accounts" => $temp);
			}
			$stmt->close();
			
			return $json;
		}
		
		public function getAPI($api_key) {
			$stmt = $this->conn->prepare("SELECT `api_id` FROM `network_apis` WHERE `api_key` = ?");
			$stmt->bind_param("s", $api_key);
			$stmt->execute();
			$data = $stmt->get_result()->fetch_assoc();
			$stmt->close();
			
			return $data['api_id'];
		}
		
		public function addPartner($net_id, $partner) {
			
			$partners = $this->getPartners($net_id);
			$partners = $partners[0];
			if($partners)
			$partners = unserialize($partners);
			else
			$partners = Array();
			
			$user = $this->getUserByName($partner);
			
			if($user) {
				$user = $user['id'];
				
				if(in_array($user, $partners)) return;
				
				array_push($partners, $user);
				
				$partners = serialize($partners);
				
				$stmt = $this->conn->prepare("UPDATE `networks` SET `partners` = ? WHERE `id` = ?");
				
				$stmt->bind_param("sd", $partners, $net_id);
				$stmt->execute();
				$stmt->close();
			}
		}
		
		public function addServer($net_id, $name, $ip_address) {
			$stmt = $this->conn->prepare("INSERT INTO `servers` (`net_id`, `name`, `ip_address`) VALUES (?, ?, ?)");
			
			$stmt->bind_param("dss", $net_id, $name, $ip_address);
			if(!$stmt->execute())
				$data = $this->conn->errno;
			else
				$data = null;
			$stmt->close();
			return $data;
		}
		
		public function deleteServer($id) {
			$stmt = $this->conn->prepare("DELETE FROM `servers` WHERE `id` = ?;");
			
			$stmt->bind_param("d", $id);
			$stmt->execute();
			$stmt->close();
		}
		
		public function addReport($user_id, $title, $description) {
			$stmt = $this->conn->prepare("INSERT INTO `reports` (`user_id`, `title`) VALUES (?, ?)");
			
			$stmt->bind_param("ds", $user_id, $title);
			$stmt->execute();
			$rep_id = $stmt->insert_id;
			$stmt->close();
			
			$stmt = $this->conn->prepare("INSERT INTO `reports_answers` (`rep_id`, `user_id`, `content`) VALUES (?, ?, ?)");
			
			$stmt->bind_param("dds", $rep_id, $user_id, $description);
			$stmt->execute();
			$stmt->close();
			
			return $rep_id;
		}
		
		public function addAnswer($user_id, $rep_id, $description) {
			$stmt = $this->conn->prepare("INSERT INTO `reports_answers` (`rep_id`, `user_id`, `content`) VALUES (?, ?, ?)");
			
			$stmt->bind_param("dds", $rep_id, $user_id, $description);
			$stmt->execute();
			$stmt->close();
		}
		
		public function countAnswers($rep) {
			$stmt = $this->conn->prepare("SELECT COUNT(*) AS `count` FROM `reports_answers` WHERE `rep_id` = ?;");
			
			$stmt->bind_param("d", $rep);
			$stmt->execute();
			$result = $stmt->get_result()->fetch_assoc();
			//$stmt->close();
			
			return $result['count'];
		}
		
		public function getReportAnswers($rep) {
			$stmt = $this->conn->prepare("SELECT ans.*, mem.`username` FROM `reports_answers` AS ans INNER JOIN `members` AS mem WHERE `rep_id` = ? AND ans.`user_id` = mem.`id`;");
			
			$stmt->bind_param("d", $rep);
			$stmt->execute();
			$result = $stmt->get_result();
			//$stmt->close();
			
			return $result;
		}
		
		public function getAccountReports($user_id) {
			if($user_id == 1)
			$stmt = $this->conn->prepare("SELECT 
											`id`, 
											`title`, 
											`date`, 
											`status`, 
											(
												SELECT 
													`email` 
												FROM 
													`members` 
												WHERE 
													`id` = `reports`.`user_id`
											) AS `email` 
										FROM 
											`reports`;");
			else {
				$stmt = $this->conn->prepare("SELECT 
												`id`, 
												`title`, 
												`date`, 
												`status`, 
												(
													SELECT 
														`email` 
													FROM 
														`members` 
													WHERE 
														`id` = ?
												) AS `email` 
											FROM 
												`reports` 
											WHERE 
												`user_id` = ?;");
				$stmt->bind_param("ds", $user_id, $user_id);
			}
			$stmt->execute();
			$result = $stmt->get_result();
			$stmt->close();
			$data = Array();
			while(($row = $result->fetch_assoc())) {
				$row['count'] = $this->countAnswers($row['id']);
				$answers = $this->getReportAnswers($row['id']);
				while($answer = $answers->fetch_assoc()) {
					$row['answers'][] = $answer;
				}
				$data[$row['id']] = $row;
			}
			
			return $data;
		}
		
		public function openAnswer($rep_id) {
			$stmt = $this->conn->prepare("UPDATE `reports` SET `status` = 'Otwarty' WHERE `id` = ?");
			
			$stmt->bind_param("d", $rep_id);
			$stmt->execute();
			$stmt->close();
		}
		
		public function closeAnswer($rep_id) {
			$stmt = $this->conn->prepare("UPDATE `reports` SET `status` = 'Zamknięty' WHERE `id` = ?");
			
			$stmt->bind_param("d", $rep_id);
			$stmt->execute();
			$stmt->close();
		}
		
		public function getUpdates() {
			$stmt = $this->conn->prepare("SELECT * FROM `updates` ORDER BY `date` DESC;");
			
			$stmt->execute();
			$result = $stmt->get_result();
			$stmt->close();
			
			$data = [];
			
			while($row = $result->fetch_assoc()) {
				$data[] = $row;
			}
			
			return $data;
		}
		
		public function getIncome($id) {
			$stmt = $this->conn->prepare("SELECT 
											`sb`.*, 
											`serv`.`service_title` 
										FROM 
											`services_bought` AS `sb` 
											INNER JOIN `services` AS `serv` ON `sb`.`service_id` = `serv`.`service_id` 
											AND `sb`.`server_id` = ? 
										ORDER BY 
											`sb`.`date` DESC;");
			
			$stmt->bind_param("d", $id);
			$stmt->execute();
			$result = $stmt->get_result();
			$stmt->close();
			
			$data = [];
			
			while($row = $result->fetch_assoc()) {
				$data[] = $row;
			}
			
			return $data;
		}
		
		public function getServiceIndexes() {
			$stmt = $this->conn->prepare("SELECT `service_id` FROM `services`;");
			
			$stmt->execute();
			$result = $stmt->get_result();
			$stmt->close();
			
			$data = [];
			
			while($row = $result->fetch_assoc()) {
				$data[] = $row['service_id'];
			}
			
			return $data;
		}
		
		public function getNetworksNames() {
			$stmt = $this->conn->prepare("SELECT `web_page` FROM `networks`;");
			
			$stmt->execute();
			$result = $stmt->get_result();
			$stmt->close();
			
			$data = [];
			
			while($row = $result->fetch_assoc()) {
				$data[] = strtolower($row['web_page']);
			}
			
			return $data;
		}
		
		public function logToDatabase($user_id, $log) {
			$stmt = $this->conn->prepare("INSERT INTO `logs` (`user_id`, `log`, `date`) VALUES (?, ?, FROM_UNIXTIME(?))");
			
			$stmt->bind_param("dss", $user_id, $log, time());
			$stmt->execute();
			$stmt->close();
		}
		
		public function addFlags($server_id, $authtype, $authdata, $password, $service_flags, $days) {
			$stmt = $this->conn->prepare("SELECT * FROM `players_flags` WHERE `auth_data` = ? AND `type` = ? AND `server` = ?");
			
			$stmt->bind_param("sdd", $authdata, $authtype, $server_id);
			$stmt->execute();
			$result = $stmt->get_result();
			$stmt->close();
			
			if($authtype == 1) $password = md5($password);
			
			$tempFlags = str_split($service_flags);
			
			for($i = 97; $i <= 122; $i++) {
				$flags[$i] = 0;
			}
					
			for($i = 0; $i < count($tempFlags); $i++) {
				$asci = ord($tempFlags[$i]);
				
				$flags[$asci] = $tempFlags[$i];
			}
			
			$time = time();
				
			if($result->num_rows > 0) {
				$data = $result->fetch_assoc();
				for($i = 97; $i <= 122; $i++) {
					$char = chr($i);
					
					if(!$flags[$i] || $flags[$i] != $char) continue;
					
					$flag_time = $data[$char];
					if($flag_time > $time) {
						$flag_time += $days * 24 * 60 * 60;
						$query = "UPDATE `players_flags` SET `{$flags[$i]}` = ? WHERE `id` = ?";
						$stmt = $this->conn->prepare($query);
			
						$stmt->bind_param("dd", $flag_time, $data['id']);
						$stmt->execute();
						$stmt->close();
					}
					else {
						$flag_time = $time + ($days * 24 * 60 * 60);
						$query = "UPDATE `players_flags` SET `{$flags[$i]}` = ? WHERE `id` = ?";
						$stmt = $this->conn->prepare($query);
			
						$stmt->bind_param("dd", $flag_time, $data['id']);
						$stmt->execute();
						$stmt->close();
					}
				}
			}
			else {
				$query = "INSERT INTO `players_flags` VALUES (null, ?, ?, ?, ?";
				for($i = 97; $i <= 122; $i++) {
					$char = chr($i);
					
					if(!$flags[$i] || $flags[$i] != $char)
						$flag_time = 0;
					else
						$flag_time = $time + ($days * 24 * 60 * 60);
					
					$query .= ", $flag_time";
				}
				$query .= ");";
				$stmt = $this->conn->prepare($query);
			
				$stmt->bind_param("ddss", $server_id, $authtype, $authdata, $password);
				$stmt->execute();
				$stmt->close();
			}
		}
		
		public function insertIncome($server_id, $service_id, $player, $sms_code, $amount, $cost, $income) {
			$stmt = $this->conn->prepare("INSERT INTO `services_bought` VALUES (null, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?)");
			
			$stmt->bind_param("dsssddd", $server_id, $service_id, $player, $sms_code, $amount, $cost, $income);
			$stmt->execute();
			$stmt->close();
		}
		
		public function getEmails() {
			$stmt = $this->conn->prepare("SELECT `email` FROM `members`;");
			
			$stmt->execute();
			$result = $stmt->get_result();
			$stmt->close();
			
			$data = [];
			
			while($row = $result->fetch_assoc()) {
				$data[] = $row['email'];
			}
			
			return $data;
		}
		
		public function footerData() {
			$stmt = $this->conn->prepare("SELECT 
											COUNT(`n`.`id`) AS `networks`, 
											(
												SELECT 
													COUNT(`s`.`id`) 
												FROM 
													`servers` AS `s`
											) AS `servers`, 
											(
												SELECT 
													COUNT(`s`.`id`) 
												FROM 
													`services` AS `s`
											) AS `services`, 
											(
												SELECT 
													COUNT(`sb`.`id`) 
												FROM 
													`services_bought` AS `sb`
											) AS `buy`, 
											(
												SELECT 
													SUM(`income`) AS `income` 
												FROM 
													`services_bought`
											) AS `income` 
										FROM 
											`networks` AS `n` 
										WHERE 
											`n`.`active` = 1");
				
			$stmt->execute();
			$data = $stmt->get_result()->fetch_assoc();
			$stmt->close();
			
			return $data;
		}
		
	}
?>