#!/www/cgi-bin/php
<?

require_once('/www/api_v2/storage/pd.php');
require_once('/www/api_v2/storage/pool.php');

/* For debugging */
if (isset($_SERVER['GET_STR']))
	parse_str($_SERVER['GET_STR'], $_GET);
if (isset($_SERVER['POST_STR']))
	 parse_str($_SERVER['POST_STR'], $_POST);

function POST_METHOD()
{
	$result_arr = array();
	$pd_id_arr  = array();
	$ret        = 0;
	$output     = "";

	if (isset($_POST["op"])) {
		switch ($_POST["op"]) {
			case 'set_global_spare':
				$pd_id_arr = isset($_POST["pd_id_arr"])? $_POST["pd_id_arr"] : array($_POST["pd_id"]);

				$ret = set_global_spare($pd_id_arr, $output);
				break;

			case 'set_free':
				$pd_id_arr = isset($_POST["pd_id_arr"])? $_POST["pd_id_arr"] : array($_POST["pd_id"]);

				$ret = set_free($pd_id_arr, $output);
				break;

			case 'replace_pool_pd':
				$pool_arr                = array();
				$pool_arr["pool_name"]   = isset($_POST["pool_name"])? $_POST["pool_name"] : "";
				$pool_arr["pd_id"]       = isset($_POST["pd_id"])? $_POST["pd_id"] : "";
				$pool_arr["spare_pd_id"] = isset($_POST["spare_pd_id"])? $_POST["spare_pd_id"] : "";

				$ret = pool_pd_replace($pool_arr, $output);
				break;

			case 'set_ident_led_off':
				$pd_id_arr = isset($_POST["pd_id_arr"])? $_POST["pd_id_arr"] : array($_POST["pd_id"]);

				$ret = set_ident_led_off($pd_id_arr, $output);
				break;

			case 'set_ident_led_on':
				$pd_id_arr = isset($_POST["pd_id_arr"])? $_POST["pd_id_arr"] : array($_POST["pd_id"]);

				$ret = set_ident_led_on($pd_id_arr, $output);
				break;

			case 'start_smartctl_test':
				$pd_id_arr = isset($_POST["pd_id_arr"])? $_POST["pd_id_arr"] : array($_POST["pd_id"]);

				$ret = start_smartctl_test($pd_id_arr, $output);
				break;

			case 'stop_smartctl_test':
				$pd_id_arr = isset($_POST["pd_id_arr"])? $_POST["pd_id_arr"] : array($_POST["pd_id"]);

				$ret = stop_smartctl_test($pd_id_arr, $output);
				break;

			case 'download_smartctl_log':
				if (isset($_SERVER["HTTP_REFERER"]) &&
					strncmp($_SERVER["HTTP_REFERER"], "https", 5) == 0) {
					$pd_arr["is_https"] = TRUE;
				}
				$pd_arr["pd_id"] = isset($_POST["pd_id"])? $_POST["pd_id"] : "";

				$ret = download_smartctl_log($pd_arr, $output);
				if ($ret === 0) {
					exit;
				}
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
	$pd_arr     = array();
	$ret        = 0;

	if (isset($_GET["op"])) {
		switch ($_GET["op"]) {
			case 'get_enclosure':
				$enc_id = isset($_GET["enc_id"])? $_GET["enc_id"] : QUERY_ALL;
				$pd_arr = get_enclosure_info($enc_id);
				break;

			case 'get_pd_for_pool_create':
			case 'get_pd_for_pool_expand':
				$enc_id      = isset($_GET["enc_id"])? $_GET["enc_id"] : QUERY_ALL;
				$pool_name   = isset($_GET["pool_name"])? $_GET["pool_name"] : NULL;
				$type_filter = "is_avail_free_pd";

				$pd_arr = get_pd($enc_id, $pool_name, $type_filter);
				break;

			case 'get_pd_for_avail_ssd':
				$enc_id      = isset($_GET["enc_id"])? $_GET["enc_id"] : QUERY_ALL;
				$pool_name   = isset($_GET["pool_name"])? $_GET["pool_name"] : NULL;
				$type_filter = "is_free_ssd_pd";

				$pd_arr = get_pd($enc_id, $pool_name, $type_filter);
				break;

			case 'get_pd_for_pool_read_cache':
				$enc_id      = isset($_GET["enc_id"])? $_GET["enc_id"] : QUERY_ALL;
				$pool_name   = isset($_GET["pool_name"])? $_GET["pool_name"] : NULL;
				$type_filter = "is_readcache_or_free_ssd";

				$pd_arr = get_pd($enc_id, $pool_name, $type_filter);
				break;

			case 'get_pd_for_pool_write_cache':
				$enc_id      = isset($_GET["enc_id"])? $_GET["enc_id"] : QUERY_ALL;
				$pool_name   = isset($_GET["pool_name"])? $_GET["pool_name"] : NULL;
				$type_filter = "is_same_pool_write_cache";

				$pd_arr = get_pd($enc_id, $pool_name, $type_filter);
				break;

			default:
				break;
		}

	} else {
		$enc_id = isset($_GET["enc_id"])? $_GET["enc_id"] : QUERY_ALL;
		$pd_arr = get_pd($enc_id);
	}

	$chksum = md5(json_encode($pd_arr));
	if (isset($_GET["md5sum"]) && $chksum == $_GET["md5sum"]) {
		$pd_arr = NULL;
		$pd_arr = array();
	}

	$result_arr["success"] = ($ret == 0)? TRUE : FALSE;
	$result_arr["data"]    = $pd_arr;
	$result_arr["md5sum"]  = $chksum;
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

header('Content-Type: application/json; charset=utf-8');
header( "Expires: Mon, 26 Jul 1997 05:00:00 GMT" );
header('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT');
// HTTP/1.1
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', false);
// HTTP/1.0
header('Pragma: no-cache');
?>