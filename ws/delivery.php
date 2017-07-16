<?php
date_default_timezone_set('Africa/Lagos');

// Prepare the headers for JSON data
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
$_query = 1;
$_update = 2;
$_email = 3;

// Connect to server and select database

include '../config.php';

set_error_handler("customError");

$conn = new mysqli($php_server, $php_user, $php_password, $php_schema);
$conn->query("SET time_zone='+01:00';");

// Gets the stored procedure name from the user interface

$action = $_GET['action'];

log_this($action);

switch ($action) {
    case "deliverer_login":

        // It's gonna be a query

        $action_type = $_query;

        // Fill the variable with value from ui

        $email = $_GET['email'];
        $password = $_GET['password'];

        // Fill the query parameters
        $query = "deliverer_login('" . $email . "','" . $password . "')";

        break;

    case "delivery_get_orders":

        // It's gonna be a query

        $action_type = $_query;

        $deliverer_id = $_GET['deliverer_id'];
        // Fill the query parameters
        $query = "delivery_get_orders('" . $deliverer_id . "')";

        break;

    case "delivery_get_order":
    case "delivery_get_address":
    case "delivery_get_shops":

        // It's gonna be a query

        $action_type = $_query;

        $order_id = $_GET['order_id'];
        // Fill the query parameters
        $query = $action . "('" . $order_id . "')";

        break;

    case "delivery_get_shop_items":

        // It's gonna be a query

        $action_type = $_query;

        $order_id = $_GET['order_id'];
        $shop_id = $_GET['shop_id'];
        // Fill the query parameters
        $query = "delivery_get_shop_items('" . $order_id . "','" . $shop_id . "')";

        break;

    case "delivery_order_picked":
    case "delivery_order_delivered":
        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL " . $action . "(?)");

        // Bind parameters

        $stmt->bind_param("i", $order_id);

        // Assign values
        $order_id = $_GET['order_id'];

        break;
    case "update_deliverer_location":
        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL " . $action . "(?,?,?)");

        // Bind parameters

        $stmt->bind_param("idd", $deliverer_id, $lat, $lng);

        // Assign values
        $deliverer_id = $_GET['deliverer_id'];
        $lat = $_GET['lat'];
        $lng = $_GET['lng'];

        break;
}

switch ($action_type) {
    case $_query:

        $result = $conn->query('CALL ' . $query) or trigger_error($conn->error . "[$query]");
        $rowcount=mysqli_num_rows($result);
        $rows = array();
        if ($rowcount==0) {
            $rows[] = array("error"=>1,
                            "message"=>"No records available");
        } else {
            while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
                $rows[] = $row;
            }
        }
        $result->free();

        break;

    case $_update:

        $stmt->execute();
        $rows = array();
        stmt_bind_assoc($stmt, $row);
        while ($stmt->fetch()) {
            $rows[] = array_copy($row);
        }

        break;

}
$conn->close();

// Send data in JSON format back to the user interface

if ($action_type != '') {
    echo(json_encode($rows));
}

//if ($action_type != "") echo (json_encode(array("data"=>array_values($rows), "records"=>$rowcount)) );

session_write_close();
