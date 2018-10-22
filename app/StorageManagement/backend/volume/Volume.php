#!/www/cgi-bin/php
<?

require_once('/www/api_v2/storage/volume.php');

/* For debugging */
if (isset($_SERVER['GET_STR']))
	parse_str($_SERVER['GET_STR'], $_GET);
if (isset($_SERVER['POST_STR']))
	 parse_str($_SERVER['POST_STR'], $_POST);

function POST_METHOD()
{
	$result_arr = array();
	$pool_arr   = array();
	$ret        = 0;
	$output     = "";

	if (isset($_POST["op"])) {
		switch ($_POST["op"]) {
			case 'volume_create':
				$pool_name = (isset($_POST["pool_name"]))? $_POST["pool_name"] : "";
				$vol_name  = (isset($_POST["name"]))? $_POST["name"] : "";
				$size_mb   = (isset($_POST["size_mb"]))? $_POST["size_mb"] : 0;

				/* Optional */
				$thin      = (isset($_POST["thin"]) && $_POST["thin"] == 1)? TRUE : FALSE;
				$dedup     = (isset($_POST["dedup"]) && $_POST["dedup"] == 1)? TRUE : FALSE;
				$blk_size  = (isset($_POST["blk_size"]))? $_POST["blk_size"] : 64;
				$copies    = (isset($_POST["copies"]))? $_POST["copies"] : 1;
				$sync      = (isset($_POST["sync"]))? $_POST["sync"] : 1;
				$compress  = (isset($_POST["compress"]))? $_POST["compress"] : NULL;

				$ret = create_volume($pool_name, $vol_name,
									$size_mb, $thin,
									$dedup, $compress, $blk_size,
									$copies, $sync, $output);
				break;

			case 'volume_delete':
				$pool_name    = (isset($_POST["pool_name"]))? $_POST["pool_name"] : "";
				$vol_name     = (isset($_POST["name"]))? $_POST["name"] : "";
				$vol_name_arr = (isset($_POST["name_arr"]))? json_decode($_POST["name_arr"], TRUE) : array();
				if (count($vol_name_arr) == 0) {
					$vol_name_arr = array($vol_name);
				}

				$ret = delete_volume($pool_name, $vol_name_arr, $output);
				break;

			case 'volume_expand':
				$pool_name = (isset($_POST["pool_name"]))? $_POST["pool_name"] : "";
				$vol_name  = (isset($_POST["name"]))? $_POST["name"] : "";
				$size_mb   = (isset($_POST["size_mb"]))? $_POST["size_mb"] : 0;

				$ret = expand_volume($pool_name, $vol_name, $size_mb, $output);
				break;

			case 'volume_enable_threshold':
				$pool_name  = (isset($_POST["pool_name"]))? $_POST["pool_name"] : "";
				$vol_name   = (isset($_POST["name"]))? $_POST["name"] : "";
				$info_level = (isset($_POST["info_level"]))? $_POST["info_level"] : 0;
				$warn_level = (isset($_POST["warn_level"]))? $_POST["warn_level"] : 0;

				$ret = enable_volume_threshold_notice($pool_name, $vol_name,
										$info_level, $warn_level);
				break;

			case 'volume_disable_threshold':
				$pool_name  = (isset($_POST["pool_name"]))? $_POST["pool_name"] : "";
				$vol_name   = (isset($_POST["name"]))? $_POST["name"] : "";

				disable_volume_threshold_notice($pool_name, $vol_name);
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
	$vol_arr    = array();
	$ret        = 0;

	if (isset($_GET["op"])) {
		switch ($_GET["op"]) {
			default:
				break;
		}

	} else {
		$query_pool_name = isset($_GET["pool_name"])? $_GET["pool_name"] : "";

		$vol_arr = get_volume($query_pool_name);
	}

	$chksum = md5(json_encode($vol_arr));
	if (isset($_GET["md5sum"]) && $chksum == $_GET["md5sum"]) {
		$vol_arr = NULL;
		$vol_arr = array();
	}

	$result_arr["success"] = ($ret == 0)? TRUE : FALSE;
	$result_arr["data"]    = $vol_arr;
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