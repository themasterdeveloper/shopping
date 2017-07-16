<?php
$to = $_SESSION['email'];
$subject = $_SESSION['subject'];
$body = $_SESSION['body'];
$headers = $_SESSION['headers'];
mail($to, $subject, $body, $headers);
?>
