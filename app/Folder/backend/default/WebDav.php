#!/www/cgi-bin/php
<?
require_once("/www/api_v2/folder/webdav.php");

if (isset($_SERVER['REQUEST_METHOD']) == FALSE) {
	exit;
}

/*
op: webdav_edit_share
write read/write list of WebDAV service into NAS
	Input parameters:
		@pool : Storage pool name
		@volume : volume name of the pool
		@folder : folder name of the volume
		@folder_name : Human readable folder name
		@user_ro_arr: read array of local user, will not change this value if not found in POST. Must be paired with user_rw_arr
		@user_rw_arr: read/write array of local user, will not change this value if not found in POST. Must be paired with user_ro_arr
		@domain_user_ro_arr: read array of domain user, will not change this value if not found in POST. Must be paired with domain_user_rw_arr
		@domain_user_rw_arr: read/write array of domain user, will not change this value if not found in POST. Must be paired with domain_user_ro_arr

	Output:
		@ret : 0 -> success, else -> error
		@output : output string if error

*/

function POST_METHOD()
{
	$result_arr = array();
	$host_arr   = array();
	$ret        = 0;
	$output     = "";

	if (isset($_POST["op"])) {

		switch ($_POST["op"]) {
			case 'webdav_edit_share':
				$pool = (isset($_POST["pool"]))? $_POST["pool"] : "";
				$volume = (isset($_POST["volume"]))? $_POST["volume"] : "";
				$folder = (isset($_POST["folder"]))? $_POST["folder"] : "";
				$folder_name = (isset($_POST["folder_name"]))? $_POST["folder_name"] : "";

				/*if array is NULL, do not set this permission. if array is set to empty ,i.e. array(), clear all user from this array*/
				$user_rw_arr = (isset($_POST["user_rw_arr"]))? json_decode($_POST["user_rw_arr"], TRUE) : NULL;
				$user_ro_arr = (isset($_POST["user_ro_arr"]))? json_decode($_POST["user_ro_arr"], TRUE) : NULL;
				$domain_user_rw_arr = (isset($_POST["domain_user_rw_arr"]))? json_decode($_POST["domain_user_rw_arr"], TRUE) : NULL;
				$domain_user_ro_arr = (isset($_POST["domain_user_ro_arr"]))? json_decode($_POST["domain_user_ro_arr"], TRUE) : NULL;

				if ((is_null($user_rw_arr) && is_null($user_ro_arr) && is_null($domain_user_rw_arr) && is_null($domain_user_ro_arr)) ||
						(gettype($user_rw_arr) != gettype($user_ro_arr)) ||
						(gettype($domain_user_rw_arr) != gettype($domain_user_ro_arr)))
				{
					$ret = -1;
					$output = xlt('invalid_value');
				} else {
					$perm_arr = array();
					$perm_arr["user_rw_arr"] = $user_rw_arr;
					$perm_arr["user_ro_arr"] = $user_ro_arr;
					$perm_arr["domain_user_rw_arr"] = $domain_user_rw_arr;
					$perm_arr["domain_user_ro_arr"] = $domain_user_ro_arr;	
					$ret = webdav_edit_share($pool, $volume, $folder, $folder_name, $perm_arr, $output);
				}
				break;

			default:
				$ret = -1;
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
	$webdav_arr = array();
	$ret        = 0;

	if (isset($_GET["op"])) {
		switch ($_GET["op"]) {
			default:
				break;
		}
	} else {
			$folder_name = isset($_GET["folder_name"])? $_GET["folder_name"] : "";
			$domain = isset($_GET["domain"])? $_GET["domain"] : "local_user"; //local_user/domain_user/local_group/domain_group	
			$webdav_arr = query_webdav_share($folder_name, $domain);
	}

	$chksum = md5(json_encode($webdav_arr));
	if (isset($_GET["md5sum"]) && $chksum == $_GET["md5sum"]) {
		$webdav_arr = NULL;
		$webdav_arr = array();
	}

	$result_arr["success"] = ($ret == 0)? TRUE : FALSE;
	$result_arr["data"]    = $webdav_arr;
	$result_arr["md5sum"]  = $chksum;
	echo json_encode($result_arr, JSON_BIGINT_AS_STRING);
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