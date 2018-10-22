#!/www/cgi-bin/php
<?
if (isset($_SERVER['REQUEST_METHOD']) == FALSE) {
	exit;
}

function GET_METHOD()
{
	$result_arr = array();
	$map_arr = array();
	$ret        = 0;

	if (isset($_GET["op"])) {
		switch ($_GET["op"]) {
			default:
				break;
		}

	} else {
			$domain_type = isset($_GET["domain_type"])? $_GET["domain_type"] : TYPE_LOCAL;
			$user_type = isset($_GET["user_type"])? $_GET["user_type"] : TYPE_USER;
			$map_arr = get_foldermap($domain_type, $user_type);
	}


	$chksum = md5(json_encode($map_arr));
	if (isset($_GET["md5sum"]) && $chksum == $_GET["md5sum"]) {
		$map_arr = NULL;
		$map_arr = array();
	}

	$result_arr["success"] = ($ret == 0)? TRUE : FALSE;
	$result_arr["data"]    = $pool_arr;
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
