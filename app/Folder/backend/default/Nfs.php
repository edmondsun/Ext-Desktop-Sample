#!/www/cgi-bin/php
<?
require_once("/www/api_v2/folder/nfs.php");

if (isset($_SERVER['REQUEST_METHOD']) == FALSE) {
	exit;
}

/*
	Input parameters:
		@pool : Storage pool name
		@volume : volume name of the pool
		@folder : folder name of the volume
		@host : host IP or domain name
		@perm : 'ro' or 'rw'
		@root_squash : true for root_squash or false for no_root_squash
		@async : true for async or false for sync
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
		$pool = (isset($_POST["pool"]))? $_POST["pool"] : "";
		$volume = (isset($_POST["volume"]))? $_POST["volume"] : "";
		$folder = (isset($_POST["folder"]))? $_POST["folder"] : "";
		$folder_name = (isset($_POST["folder_name"]))? $_POST["folder_name"] : "";
		$host = (isset($_POST["host"]))? $_POST["host"] : "*";
		$old_host = (isset($_POST["old_host"]))? $_POST["old_host"] : "";
		$perm = (isset($_POST["perm"]))? $_POST["perm"] : "ro";
		$root_squash = (isset($_POST["root_squash"]))? $_POST["root_squash"] : "no_root_squash";
		$async = (isset($_POST["async"]))? $_POST["async"] : "async";

		switch ($_POST["op"]) {
			case 'nfs_add_share_host':
				$ret = nfs_add_share_host($pool, $volume, $folder, $folder_name, $host, $perm, $async, $root_squash, $output);
				break;

			case 'nfs_modify_share_host':
				$ret = nfs_modify_share_host($pool, $volume, $folder, $folder_name, $old_host, $host, $perm, $async, $root_squash, $output);
				break;

			case 'nfs_delete_share_host':
				$ret = nfs_delete_share_host($pool, $volume, $folder, $folder_name, $host, $output);
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
	$nfs_arr = array();
	$ret        = 0;

	if (isset($_GET["op"])) {
		switch ($_GET["op"]) {
			default:
				break;
		}
	} else {

			$folder_name = isset($_GET["folder_name"])? $_GET["folder_name"] : "";
			$nfs_arr = nfs_query_host($folder_name);
	}

	$chksum = md5(json_encode($nfs_arr));
	if (isset($_GET["md5sum"]) && $chksum == $_GET["md5sum"]) {
		$nfs_arr = NULL;
		$nfs_arr = array();
	}

	$result_arr["success"] = ($ret == 0)? TRUE : FALSE;
	$result_arr["data"]    = $nfs_arr;
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