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
	$pool_arr   = array();
	$ret        = 0;
	$output     = "";

	if (isset($_POST["op"])) {
		switch ($_POST["op"]) {
			case 'pool_create':
				$pool_name = isset($_POST["name"])? $_POST["name"] : "";
				$pd_id_arr = json_decode($_POST["raid_pd_id"], TRUE);
				if (isset($_POST["spare_pd_id"])) {
					$spare_id_arr = json_decode($_POST["spare_pd_id"], TRUE);
				} else {
					$spare_id_arr = array();
				}
				$raid_level         = isset($_POST["raid_level"])? $_POST["raid_level"] : "raid0";
				$is_home_pool       = isset($_POST["is_home_pool"])? TRUE : FALSE;
				$encrypt_type       = isset($_POST["encrypt_type"])? $_POST["encrypt_type"] : ENCRYPT_DISABLE_STR;
				$encrypt_passwd_x   = isset($_POST["encrypt_passwd_x"])? $_POST["encrypt_passwd_x"] : "";
				$enable_write_cache = isset($_POST["pd_prop_write_cache"])?
							(($_POST["pd_prop_write_cache"] == 1)? TRUE : FALSE) : TRUE;

				$ret = pool_create($pool_name,
								$raid_level, $pd_id_arr, $spare_id_arr,
								$is_home_pool, $encrypt_type, $encrypt_passwd_x,
								$output);

				if ($ret == 0) {
					$ret = pool_set_prop($pool_name,
								$enable_write_cache, TRUE, TRUE, 0,
								$output);
				}
				break;

			case 'pool_delete':
				$pool_name = isset($_POST["name"])? $_POST["name"] : "";

				$ret = pool_delete($pool_name, $output);
				break;

			case 'pool_expand':
				$pool_name    = isset($_POST["name"])? $_POST["name"] : "";
				$pd_id_arr    = json_decode($_POST["raid_pd_id"], TRUE);
				$raid_level   = isset($_POST["raid_level"])? $_POST["raid_level"] : 0;
				$enable_write_cache = isset($_POST["pd_prop_write_cache"])?
							(($_POST["pd_prop_write_cache"] == 1)? TRUE : FALSE) : TRUE;

				$ret = pool_expand($pool_name, $pd_id_arr, $raid_level, $enable_write_cache, $output);
				break;

			case 'pool_add_spare':
				$pool_name    = isset($_POST["name"])? $_POST["name"] : "";
				$spare_pd_arr = json_decode($_POST["spare_pd_id"], TRUE);

				$ret = pool_add_spare($pool_name, $spare_pd_arr, $output);
				break;

			case 'pool_delete_spare':
				$pool_name    = isset($_POST["name"])? $_POST["name"] : "";
				$spare_pd_arr = json_decode($_POST["spare_pd_id"], TRUE);

				$ret = pool_delete_spare($pool_name, $spare_pd_arr, $output);
				break;

			case 'pool_set_system_volume':
				$pool_name = isset($_POST["name"])? $_POST["name"] : "";

				$ret = pool_set_system_volume($pool_name, $output);
				break;

			case 'pool_set_prop':
				$pool_name          = isset($_POST["name"])? $_POST["name"] : "";
				$enable_write_cache = isset($_POST["pd_prop_write_cache"])?
							(($_POST["pd_prop_write_cache"] == 1)? TRUE : FALSE) : TRUE;

				$ret = pool_set_prop($pool_name,
								$enable_write_cache, TRUE, TRUE, 0,
								$output);

				if ($ret == 0 && isset($_POST["encrypt_type"])) {
					$pool_guid        = $_POST["pool_guid"];
					$encrypt_type     = $_POST["encrypt_type"];
					$encrypt_passwd_x = isset($_POST["encrypt_passwd_x"])? $_POST["encrypt_passwd_x"] : "";

					$ret = pool_set_encrypt($pool_name, $pool_guid,
								$encrypt_type, $encrypt_passwd_x,
								$output);
				}
				if (isset($_POST["rm_spare_pd_id"])) {
					$rm_spare_pd_arr = json_decode($_POST["rm_spare_pd_id"], TRUE);
					$ret = pool_delete_spare($pool_name, $rm_spare_pd_arr, $errmsg);
					if ($ret != 0) {
						if ($output != "")
							$output .= "\n";
						$output .= $errmsg;
					}
				}
				if (isset($_POST["spare_pd_id"])) {
					$spare_pd_arr = json_decode($_POST["spare_pd_id"], TRUE);
					$ret = pool_add_spare($pool_name, $spare_pd_arr, $errmsg);
					if ($ret != 0) {
						if ($output != "")
							$output .= "\n";
						$output .= $errmsg;
					}
				}
				break;

			case 'pool_set_encrypt':
				$pool_name        = isset($_POST["name"])? $_POST["name"] : "";
				$pool_guid        = isset($_POST["pool_guid"])? $_POST["pool_guid"] : "";
				$encrypt_type     = isset($_POST["encrypt_type"])? $_POST["encrypt_type"] : ENCRYPT_DISABLE_STR;
				$encrypt_passwd_x = isset($_POST["encrypt_passwd_x"])? $_POST["encrypt_passwd_x"] : "";

				$ret = pool_set_encrypt($pool_name, $pool_guid,
								$encrypt_type, $encrypt_passwd_x,
								$output);
				break;

			case 'pool_unlock':
				if (isset($_FILES["key_file"]["name"]) &&
					isset($_FILES["key_file"]["tmp_name"])) {
					/* Key file upload */
					$file_name = $_FILES["key_file"]["name"];
					$tmp_name  = $_FILES["key_file"]["tmp_name"];

					$ret = pool_import_encrypt_key($tmp_name, $output);

				} else {
					$pool_name        = isset($_POST["name"])? $_POST["name"] : "";
					$pool_guid        = isset($_POST["pool_guid"])? $_POST["pool_guid"] : "";
					$encrypt_passwd_x = isset($_POST["encrypt_passwd_x"])? $_POST["encrypt_passwd_x"] : "";

					$ret = pool_unlock($pool_name, $pool_guid,
								$encrypt_passwd_x, $output);
				}
				break;

			case 'pool_export_encrypt_key':
				$is_https = FALSE;
				if (isset($_SERVER["HTTP_REFERER"]) &&
					strncmp($_SERVER["HTTP_REFERER"], "https", 5) == 0) {
					$is_https = TRUE;
				}
				$pool_id = isset($_POST["pool_guid"])? $_POST["pool_guid"] : "";

				$ret = pool_export_encrypt_key($pool_id, $is_https, $output);
				if ($ret == 0) {
					exit;
				}
				break;

			case 'pool_set_usage_notice':
				$pool_name = isset($_POST["pool_name"])? $_POST["pool_name"] : "";

				if (isset($_POST["enable"]) && $_POST["enable"] == 1) {
					$info_level = isset($_POST["info_level"])? $_POST["info_level"] : 80;
					$warn_level = isset($_POST["warn_level"])? $_POST["warn_level"] : 90;

					$ret = pool_enable_usage_notice($pool_name,
											$info_level, $warn_level,
											$output);

				} else {
					$ret = pool_disable_usage_notice($pool_name, $output);
				}
				break;

			case 'pool_start_scrub':
				$pool_name = isset($_POST["pool_name"])? $_POST["pool_name"] : "";

				$ret = pool_start_scrub($pool_name, $output);
				break;

			case 'pool_stop_scrub':
				$pool_name = isset($_POST["pool_name"])? $_POST["pool_name"] : "";

				$ret = pool_stop_scrub($pool_name, $output);
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
	$pool_arr   = array();
	$ret        = 0;

	if (isset($_GET["op"])) {
		switch ($_GET["op"]) {
			default:
				break;
		}

	} else {
		$pool_arr = get_pool();
	}

	$chksum = md5(json_encode($pool_arr));
	if (isset($_GET["md5sum"]) && $chksum == $_GET["md5sum"]) {
		$pool_arr = NULL;
		$pool_arr = array();
	}

	$result_arr["success"] = ($ret == 0)? TRUE : FALSE;
	$result_arr["data"]    = $pool_arr;
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
