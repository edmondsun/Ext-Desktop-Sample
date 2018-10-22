#!/www/cgi-bin/php
<?
require_once('/www/lib/ems_lib.php');
require_once('/www/lib/globals.php');
require_once('/www/lib/rms.php');

header('Content-Type: application/json; charset=utf-8');

function query_ups()
{
	$apcupsd_ini_array = parse_ini_file("/wetc/apcupsd.set");
	$ups_type = ($apcupsd_ini_array["UPSTYPE"] == "")? "none" : $apcupsd_ini_array["UPSTYPE"];
	$ups_batt_level = ($apcupsd_ini_array["BATTERYLEVEL"] == -1)? 0 : $apcupsd_ini_array["BATTERYLEVEL"];
	$ups_timeout = $apcupsd_ini_array["TIMEOUT"];
	$ups_killpower = ($apcupsd_ini_array["KILLPOWER"])? "ON" : "OFF";

	$mgtupsd_ini_array = parse_ini_file("/wetc/mgtupsd.conf");
	$volt_max = $mgtupsd_ini_array["VOLT_MAX"];
	$volt_min = $mgtupsd_ini_array["VOLT_MIN"];
	
	$ups_status = "";
	$batt_progress = 0;
	$ups_ip_addr = "";
	$ups_community = "";
	if (strcmp($ups_type, "smartups") == 0) {
		$ups_status = ems_get_ups_status();
		
		if (file_exists("/var/log/apcupsd.battchg")) {
			$bat_output = file("/var/log/apcupsd.battchg");
			$batt_progress = intval(rtrim($bat_output[0], "\n"));
		} else {
			$batt_progress = 0;
		}
	} else if (strcmp($ups_type, "mgtups") == 0) {
		$ups_status = ems_get_mgtups_status();
		
		if (file_exists("/var/log/mgtups.battchg")) {
			$bat_output = file("/var/log/mgtups.battchg");
			$batt_progress = intval(rtrim($bat_output[0], "\n"));
		} else {
			$batt_progress = 0;
		}
	} else if (strcmp($ups_type, "snmp") == 0) {
		$ups_status = ems_get_ups_status();

		$ups_ip_addr = isset($apcupsd_ini_array["DEVICE"])? substr($apcupsd_ini_array["DEVICE"], 0, strpos($apcupsd_ini_array["DEVICE"], ':')) : "";
		$ups_community = isset($apcupsd_ini_array["DEVICE"])? substr($apcupsd_ini_array["DEVICE"], strrpos($apcupsd_ini_array["DEVICE"], ':')+1) : "";

		if (file_exists("/var/log/apcupsd.battchg")) {
			$bat_output = file("/var/log/apcupsd.battchg");
			$batt_progress = intval(rtrim($bat_output[0], "\n"));
		} else {
			$batt_progress = 0;
		}
	}
	$config_ups_type = hexdec(get_sw_conf("CONFIG_UPS_TYPE"));
	$ups_data_arr = array();
	$ups_data_arr["config_ups_type"] = $config_ups_type;
	$ups_data_arr["ups_type"] = $ups_type;
	$ups_data_arr["ups_batt_level"] = $ups_batt_level;
	$ups_data_arr["ups_delay_level"] = $ups_timeout;
	$ups_data_arr["ups_auto_shutdown"] = $ups_killpower;
	$ups_data_arr["batt_progress"] = $batt_progress;
	$ups_data_arr["volt_max"] = $volt_max;
	$ups_data_arr["volt_min"] = $volt_min;
	$ups_data_arr["ups_status"] = $ups_status;
	$ups_data_arr["ups_ip_addr"] = $ups_ip_addr;
	$ups_data_arr["ups_community"] = $ups_community;

	return $ups_data_arr;
}

if ( isset($_SERVER['REQUEST_METHOD']) && ($_SERVER['REQUEST_METHOD'] == 'POST') ) {
	if (isset($_POST["op"])) {
		
		$msg = "Setting failed";
		$is_success = false;
		
		switch($_POST["op"]) {
			case 'set_ups':
				$ups_type = isset($_POST["ups_type"])? $_POST["ups_type"] : "none";
				$device = '/dev/ttyS1';
				$cable = "smart";
				if (strcmp($ups_type, "snmp") == 0) {

					$ups_ip_addr = (isset($_POST["ups_ip_addr"])? $_POST["ups_ip_addr"]:"");
					$ups_community = (isset($_POST["ups_community"])? $_POST["ups_community"]:"");
					$device = $ups_ip_addr.':161:APC:'.$ups_community;
					$cable = "smart";
				}

				$shutdown_batt = (isset($_POST["shutdown_batt"])) ? $_POST["shutdown_batt"] : 5 ;
				$shutdown_delay = (isset($_POST["shutdown_delay"])) ? $_POST["shutdown_delay"] : 0 ;
				if ($shutdown_batt == 0) {

					$shutdown_batt = -1;
				}
				$shutdown_ups = (isset($_POST["shutdown_ups"]))? $_POST["shutdown_ups"] : "OFF";
				$max_batt_volt = (isset($_POST["max_batt_volt"])) ? $_POST["max_batt_volt"] : 0 ;
				$min_batt_volt = (isset($_POST["min_batt_volt"])) ? $_POST["min_batt_volt"] : 0 ;

				$cmd_str =	"UPSTYPE=".$ups_type."\n".
							"UPSCABLE=".$cable."\n".
							"DEVICE=".$device."\n".
							"BATTERYLEVEL=".$shutdown_batt."\n".
							"TIMEOUT=".$shutdown_delay."\n".
							"KILLPOWER=".$shutdown_ups."\n";

				if ($fp = fopen('/wetc/apcupsd.set', 'w') ) {

					fputs($fp, $cmd_str);
					fclose($fp);
					exec("/etc/init.d/apcupsd restart > /dev/null 2>&1");
				}

				if ($fp = fopen('/wetc/mgtupsd.conf', 'w') ) {

					$cmd_str .=	"VOLT_MAX=".$max_batt_volt."\n".
								"VOLT_MIN=".$min_batt_volt."\n";

					fputs($fp, $cmd_str);
					fclose($fp);
					exec("/etc/init.d/mgtupsd restart > /dev/null 2>&1");
				}

				$is_success = true;
				$msg = xlt('info_change_ok');
				break;
		}
		
		$result_arr = array();
		$result_arr["success"] = $is_success;
		$result_arr["msg"] = $msg;
		echo json_encode($result_arr);
	}
} else {
	
	$ups_data_arr = query_ups();
	
	$data_arr = array($ups_data_arr);
	
	echo json_encode(array("success" => true, "data" => $data_arr), JSON_NUMERIC_CHECK);
}

header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" ); 
header('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT');
// HTTP/1.1
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', false);
// HTTP/1.0
header('Pragma: no-cache');
print $output;
?>