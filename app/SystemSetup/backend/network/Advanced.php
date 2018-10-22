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
require_once('/www/lib/rms.php');
require_once('/www/lib/net_lib.php');

require_once('/www/api_v2/system/net/network.php');

if (isset($_SERVER['REQUEST_METHOD']) && ($_SERVER['REQUEST_METHOD'] == 'POST')) {
	$result_arr = array();
	if (isset($_POST["op"])) {
		switch($_POST["op"]) {
			case 'ping_trace':
				$diagmode = $_POST["diagmode"];
				$ipmode   = ($_POST["ipmode"] == "IPv4")? 0 : 1;
				$addr     = isset($_POST["addr"])? $_POST["addr"] : "";
				if ($diagmode == "Ping") {
					if ($addr != "") {
						$file_id = getmypid();
						$result_arr["msg"] = net_ping_start_n_query($file_id, $addr, "", 1, 56, 10, $ipmode);
					}
				} else {
					if ($diagmode == "query") {
						$phpid             = $_POST["phpid"];
						$pid               = $_POST["pid"];
						$query_result      = net_traceroute_query($phpid);
						$done              = (net_traceroute_check_alive($pid) == TRUE)? FALSE : TRUE;
						$result_arr["msg"] = array("msg" => $query_result, "done" => $done);
					} else {
						$php_id            = getmypid();
						$pid               = net_traceroute_start($php_id, $addr, $ipmode);
						$result_arr["msg"] = array("phpid" => $php_id, "pid" => $pid);
					}
				}
				$result_arr["success"] = TRUE;
				break;
			case 'loopback_setting':
				/**
				 * @param [int] $_POST["loopback_enable"], Set to 1 if enable loopback interface.
				 * @param [int] $_POST["nic_id"],          NIC ID, ex. eth0, bond0.
				 */
				if (isset($_POST["loopback_enable"]) && $_POST["loopback_enable"] == 1) {
					$iface = isset($_POST["nic_id"])? $_POST["nic_id"] : "";
				} else {
					$iface = "";
				}
				net_loopback_interface_set($iface);
				$result_arr["success"] = TRUE;
				break;
			case 'arp_stop':
				net_arp_stop();
				$result_arr["success"] = TRUE;
				break;
		}
	}
	echo json_encode($result_arr);
} else {

	// Init
	$loopback_iface = net_loopback_interface_get();
	$loopback_addr  = net_get_cur_addr(0, $loopback_iface, "ipv4");
	if ($loopback_iface != "" && $loopback_addr != "") {
		list($iface, $vlan) = explode(".", $loopback_iface);
		$init_arr["loopback_enable"] = 1;
		$init_arr["loopback_nic_id"] = $iface;
		$init_arr["loopback_nic"]    = net_iface_to_name($loopback_iface);
		$init_arr["loopback_addr"]   = $loopback_addr;
	} else {
		$init_arr["loopback_enable"] = 0;
		$init_arr["loopback_nic_id"] = "";
		$init_arr["loopback_nic"]    = "";
		$init_arr["loopback_addr"]   = "";
	}

	// LoopBack
	$loopback_arr = array();
	$ifaces = get_ip_setting($default_gw);
	foreach ($ifaces as $iface) {
		$filter = array_filter(array_keys($iface),
					function ($key) {
						return in_array($key, array("id", "orig_name", "name", "address"));
					});
		$tmp_arr = array_intersect_key($iface, array_flip($filter));
		if (isset($tmp_arr["id"]) && isset($tmp_arr["orig_name"])) {
			$tmp_arr["id"] = $tmp_arr["orig_name"];
			unset($tmp_arr["orig_name"]);
		}
		$loopback_arr[] = $tmp_arr;
	}

	// ARP
	$arpgrid_arr = array();
	$arp_arr = array();
	$arr = net_arp_table_query("");
	foreach ($arr as $key => $column_arr) {
		foreach ($column_arr as $key_c => $column) {
			$arp_arr[$key_c] = $column;
		}
		$arpgrid_arr[] = $arp_arr;
	}

	$data["grid"] = $arpgrid_arr;
	$data["init"] = $init_arr;
	$data["lan"]  = $loopback_arr;
	echo json_encode(array("success" => true, "data" => $data), JSON_NUMERIC_CHECK);
}
?>