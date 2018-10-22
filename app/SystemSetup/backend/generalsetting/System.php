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

require_once('/www/lib/service_lib.php');
require_once('/www/lib/globals.php');
require_once('/www/lib/rms.php');
require_once('/www/lib/config.php');

if (isset($_SERVER['REQUEST_METHOD']) && ($_SERVER['REQUEST_METHOD'] == 'POST')) {

	if (isset($_POST["op"])) {
		switch($_POST["op"]) {
			case 'chg_pwd':
				if (isset($_POST["new_password"])) {

					$new_password = trim($_POST["new_password"]);
					set_system_user_passwd('admin', $new_password);
					samba_set_user_passwd('admin', $new_password);
					webdav_set_user_passwd('admin', $new_password);
					iscsi_set_user_passwd('admin', $new_password);
				}
				break;
			case 'start_iden':
				$status_arr = ems_get_sys_ident_led_status();
				$second = (isset($status_arr[1]) && strcmp($status_arr[1], "Off") == 0)? 300 : 0;
				ems_ctrl_sys_ident_led($second);
				break;
			case 'sys_seting':
				if (isset($_POST['system_name'])) {

					$now_system_name = cfg_get_system_name();
					$system_name = rtrim($_POST['system_name']);
					if (strcmp($now_system_name, $system_name) != 0) {

						$illegal_chars = "`~!@#$^&*()=+[]{}\\|;:'\",<>/?";

						if ((strlen($system_name) > 0) && is_valid_name($system_name, $illegal_chars)) {

							cfg_set_system_name($system_name);
							if (is_sw_with("WITH_HAC") && check_dual()) {

								ipc_sync_cfg(SYNC_CFG_SYSNAME);
							}

							samba_add_global_conf("netbios name", $system_name);
							afp_restart();
							system("[ -f /etc/hooks/post-hostnamechange ] && /etc/hooks/post-hostnamechange");
						}
					}
				}

				if (isset($_POST['buzzer_status'])) {

					$buzzer_status = $_POST['buzzer_status'];

					cfg_set_mute_startup($buzzer_status);
					$buzzer_status = $_POST["buzzer_status"];
					cfg_set_mute_startup($buzzer_status);

					if (is_sw_with("WITH_HAC") && check_dual()) {

						ipc_sync_cfg(SYNC_CFG_MUTE_STARTUP);
					}
					exec("/bin/kill -HUP `/bin/cat /var/run/qbuzzerd.pid` > /dev/null 2>&1");
				}
				break;
		}
	}
	
	$result_arr = array();
	$result_arr["success"] = true;
	$result_arr["msg"] = xlt('info_change_ok');
	echo json_encode($result_arr);
} else {

	$system_name = cfg_get_system_name();
	$buzzer_status = cfg_get_mute_startup();

	$ident_led_status_arr = ems_get_sys_ident_led_status();
	$ident_led_flag = $ident_led_status_arr[0];
	$ident = $ident_led_status_arr[1];

	$system_setting_arr = array();
	$system_setting_arr["system_name"] = $system_name;
	$system_setting_arr["buzzer_status"] = $buzzer_status;
	$system_setting_arr["ident_led_flag"] = $ident_led_flag;
	$system_setting_arr["ident"] = $ident;

	echo json_encode(array("success" => true, "data" => $system_setting_arr), JSON_NUMERIC_CHECK);
}
?>