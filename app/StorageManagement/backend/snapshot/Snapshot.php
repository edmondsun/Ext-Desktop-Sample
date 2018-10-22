#!/www/cgi-bin/php
<?

require_once('/www/api_v2/storage/snapshot.php');

/* For debugging */
if (isset($_SERVER['GET_STR']))
	parse_str($_SERVER['GET_STR'], $_GET);
if (isset($_SERVER['POST_STR']))
	 parse_str($_SERVER['POST_STR'], $_POST);

function POST_METHOD()
{
	$result_arr = array();
	$snap_arr   = array();
	$ret        = 0;
	$output     = "";

	if (isset($_POST["op"])) {
		switch ($_POST["op"]) {
			case 'snapshot_create':
				$name = isset($_POST["name"])? $_POST["name"] : "";

				$ret = create_snap($name, $output);
				break;

			case 'snapshot_delete':
				$name     = isset($_POST["name"])? $_POST["name"] : "";
				$name_arr = isset($_POST["name_arr"])? json_decode($_POST["name_arr"], TRUE) : array();
				if (count($name_arr) == 0) {
					$name_arr = array($name);
				}

				$ret = delete_snap($name_arr, $output);
				break;

			case 'snapshot_rollback':
				/**
				 * If error code is 221 or 222, it means we have recently snapshots
				 * that created after the one we are going to rollback.
				 * Set "delete_recent" to TRUE to ignoe this warning.
				 */
				$name          = isset($_POST["name"])? $_POST["name"] : "";
				$delete_recent = isset($_POST["delete_recent"])? $_POST["delete_recent"] : FALSE;

				$ret = rollback_snap($name, $delete_recent, $output);
				break;

			case 'snapshot_clone':
				$name        = isset($_POST["name"])? $_POST["name"] : "";
				$pool_name   = isset($_POST["pool_name"])? $_POST["pool_name"] : "";
				$volume_name = isset($_POST["volume_name"])? $_POST["volume_name"] : "";
				$clone_name  = isset($_POST["clone_name"])? $_POST["clone_name"] : "";

				$ret = clone_snap($name, $pool_name, $volume_name, $clone_name, $output);
				break;

			case 'snapshot_set_sched':
				/**
				 * @var [string] $_POST["type"]        [Available values: disable, daily, weekly, monthly, repeat_hour]
				 * @var [int]    $_POST["week_day"]    [0 for sunday, 1 for monday and so on]
				 * @var [int]    $_POST["month_day"]   [Day of month]
				 * @var [int]    $_POST["repeat_hour"] [Repeat every ? hours; available values: 1, 2, 3, 4, 6, 8, 12]
				 * @var [int]    $_POST["start_hour"]  [Start hour in 24-hour clock]
				 */
				$name         = isset($_POST["name"])? $_POST["name"] : "";
				$sched_type   = isset($_POST["type"])? $_POST["type"] : NULL;
				$week_day     = isset($_POST["week_day"])? $_POST["week_day"] : NULL;
				$month_day    = isset($_POST["month_day"])? intval($_POST["month_day"]) : NULL;
				$repeat_hour  = isset($_POST["repeat_hour"])? intval($_POST["repeat_hour"]) : NULL;
				$start_hour   = isset($_POST["start_hour"])? intval($_POST["start_hour"]) : 0;
				$start_minute = isset($_POST["start_minute"])? intval($_POST["start_minute"]) : 0;

				$ret = set_snap_sched($name, $sched_type, $week_day, $month_day,
									$repeat_hour, $start_hour, $start_minute, $output);
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
	echo json_encode($result_arr, JSON_BIGINT_AS_STRING);
}

function GET_METHOD()
{
	$result_arr = array();
	$snap_arr   = array();
	$ret        = 0;

	if (isset($_GET["op"])) {
		switch ($_GET["op"]) {
			default:
				break;
		}

	} else {
		$query_type = isset($_GET["query_type"])? $_GET["query_type"] : TYPE_ALL;
		$snap_arr   = get_snapshot($query_type);
	}

	$chksum = md5(json_encode($snap_arr));
	if (isset($_GET["md5sum"]) && $chksum == $_GET["md5sum"]) {
		$snap_arr = NULL;
		$snap_arr = array();
	}

	$result_arr["success"] = ($ret == 0)? TRUE : FALSE;
	$result_arr["data"]    = $snap_arr;
	$result_arr["md5sum"]  = $chksum;
	echo json_encode($result_arr, JSON_BIGINT_AS_STRING);
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