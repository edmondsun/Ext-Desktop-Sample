#!/www/cgi-bin/php
<?
header('Content-Type: application/json; charset=utf-8');
header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );
header('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT');
// HTTP/1.1
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', false);
// HTTP/1.0
header('Pragma: no-cache');

require_once '/www/lib/service_lib.php';
require_once '/www/lib/globals.php';
require_once '/www/lib/rms.php';
require_once '/www/lib/config.php';

if (isset($_SERVER['REQUEST_METHOD']) && ($_SERVER['REQUEST_METHOD'] == 'POST')) {

	$errcode = 0;

	if (isset($_POST["auto_shutdown_status"])) {

		$auto_shutdown_status = $_POST['auto_shutdown_status'];
		cfg_set_auto_shutdown($auto_shutdown_status);

		if (is_sw_with("WITH_HAC") && check_dual()) {
			ipc_sync_cfg(SYNC_CFG_HW_SHUT_OFF);
		}
	}

	if (!is_sw_enable("CONFIG_DISABLE_QCENTRAL")) {

		if (isset($_POST['qcentral_status'])) {

			$qcentral_status = $_POST["qcentral_status"];
			if ($qcentral_status == 1) {

				qcentral_port_start();
			} else {

				qcentral_port_stop();
			}
		}

	}

	if (isset($_POST["idle_timeout_setting"]) || isset($_POST["login_lock"])) {

		$system_ini = parse_ini_file("/wetc/system.conf");

		if (isset($_POST["idle_timeout_setting"]) || isset($_POST["idle_timeout"])) {

			$idle_timeout_setting = $_POST["idle_timeout_setting"];
			if (strcmp($idle_timeout_setting, "on") == 0) {

				$idle_timeout = $_POST['idle_timeout'];
			} else {

				$idle_timeout = 0;
			}

			$system_ini["idle_timeout"] = $idle_timeout;
		}

		if (isset($_POST["login_lock"])) {

			$login_lock = $_POST['login_lock'];
			$system_ini["login_lock"] = $login_lock;
		}

		write_ini_file("/wetc/system.conf", $system_ini);

		if (isset($_POST["login_lock"]) && $system_ini["login_lock"] == "enable") {

			$SessionID_arr = explode("\n", trim(shell_exec("ls " . session_save_path())));
			foreach ($SessionID_arr as &$value) {
				if ($value != "sess_" . session_id()) {

					exec("rm -f " . session_save_path() . "/" . $value);
				}
			}
		}
	}

	if (isset($_POST['lighttpd_option'])) {

		$lighttpd_option = $_POST["lighttpd_option"];

		$port_ini = net_port_assignment_get_conf();

		if (isset($_POST["http_port"])) {

			$http_port = $_POST["http_port"];
		} else {

			$http_port = $port_ini["http"];
		}

		if (isset($_POST["https_port"])) {

			$https_port = $_POST["https_port"];
		} else {

			$https_port = $port_ini["https"];
		}

		if (service_port_check_avail($http_port, "http") == false || service_port_check_avail($https_port, "https") == false) {
			$setting_appliy_str = xlt('port_used');
			$errcode = -1;
		} else {
			lighttpd_set_port($lighttpd_option, $http_port, $https_port);
			$setting_appliy_str = xlt('info_change_ok');
		}

	}

	$result_arr = array();
	$result_arr["success"] = $errcode == 0 ? true : false;
	$result_arr["msg"] = $setting_appliy_str;
	echo json_encode($result_arr);
} else {

	$qcentral_status = (qcentral_port_get_status() == RUNNING) ? 1 : 0;

	$system_ini = (file_exists("/wetc/system.conf")) ? parse_ini_file("/wetc/system.conf") : array();
	$idle_timeout = (isset($system_ini["idle_timeout"])) ? $system_ini["idle_timeout"] : 0;
	if ($idle_timeout == 0) {

		$idle_timeout_setting = "off";
		$idle_timeout = 300;
	} else {
		$idle_timeout_setting = "on";
	}
	$login_lock = (isset($system_ini["login_lock"])) ? $system_ini["login_lock"] : 0;

	$port_ini = net_port_assignment_get_conf();
	$http_port = $port_ini["http"];
	$https_port = $port_ini["https"];
	$lighttpd_option = isset($system_ini["lighttpd_option"]) ? $system_ini["lighttpd_option"] : LIGHTTPD_OPEN_BOTH;

	$management_setting_arr = array();
	$management_setting_arr["qcentral_status"] = $qcentral_status;
	$management_setting_arr["idle_timeout_setting"] = $idle_timeout_setting;
	$management_setting_arr["idle_timeout"] = $idle_timeout;
	$management_setting_arr["login_lock"] = $login_lock;
	$management_setting_arr["http_port"] = $http_port;
	$management_setting_arr["https_port"] = $https_port;
	$management_setting_arr["lighttpd_option"] = $lighttpd_option;

	echo json_encode(array("success" => true, "data" => $management_setting_arr), JSON_NUMERIC_CHECK);
}
?>