<?php 

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

// Gets the stored procedure name from the user interface

$action = $_GET['action'];

switch ($action) {
    case "tickets_list":

        // It's gonna be a query

        $action_type = $_query;

        // Fill the variable with value from ui

        $page = $_GET['page'];
        $page_size = $_GET['page_size'];
        $search = $_GET['search'];

        // Fill the query parameters
        $query = "get_tickets_list(".$page.",".$page_size.",'".$search."')";
        break;

    case "get_title":

        // It's gonna be a query

        $action_type = $_query;

        // Fill the variable with value from ui

        $ticket_id = $_GET['ticket_id'];

        // Fill the query parameters
        $query = "get_ticket_title(".$ticket_id.")";
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
    case "change_priority":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL change_ticket_priority(?)");

        // Bind parameters

        $stmt->bind_param("i", $ticket_id);

        // Assign values
        $ticket_id = $_GET['ticket_id'];

        break;
    case "change_status":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL change_ticket_status(?)");

        // Bind parameters

        $stmt->bind_param("i", $ticket_id);

        // Assign values
        $ticket_id = $_GET['ticket_id'];

        break;
    case "change_responsible":

        // It's gonna be a database update

        $action_type = $_update;

        // Set the procedure we are going to use

        $stmt = $conn->prepare("CALL change_ticket_responsible(?)");

        // Bind parameters

        $stmt->bind_param("i", $ticket_id);

        // Assign values
        $ticket_id = $_GET['ticket_id'];

        break;
}

switch ($action_type) {
    case $_query:

        // Execute the stored procedure and store the data in $result
        //echo(json_encode($query));

        $result = $conn->query('CALL '.$query);

        // For each row save the field data and names in the array $rows[]

        while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
            $rows[] = $row;
        }

        // Release $result and $conn variables from memory

        $result->free();

        break;

    case $_update:

        // Execute as per assigned values
        //echo($query);
        //if(!$stmt->execute()) echo(json_encode($stmt->error));

        $stmt->execute();

        $stmt->close();


        // Always set content-type when sending HTML email
        $headers = "MIME-Version: 1.0"."\r\n";
        $headers .= "Content-type:text/html;charset=iso-8859-1"."\r\n";

        $email_style = "<!--[if gte mso 9]><style type='text/css'>* {letter-spacing: .4px;}body {font-family: Geneva, Arial, Helvetica, sans-serif;font-size: 9pt;color: #666;margin:0;padding:0;}table {width: 100%;border-collapse: collapse;}th {border-bottom: #aaa 1px solid;padding: 6px;color: #666;text-align: left;text-transform: uppercase;}td {padding: 6px;border-bottom: #ddd 1px solid;text-transform: uppercase;}tt{font-size: 14pt;font-weight: bold;color: #006699;}</style><![endif]--><style type='text/css'>* {letter-spacing: .4px;}body {font-family: Geneva, Arial, Helvetica, sans-serif;font-size: 9pt;color: #666;}table {border-collapse: collapse;}th {border-bottom: #aaa 1px solid;padding: 6px;color: #666;text-align: left;text-transform: uppercase;background-color: #fff;}td {padding: 6px;border-bottom: #ddd 1px solid;text-transform: uppercase;}tt{font-size: 14pt;font-weight: bold;color: #006699;}.red{color:red;font-weight: bold;}.blue{color:darkblue;font-weight: bold;}</style>";

        // More headers and the BCC to me
        $headers .= 'From: <noreply@escng.com>'."\r\n";
        $headers .= "BCC: omar.melendrez@escng.com"."\r\n";
        //$headers .= 'Cc: claudio.melendrez@gmail.com'."\r\n";

        switch ($action) {
            case 'change_priority':
                $executed_task = 'Priority changed';
                break;
            case 'change_status':
                $executed_task = 'Status changed';
                break;
            case 'change_responsible':
                $executed_task = 'Responsible changed';
                break;
        }

        if ($action == 'save_ticket') {
            $subject = "escng user support - new ticket launched";
            $message = "Dear <b>Omar</b>:<br/> <br/> This is to inform there a new ticket has been launched by <span class='red'>".$email_address."</span>";
            $message = $message."<br/><br/><hr style='color: #ccc;background-color: #ccc;height: 2px;'>";
            $message = $message."<span class='blue'>".$title."</strong>";
            $message = $message."<br/>";
            $message = $message.$comment;
            $message = $message."<br/><br/><hr style='color: #ccc;background-color: #ccc;height: 2px;'>";
        } else {
            $subject = "escng user support - ticked updated";
            $message = "Dear <b>Omar</b>:<br/> <br/> This is to inform there were changes in ticket # ".$ticket_id.": <span class='red'>".$executed_task."</span>";
        }
        $message = $message."<br/><br/>Have a look at the ticket at <a href='http://support.escng.com/admin'>support.escng.com</a>";
        $message = $message."<br/><br/><hr style='color: #6699cc;background-color: #6699cc;height: 5px;'>";

        $to = "omar.melendrez@escng.com";

        // Create message


        //echo($message);

        //$conn = new mysqli($php_server, $php_user, $php_password, $php_schema);

        // Initialize $smtp

        //$stmt = $conn -> stmt_init();

        // Set the procedure we are going to use
        //$stmt -> prepare("call add_email(?)");

        // Bind parameters

        //$stmt -> bind_param("s", $message);

        // Execute as per assigned values

        //$stmt -> execute();

        // Create the message with html style

        $body = "<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'><title>escng user support</title></head>".$email_style."<body>".$message."</body></html>";

        // Let's send the email

        mail($to, $subject, $body, $headers);

        break;
}

$conn->close();

// Send data in JSON format back to the user interface

if ($action_type == $_query) echo(json_encode($rows));
else echo(json_encode("Ok"));
?>