<?php 
set_error_handler("customError");
date_default_timezone_set('Africa/Lagos');
ini_set('html_errors', false);
// Debug area
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(-1);

// Prepare the headers for JSON data

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
$_query = 1;
$_update = 2;

// Connect to server and select database

require '../config.php';

$conn = new mysqli($php_server, $php_user, $php_password, $php_schema);
$conn->query("SET time_zone='+01:00';");

// Gets the stored procedure name from the user interface

$action = $_GET['action'];

log_this($action);

switch ($action) {
    case "login":

        // It's gonna be a query

        $action_type = $_query;

        // Fill the variable with value from ui

        $email = $_GET['email'];
        $password = $_GET['password'];

        // Fill the query parameters
        $query = "login('" . $email . "','" . $password . "')";

        break;

    case "get_token":

        // It's gonna be a query

        $action_type = $_query;

        // Fill the query parameters
        $query = "get_token()";

        break;

    case "products_list":

        // It's gonna be a query

        $action_type = $_query;
        $search = $_GET['search'];

        // Fill the query parameters
        $query = "products_list('" . $search . "')";

        break;

    case "get_total_basket":

        // It's gonna be a query

        $action_type = $_query;
        $token = $_GET['token'];

        // Fill the query parameters
        $query = "get_total_basket('" . $token . "')";

        break;

    case "save_item":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL add_item(?, ?, ?)");

        // Bind parameters

        $stmt->bind_param("sii", $token, $product_id, $quantity);

        // Assign values
        $token = $_GET['token'];
        $product_id = $_GET['product_id'];
        $quantity = $_GET['quantity'];

        break;
    case "save_ticket":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL add_ticket(?, ?, ?, ?, ?, ?, ?)");

        // Bind parameters

        $stmt->bind_param("siiisss", $email_address, $app_id, $type_id, $priority_id, $title, $comment, $notify);

        // Assign values
        $email_address = $_GET['email_address'];
        $app_id = $_GET['app_id'];
        $type_id = $_GET['type_id'];
        $priority_id = $_GET['priority_id'];
        $title = $_GET['title'];
        $comment = $_GET['comment'];
        $notify = $_GET['notify'];

        break;
}

switch ($action_type) {
    case $_query:
    
        $result = $conn->query('CALL ' . $query) or trigger_error($conn->error . "[$query]");

        // $rows = [];

        $rows = array();
        while ($row = $result->fetch_array(MYSQLI_ASSOC))
            {
            $rows[] = $row;
            }

        $result->free();

        break;

    case $_update:

        $stmt->execute();
        $rows = array();
        stmt_bind_assoc($stmt, $row);
        while ($stmt->fetch())
            {
            $rows[] = array_copy($row);
            }

        break;
}

$conn->close();

// Send data in JSON format back to the user interface

if ($action_type != "") echo (json_encode($rows));

function stmt_bind_assoc(&$stmt, &$bound_assoc)
    {
    $metadata = $stmt->result_metadata();
    $fields = array();
    $bound_assoc = array();
    $fields[] = $stmt;
    while ($field = $metadata->fetch_field())
        {
        $fields[] = & $bound_assoc[$field->name];
        }

    call_user_func_array("mysqli_stmt_bind_result", $fields);
    }

function array_copy(array $array)
    {
    $result = array();
    foreach($array as $key => $val)
        {
        if (is_array($val))
            {
            $result[$key] = arrayCopy($val);
            }
        elseif (is_object($val))
            {
            $result[$key] = clone $val;
            }
          else
            {
            $result[$key] = $val;
            }
        }

    return $result;
    }
// Debug area
function customError($errno, $errstr) {
  log_this("Error: [$errno] $errstr", "err");
  die();
}

function log_this($content = '', $type = "log"){
    $log  = date("d-m-y H:i:s") . PHP_EOL;
    $log  .= "user: " . $_SERVER['REMOTE_ADDR'] . PHP_EOL;
//  $log  .= "Browser: " . $_SERVER['HTTP_USER_AGENT'] . PHP_EOL;
    foreach($_GET as $key => $value)
    {
        $log .= $key . ': ' . $value . PHP_EOL;
    }
     if(strlen($content) > 0)
    $log .= $content . PHP_EOL;
    $log .= "-------------------------" . PHP_EOL;
    file_put_contents('../logs/usr_' . date("ymd") . '.txt', $_SERVER['REMOTE_ADDR'] .' ' . date("d-m-y H:i:s") . ' '.  $_GET['action'] . PHP_EOL, FILE_APPEND);
    file_put_contents('../logs/' . $type . '_' . date("ymd") . '.txt', $log, FILE_APPEND);
}

session_write_close();

?>