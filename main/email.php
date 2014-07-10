<?php
// PHP email 
$emailTo = $_POST['emailto']; 
$websitename = $_POST['websitename']; 

$name = $_POST['form-name'];
$subject = $_POST['form-subject']; if($subject == '') { $subject = "Message from $websitename contact form"; }
$message = $_POST['form-message'];
$email = $_POST['form-email'];

$body = "Name: $name \n\nEmail: $email \n\nSubject: $subject \n\nMessage:\n $message";
$headers = 'From: '.$websitename.' <'.$emailTo.'>' . "\r\n" . 'Reply-To: ' . $email;

mail($emailTo, $subject, $body, $headers);
$emailSent = true;

?>