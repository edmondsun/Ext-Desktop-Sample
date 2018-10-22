#!/www/cgi-bin/php
<?
header('Content-Type: application/json; charset=utf-8');
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
// HTTP/1.1
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', false);
// HTTP/1.0
header('Pragma: no-cache');

require_once '/www/lib/net_lib.php';
require_once '/www/lib/globals.php';
require_once '/www/lib/rms.php';
require_once '/www/lib/config.php';
require_once '/www/lib/iscsi_lib.php';

require_once '/www/api_v2/system/net/network.php';

if (isset($_SERVER['REQUEST_METHOD']) && ($_SERVER['REQUEST_METHOD'] == 'POST')) {
	$result_arr = array();
	$ctr_id = get_ctr_id();
	if (isset($_POST["op"])) {
		switch ($_POST["op"]) {
		case 'net_setting':
			//Default Gateway
			$ctr_id = isset($_POST["ctr_id"]) ? $_POST["ctr_id"] : 0;
			$idx = isset($_POST["gw_id"]) ? $_POST["gw_id"] : NULL;
			$gw_addr = isset($_POST["gw_addr"]) ? $_POST["gw_addr"] : NULL;
			$ret = net_defgw_set($ctr_id, $idx, STACK_IPV4, $gw_addr);

			if ($ret != 0) {
				$result_arr["success"] = FALSE;
				$result_arr["msg"] = xlt('gw_out_ng');

				break;
			}

			//DNS
			if (isset($_POST["dns"])) {
				if ($_POST["dns"] == "static") {
					net_set_dynamic_dns(FALSE);
					$ret = net_set_dns($_POST["primary"], $_POST["secondary"], $_POST["search_path"]);
				} else {
					net_set_dynamic_dns(TRUE);
					$ret = 0;
				}

				if ($ret != 0) {
					$result_arr["success"] = FALSE;
					$result_arr["msg"] = xlt('dns_set_ng');

					break;
				}
			}

			$result_arr["success"] = TRUE;
			$result_arr["msg"] = xlt('info_change_ok');
			break;

		case 'ipv6_setting':
			if (isset($_POST["ipv6_default_gateway"])) {
				$name = $_POST["ipv6_default_gateway"];
				$lan_info_arr = get_lan_info($name);

				if ($lan_info_arr["lag"] != "No") {
					$idx_ipv6 = $lan_info_arr["id"];
				} else {
					$idx_ipv6 = $lan_info_arr["lag_no"];
				}

				$gw_addr6 = $lan_info_arr["ipv6_gateway"];

				if ($idx_ipv6 != "" && $gw_addr6 != "") {
					$errcode = net_defgw_set($ctr_id, $idx_ipv6, STACK_IPV6, $gw_addr6);
				} else {
					$errcode = net_defgw_del($ctr_id, STACK_IPV6);
				}

			}

			$result_arr["success"] = ($errcode == 0) ? TRUE : FALSE;
			$result_arr["msg"] = ($errcode != 0) ? xlt('gw_out_ng') : xlt('info_change_ok');
			break;

		case 'nic_setting':
			/**
			 * @param [int] $_POST["ctr_id"],      Controller ID
			 * @param [int] $_POST["id"],          Interface ID
			 * @param [int] $_POST["type"],        IP type, availabl args: "static", "bootp", "dhcp"
			 * @param [int] $_POST["address"],     IP address
			 * @param [int] $_POST["mask"],        Subnet mask
			 * @param [int] $_POST["gateway"],     Gateway address
			 * @param [int] $_POST["mtu_size"],    Set to 9000 for enabled jumbo frame, 1500 or other size for disable.
			 * @param [int] $_POST["enable_vlan"], Set to 1 for enable VLAN
			 * @param [int] $_POST["vlan_id"],     VLAN ID
			 * @param [int] $_POST["vlan_pri"],    VLAN priority
			 */
			$errcode = 0;
			$errmsg = "";

			$ctr_id = isset($_POST["ctr_id"]) ? $_POST["ctr_id"] : 0;
			$nic_id = isset($_POST["id"]) ? $_POST["id"] : 0;
			if (isset($_POST["type"])) {
				switch (strtolower($_POST["type"])) {
				case 'static':$type = TYPE_STATIC;
					break;
				case 'bootp':$type = TYPE_BOOTP;
					break;
				case 'dhcp':
				default:$type = TYPE_DHCP;
					break;
				}
			} else {
				$type = TYPE_DHCP;
			}
			$address = isset($_POST["address"]) ? net_trim_leading_zero($_POST["address"]) : "";
			$mask = isset($_POST["mask"]) ? net_trim_leading_zero($_POST["mask"]) : "";
			$gateway = isset($_POST["gateway"]) ? net_trim_leading_zero($_POST["gateway"]) : "";

			// Set IP.
			$errcode = net_set_ip($ctr_id, $nic_id, $type, $address, $mask, $gateway);

			if ($errcode == 0) {
				// Set jumbo frame
				$enable_mtu = (isset($_POST["mtu_size"]) && $_POST["mtu_size"] == 9000);
				$errcode = net_enable_jumbo_frame($ctr_id, $nic_id, $enable_mtu);
				if ($errcode != 0) {
					$errmsg = xlt('net_set_mtu_ng');
				}

				// Set VLAN
				if ($errcode == 0) {
					if (isset($_POST["enable_vlan"]) && $_POST["enable_vlan"] == 1) {
						$vlan_id = isset($_POST["vlan_id"]) ? $_POST["vlan_id"] : 0;
						$priority = isset($_POST["vlan_pri"]) ? $_POST["vlan_pri"] : 0;

					} else {
						$vlan_id = $vlan_pri = 0;
					}

					$errcode = net_set_vlan($ctr_id, $nic_id, $vlan_id, $priority);
					if ($errcode != 0) {
						$errmsg = xlt('net_vlan_set_ng');
					}
				}

			} else {
				$errmsg = xlt('chg_ip_setting_ng');
			}

			$result_arr["success"] = ($errcode == 0) ? TRUE : FALSE;
			$result_arr["msg"] = ($errcode == 0) ? xlt('info_change_ok') : $errmsg;
			break;
		}

	} else {
		$result_arr["success"] = FALSE;
		$result_arr["msg"] = "Something wrong....";
	}

	echo json_encode($result_arr);
} else {
	if (isset($_GET)) {
		$result_arr = array();
		$iface_arr = array();
		$ret = 0;

		if (isset($_GET["op"])) {
			switch ($_GET["op"]) {
			case 'get_cur_iface':
				if (isset($_GET["ipv6"])) {
					$confs = net_get_cur_iface_ipv6(0, TRUE);
				} else {
					$confs = net_get_cur_iface(0, TRUE);
				}

				foreach ($confs as $conf) {
					$name = net_iface_to_name($conf);
					if ($name == xlt('mgmt_port')) {
						$mgmt_arr = array();
						$mgmt_arr["name"] = $name;
						$mgmt_arr["value"] = $conf;

					} else {
						$iface_arr[] = array(
							"name" => $name,
							"value" => $conf,
						);
					}
				}

				if (isset($mgmt_arr)) {
					$iface_arr[] = array(
						"name" => $mgmt_arr["name"],
						"value" => $mgmt_arr["value"],
					);
				}
				break;

			case 'get_iface_addr':
				$iface = isset($_GET["iface"]) ? $_REQUEST["iface"] : "";
				$iface_arr["ipv4_Addr"] = net_get_cur_addr(0, $iface, "ipv4");
				$iface_arr["ipv6_Addr"] = net_get_cur_addr(0, $iface, "ipv6");
				break;

			default:
				break;
			}

		} else {
			/* Query all interface */
			$ifaces = get_ip_setting($default_gw);

			// Init data
			$ctr_id = get_ctr_id();
			net_get_dns($primary_dns, $secondary_dns, $dns_search_path);
			$init_arr["default_gateway"] = $default_gw;
			$init_arr["dns"] = net_get_dynamic_dns() ? "dynamic" : "static";
			$init_arr["primary"] = (isset($primary_dns)) ? $primary_dns : "";
			$init_arr["secondary"] = (isset($secondary_dns)) ? $secondary_dns : "";
			$init_arr["search_path"] = (isset($dns_search_path)) ? $dns_search_path : "";

			$iface_arr["grid"] = $ifaces;
			$iface_arr["init"] = $init_arr;
		}

		$chksum = md5(json_encode($iface_arr));
		if (isset($_GET["md5sum"]) && $chksum == $_GET["md5sum"]) {
			$iface_arr = NULL;
			$iface_arr = array();
		}

		$result_arr = array();
		$result_arr["success"] = ($ret == 0) ? TRUE : FALSE;
		$result_arr["data"] = $iface_arr;
		$result_arr["md5sum"] = $chksum;
		echo json_encode($result_arr, JSON_NUMERIC_CHECK);

	} else {

	}
// END:
}
?>
