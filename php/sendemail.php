<?php
var_dump($_POST);
$name       = $_POST['name'];
$from       = $_POST['email']; 
$subject    = $_POST['subject']; 
$message    = $_POST['message']; 
$to	= 'similabs@gmail.com';//replace with your email

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type: text/plain; charset=iso-8859-1" . "\r\n";
$headers .= "From: {$name} <{$from}>" . "\r\n";
$headers .= "Reply-To: <{$from}>" . "\r\n";
$headers .= "Subject: {$subject}" . "\r\n";
$headers .= "X-Mailer: PHP/".phpversion() . "\r\n"; 

mail($to, $subject, $message, $headers);

die;
