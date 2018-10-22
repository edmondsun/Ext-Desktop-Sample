#!/www/cgi-bin/php
<?

require_once('/www/api_v2/storage/iscsi/iscsi_def.php');
require_once('/www/api_v2/storage/iscsi/iscsi_query.php');
require_once('/www/api_v2/storage/iscsi/iscsi_general.php');
require_once('/www/api_v2/storage/iscsi/iscsi_lun.php');
require_once('/www/api_v2/storage/iscsi/iscsi_target.php');
require_once('/www/api_v2/storage/iscsi/iscsi_map.php');
require_once('/www/api_v2/storage/iscsi/iscsi_acl.php');


/* For debugging */
if (isset($_SERVER['GET_STR']))
	parse_str($_SERVER['GET_STR'], $_GET);
if (isset($_SERVER['POST_STR']))
	 parse_str($_SERVER['POST_STR'], $_POST);

function POST_METHOD()
{
	$result_arr = array();
	$ret        = 0;
	$output     = "";

	if (isset($_POST["op"])) {
		switch ($_POST["op"]) {
			case 'create_target_node':
				$target_name = isset($_POST["target_name"])? $_POST["target_name"] : "";

				$target_id = create_target($target_name, $output);

				if ($target_id >= 0) {
					$ret    = 0;
					$output = "";
					$local_user_arr  = (isset($_POST["local_user_arr"]))? json_decode($_POST["local_user_arr"], TRUE) : array();
					$domain_user_arr = (isset($_POST["domain_user_arr"]))? json_decode($_POST["domain_user_arr"], TRUE) : array();
					$mchap_user      = (isset($_POST["mchap_user"]))? $_POST["mchap_user"] : "";
					$mchap_passwd    = (isset($_POST["mchap_passwd"]))? $_POST["mchap_passwd"] : "";

					$ret = set_target_user($target_id,
											$local_user_arr, $domain_user_arr,
											$mchap_user, $mchap_passwd,
											$output);

				} else {
					$ret = -1;
				}
				break;

			case 'delete_target_node':
				$target_id = isset($_POST["target_id"])? $_POST["target_id"] : NULL;

				$ret = delete_target($target_id, $output);
				break;

			case 'edit_target_node':
				$target_id   = isset($_POST["target_id"])? $_POST["target_id"] : NULL;
				$target_name = isset($_POST["target_name"])? $_POST["target_name"] : "";

				$tgt_id = edit_target_name($target_id, $target_name, $output);

				if ($tgt_id >= 0) {
					$ret    = 0;
					$output = "";
					$local_user_arr  = (isset($_POST["local_user_arr"]))? json_decode($_POST["local_user_arr"], TRUE) : array();
					$domain_user_arr = (isset($_POST["domain_user_arr"]))? json_decode($_POST["domain_user_arr"], TRUE) : array();
					$mchap_user      = (isset($_POST["mchap_user"]))? $_POST["mchap_user"] : "";
					$mchap_passwd    = (isset($_POST["mchap_passwd"]))? $_POST["mchap_passwd"] : "";

					$ret = set_target_user($tgt_id,
											$local_user_arr, $domain_user_arr,
											$mchap_user, $mchap_passwd,
											$output);
				}
				break;

			case 'enable_target_node':
				$target_id = isset($_POST["target_id"])? $_POST["target_id"] : NULL;

				$ret = enable_target($target_id, $output);
				break;

			case 'disable_target_node':
				$target_id = isset($_POST["target_id"])? $_POST["target_id"] : NULL;

				$ret = disable_target($target_id, $output);
				break;

			case 'create_iscsi_lun':
				$pool     = isset($_POST["pool"])? $_POST["pool"] : "";
				$lun      = isset($_POST["lun"])? $_POST["lun"] : "";
				$size_mb  = isset($_POST["size_mb"])? $_POST["size_mb"] : NULL;

				/* [thin/dedup] 1 -> enable; 0 -> disable*/
				$thin     = isset($_POST["thin"])? (($_POST["thin"] == 1)? TRUE : FALSE) : NULL;
				$dedup    = isset($_POST["dedup"])? (($_POST["dedup"] == 1)? TRUE : FALSE) : NULL;
				/* [compress] enable -> on, disable -> off, gen_zero -> genericzero, zero_reclaim -> empty */
				$compress = isset($_POST["compress"])? $_POST["compress"] : NULL;
				$blk_size = isset($_POST["blk_size"])? $_POST["blk_size"] : NULL; /* integer */
				$copies   = isset($_POST["copies"])? $_POST["copies"] : NULL; /* integer */

				$ret = create_iscsi_lun($pool, $lun, $size_mb, $thin,
									$dedup, $compress, $blk_size, $copies,
									NULL, NULL,
									$output);
				break;

			case 'create_target_and_map_lun':
				$target_name = isset($_POST["target_name"])? $_POST["target_name"] : "";

				$tgt_id = create_target($target_name, $output);
				if ($tgt_id >= 0) {
					$output          = "";
					$local_user_arr  = (isset($_POST["local_user_arr"]))? json_decode($_POST["local_user_arr"], TRUE) : array();
					$domain_user_arr = (isset($_POST["domain_user_arr"]))? json_decode($_POST["domain_user_arr"], TRUE) : array();
					$mchap_user      = (isset($_POST["mchap_user"]))? $_POST["mchap_user"] : "";
					$mchap_passwd    = (isset($_POST["mchap_passwd"]))? $_POST["mchap_passwd"] : "";

					$ret = set_target_user($tgt_id,
											$local_user_arr, $domain_user_arr,
											$mchap_user, $mchap_passwd,
											$output);

				} else {
					break;
				}

				$pool      = isset($_POST["pool"])? $_POST["pool"] : "";
				$lun       = isset($_POST["lun"])? $_POST["lun"] : "";
				$size_mb   = isset($_POST["size_mb"])? $_POST["size_mb"] : NULL;
				/* [thin/dedup] 1 -> enable; 0 -> disable*/
				$thin      = isset($_POST["thin"])? (($_POST["thin"] == 1)? TRUE : FALSE) : NULL;
				$dedup     = isset($_POST["dedup"])? (($_POST["dedup"] == 1)? TRUE : FALSE) : NULL;
				/* [compress] enable -> on, disable -> off, gen_zero -> genericzero, zero_reclaim -> empty */
				$compress  = isset($_POST["compress"])? $_POST["compress"] : NULL;
				$blk_size  = isset($_POST["blk_size"])? $_POST["blk_size"] : NULL; /* integer */
				$copies    = isset($_POST["copies"])? $_POST["copies"] : NULL; /* integer */

				$target_id = isset($_POST["target_id"])? $_POST["target_id"] : NULL;
				$perm      = isset($_POST["perm"])? $_POST["perm"] : "rw";	/* Permission: ro, rw, deny */

				$output = "";

				$ret = create_iscsi_lun($pool, $lun, $size_mb, $thin,
									$dedup, $compress, $blk_size, $copies,
									$target_id, $perm,
									$output);

				if ($ret != 0) {
					break;
				}

				$ret = attach_iscsi_lun($pool, $lun, $tgt_id, 'rw', $output);
				break;

			case 'edit_iscsi_lun':
				$pool     = isset($_POST["pool"])? $_POST["pool"] : "";
				$lun      = isset($_POST["lun"])? $_POST["lun"] : "";
				$new_lun  = isset($_POST["new_lun"])? $_POST["new_lun"] : "";
				$size_mb  = isset($_POST["size_mb"])? $_POST["size_mb"] : NULL;

				/* [thin/dedup] 1 -> enable; 0 -> disable*/
				$thin     = isset($_POST["thin"])? (($_POST["thin"] == 1)? TRUE : FALSE) : NULL;
				$dedup    = isset($_POST["dedup"])? (($_POST["dedup"] == 1)? TRUE : FALSE) : NULL;
				/* [compress] enable -> on, disable -> off, gen_zero -> genericzero, zero_reclaim -> empty */
				$compress = isset($_POST["compress"])? $_POST["compress"] : NULL;
				$blk_size = isset($_POST["blk_size"])? $_POST["blk_size"] : NULL; /* integer */
				$copies   = isset($_POST["copies"])? $_POST["copies"] : NULL; /* integer */

				$ret = edit_iscsi_lun($pool, $lun, $new_lun, $size_mb, $thin,
									$dedup, $compress, $blk_size, $copies,
									$output);
				break;

			case 'delete_iscsi_lun':
				$pool     = isset($_POST["pool"])? $_POST["pool"] : "";
				$lun      = isset($_POST["lun"])? $_POST["lun"] : "";

				$ret = delete_iscsi_lun($pool, $lun, $output);
				break;

			case 'map_iscsi_lun';
				$pool      = isset($_POST["pool"])? $_POST["pool"] : "";
				$lun       = isset($_POST["lun"])? $_POST["lun"] : "";
				$target_id = isset($_POST["target_id"])? $_POST["target_id"] : NULL;

				$ret = attach_iscsi_lun($pool, $lun, $target_id, "rw", $output);
				break;

			case 'unmap_iscsi_lun':
				$target_id = isset($_POST["target_id"])? $_POST["target_id"] : NULL;
				$lun_id    = isset($_POST["lun_id"])? $_POST["lun_id"] : NULL;

				$ret = detach_iscsi_lun($target_id, $lun_id, $output);
				break;

			case 'add_lun_mask_policy':
				$target_id   = isset($_POST["target_id"])? $_POST["target_id"] : NULL;
				$lun_id      = isset($_POST["lun_id"])? $_POST["lun_id"] : NULL;
				$pool        = isset($_POST["pool"])? $_POST["pool"] : "";
				$lun         = isset($_POST["lun"])? $_POST["lun"] : "";
				$policy_name = isset($_POST["policy_name"])? $_POST["policy_name"] : "";
				$host        = isset($_POST["host"])? $_POST["host"] : "";
				$perm        = isset($_POST["perm"])? $_POST["perm"] : "";	/* Permission: ro, rw, deny */

				$ret = add_lun_mask_policy($target_id, $lun_id, $pool, $lun,
									$policy_name, $perm, $host, $output);
				break;

			case 'edit_lun_mask_policy':
				$target_id       = isset($_POST["target_id"])? $_POST["target_id"] : NULL;
				$lun_id          = isset($_POST["lun_id"])? $_POST["lun_id"] : NULL;
				$policy_name     = isset($_POST["policy_name"])? $_POST["policy_name"] : "";
				$new_policy_name = isset($_POST["new_policy_name"])? $_POST["new_policy_name"] : NULL;
				$host            = isset($_POST["host"])? $_POST["host"] : "";
				$perm            = isset($_POST["perm"])? $_POST["perm"] : "";	/* Permission: ro, rw, deny */

				$ret = edit_lun_mask_policy($target_id, $lun_id,
									$policy_name, $new_policy_name,
									$host, $perm, $output);
				break;

			case 'delete_lun_mask_policy':
				$target_id   = isset($_POST["target_id"])? $_POST["target_id"] : NULL;
				$lun_id      = isset($_POST["lun_id"])? $_POST["lun_id"] : NULL;
				$policy_name = isset($_POST["policy_name"])? $_POST["policy_name"] : "";

				$ret = delete_lun_mask_policy($target_id, $lun_id, $policy_name, $output);
				break;

			case 'set_general_setting':
				$iscsi_enable = (isset($_POST["iscsi_enable"]) && $_POST["iscsi_enable"] == 1)? TRUE : FALSE;
				$iscsi_port   = isset($_POST["iscsi_port"])? $_POST["iscsi_port"] : 3260;
				$isns_server  = isset($_POST["isns_server"])? $_POST["isns_server"] : "";

				$ret = set_iscsi_general($iscsi_enable, $iscsi_port, $isns_server, $output);
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
	$iscsi_arr  = array();
	$ret        = 0;

	if (isset($_GET["op"])) {
		switch ($_GET["op"]) {
			case 'get_general_setting':
				$iscsi_arr = get_iscsi_general();
				break;

			case 'get_target_node':
				$iscsi_arr = get_target_node();
				break;

			case 'get_lun':
				$query_unmap_lun = (isset($_GET["query_unmap_lun"]) && $_GET["query_unmap_lun"] == 1)? TRUE : FALSE;
				$query_filter    = ($query_unmap_lun)? QUERY_UNMAP_LUN : QUERY_ALL_LUN;
				$iscsi_arr       = get_iscsi_lun($query_filter);
				break;

			default:
				break;
		}

	} else {
		$iscsi_arr = get_iscsi_lun_map();
	}

	$chksum = md5(json_encode($iscsi_arr));
	if (isset($_GET["md5sum"]) && $chksum == $_GET["md5sum"]) {
		$iscsi_arr = NULL;
		$iscsi_arr = array();
	}

	$result_arr["success"] = ($ret == 0)? TRUE : FALSE;
	$result_arr["data"]    = $iscsi_arr;
	$result_arr["md5sum"]  = $chksum;
	echo json_encode($result_arr);
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
