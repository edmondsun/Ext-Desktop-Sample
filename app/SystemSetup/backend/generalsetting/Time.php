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

require_once('/www/lib/globals.php');
require_once('/www/lib/template.php');
require_once('/www/lib/rms.php');
require_once('/www/lib/config.php');
require_once('/www/lib/timezone.php');

define("NTPDATE_PATH", "/usr/sbin/ntpdate");
define("NTP_PATH", "/wetc/ntp.conf");
global $_DATE_TIMEZONE_DATA;
$TZ_LIST = array_keys($_DATE_TIMEZONE_DATA);

if (isset($_SERVER['REQUEST_METHOD']) && ($_SERVER['REQUEST_METHOD'] == 'POST')) {
	$result_arr = array();
	//TimeZone Setting
	if (isset($_POST["time_zone"])) {
		$cmd = sprintf("/bin/cp /usr/share/zoneinfo/%s /wetc/localtime", $_POST["time_zone"]);
		exec($cmd);
		$zone = "ZONE=\"".$_POST["time_zone"]."\"\n";
		file_put_contents(CLOCK_PATH, $zone);
		if (is_sw_with('WITH_HAC') && check_dual()) {
			hac_tunnel_send_cmd($cmd);
			hac_tunnel_send_file(CLOCK_PATH);
		}
	}
	
	$ntp_check = (isset($_POST["ntp_checked"]) && $_POST["ntp_checked"] == "on") ? "checked" : "";
	$ntp_server = (isset($_POST["ntp_server"])) ? $_POST["ntp_server"] : "";
	$ntp_status = "";
	
	if (isset($_POST["op"])) {
		switch($_POST["op"]) {
			case 'ntp_setting':
				exec("/usr/sbin/ntpdate -su $ntp_server", $output, $ret);
				$ntp_status = ($ret != 0) ? xlt('ntp_no_response') : "";
				if (strlen($ntp_status) > 0) {
					exec("/sbin/hwclock -uw");
					$result_arr["success"] = false;
					$result_arr["msg"] = $ntp_status;
				} else {
					$result_arr["success"] = true;
					$result_arr["msg"] = xlt('info_change_ok');
				}
				if (is_sw_with("WITH_HAC") && check_dual()) {
					$hac_out = hac_tunnel_run_cmd("/usr/sbin/ntpdate -su $ntp_server; echo $?");
					$hac_out = explode("\n", trim($hac_out));
					if ($hac_out[count($hac_out)-1] != '0')
						hac_tunnel_send_cmd("/sbin/hwclock -uw");
				}
				break;
			case 'time_setting':
				if (isset($_POST["year"]) && isset($_POST["month"]) && isset($_POST["day"]) &&
					isset($_POST["hour"]) && isset($_POST["min"]) && isset($_POST["sec"]) && isset($_POST["ampm"])) {
					if ($_POST["ampm"] == "PM")
						$_POST["hour"] += 12;
					$ntp_check = "";
					$ntp_server = "";
					$cmd = sprintf("date -s \"%u.%02u.%02u-%02u:%02u:%02u\"", $_POST["year"], $_POST["month"], $_POST["day"], $_POST["hour"], $_POST["min"], $_POST["sec"]);
					exec("$cmd && /sbin/hwclock -uw", $output, $ret);
					if (is_sw_with("WITH_HAC") && check_dual())
						hac_tunnel_send_cmd("$cmd && /sbin/hwclock -uw");
					$result_arr["success"] = ($ret == 0) ? true : false;
					$result_arr["msg"] = ($ret == 0) ? xlt('info_change_ok') : xlt('info_change_ng');
				}
				break;			
		}
	}
	//Write NTP info
	$cfg_array = array();
	$cfg_array["SERVER"] = $ntp_server;
	$cfg_array["STATUS"] = $ntp_status;
	$cfg_array["CHECK"] = $ntp_check;
	if (file_exists(NTPDATE_PATH)) {
		write_ini_file(NTP_PATH, $cfg_array);
	}
	
	echo json_encode($result_arr);
} else {
	//TimeZone init
	$tz_area = "";
	$tzconf = (file_exists(CLOCK_PATH)) ? parse_ini_file(CLOCK_PATH) : array();
	$tz = (isset($tzconf["ZONE"])) ? $tzconf["ZONE"] : "Asia/Taipei";
	foreach($TZ_LIST as $key => $value) {
		if ( rtrim($_DATE_TIMEZONE_DATA[$value]["TZconf"]) == rtrim($tz) ){
			$tz_area = $key;
			break;
		}
	}
	_set_time_zone_();
	
	//Get NTP info
	if (file_exists(NTPDATE_PATH) && file_exists(NTP_PATH)) {
		$cfg_array = parse_ini_file(NTP_PATH);
		$ntp_server = isset($cfg_array["SERVER"]) ? $cfg_array["SERVER"] : "";
		$ntp_status = isset($cfg_array["STATUS"]) ? $cfg_array["STATUS"] : "";
		$ntp_check = isset($cfg_array["CHECK"]) ? $cfg_array["CHECK"] : "";
	} else {
		$ntp_server = "";
		$ntp_status = "";
		$ntp_check = "";
	}

	//NTP Server
	$ntp_list_arr = array();
	$ntp_list_arr[] = array("pool.ntp.org");
	$ntp_list_arr[] = array("time.windows.com");
	$ntp_list_arr[] = array("time.nist.gov");
	$ntp_list_arr[] = array("time-a.nist.gov");
	//System Time
	$systime = array();
	$systime["year"] = date("Y");
	$systime["month"] = date("n");
	$systime["day"] = date("j");
	$systime["hour"] = (date("G") < 12 ) ? (date("G")) : (date("G") - 12);
	$systime["min"] = (int)date("i");
	$systime["sec"] = (int)date("s");
	$systime["ampm"] = ((intval(date("G")/12)) == 0) ? "AM" : "PM";
	$systime["ntp_checked"] = (isset($ntp_check) && strcmp($ntp_check, "checked") == 0) ? "on" : "off";
	$systime["time_zone"] = $tz;
	$systime["ntp_server"] = $ntp_server;
	// Time ZONE
	foreach ($_DATE_TIMEZONE_DATA as $k => $v) {
		$tz_arr[] = array($k, $_DATE_TIMEZONE_DATA[$k]["TZconf"]);
	}	
	
	echo json_encode(array("success" => true, "ntpServer" => $ntp_list_arr, "sysTime" => $systime, "timeZone" => $tz_arr));
}
?>