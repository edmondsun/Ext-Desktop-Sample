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

require_once('/www/api_v2/system/net/network.php');

function POST_METHOD()
{
	$result_arr = array();
	$ipv6_arr   = array();
	$ret        = 0;
	$output     = "";

	if (isset($_POST["op"])) {
		switch ($_POST["op"]) {
			case 'enable_ipv6':
				if (isset($_POST["ctr_id"]))
					$ipv6_arr["ctr_id"] = $_POST["ctr_id"];
				if (isset($_POST["ipv6_type"]))
					$ipv6_arr["ipv6_type"] = $_POST["ipv6_type"];

				$ret = enable_ipv6_setting($ipv6_arr, $output);
				break;

			case 'disable_ipv6':
				if (isset($_POST["ctr_id"]))
					$ipv6_arr["ctr_id"] = $_POST["ctr_id"];

				$ret = disable_ipv6_setting($ipv6_arr, $output);
				break;

			case 'ipv6_set':
				if (isset($_POST["ctr_id"]))
					$ipv6_arr["ctr_id"] = $_POST["dst_addr"];
				$ipv6_arr["nic_name"]         = isset($_POST["nic_name"])? $_POST["nic_name"] : "";
				$ipv6_arr["ipv6_type"]        = isset($_POST["ipv6_type"])? $_POST["ipv6_type"] : "";
				$ipv6_arr["ipv6_global_addr"] = isset($_POST["ipv6_global_addr"])? $_POST["ipv6_global_addr"] : "";
				$ipv6_arr["ipv6_prefix"]      = isset($_POST["ipv6_prefix"])? $_POST["ipv6_prefix"] : "";
				$ipv6_arr["ipv6_gateway"]     = isset($_POST["ipv6_gateway"])? $_POST["ipv6_gateway"] : "";

				$ret = set_ipv6_setting($ipv6_arr, $output);
				break;

			default:
				$ret    = -1;
				$output = xlt('invalid_value');
				break;
		}

	} else {
		$ret    = -1;
		$output = xlt('invalid_value');
	}

	$result_arr["success"] = ($ret == 0) ? TRUE : FALSE;
	$result_arr["msg"]     = $output;
	echo json_encode($result_arr, JSON_NUMERIC_CHECK);
}

function GET_METHOD()
{
	$result_arr = array();
	$ipv6_arr   = array();
	$ret        = 0;

	$ipv6_arr = get_ipv6_setting();

	$result_arr["success"] = ($ret == 0)? TRUE : FALSE;
	$result_arr["data"]    = $ipv6_arr;
	echo json_encode($result_arr, JSON_NUMERIC_CHECK);
}

if (isset($_SERVER['REQUEST_METHOD']) == FALSE) {
	exit;
}

switch ($_SERVER['REQUEST_METHOD']) {
	case 'POST':
		POST_METHOD();
		break;

	case 'GET':
		GET_METHOD();
		break;

	default:
		break;
}
?>