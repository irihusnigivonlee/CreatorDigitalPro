<?php
require __DIR__ . '/config.php';
$notif = json_decode(file_get_contents('php://input'), true);
if(!is_array($notif)) cdp_json(['ok'=>false,'message'=>'Invalid notification'],400);
$order_id = $notif['order_id'] ?? '';
$status_code = $notif['status_code'] ?? '';
$gross_amount = $notif['gross_amount'] ?? '';
$signature = $notif['signature_key'] ?? '';
$expected = hash('sha512', $order_id . $status_code . $gross_amount . CDP_MIDTRANS_SERVER_KEY);
if(!$order_id || !$signature || !hash_equals($expected, $signature)) cdp_json(['ok'=>false,'message'=>'Invalid signature'],403);
$transaction_status = strtolower($notif['transaction_status'] ?? '');
$fraud_status = strtolower($notif['fraud_status'] ?? 'accept');
$orders = cdp_load_orders();
if(!isset($orders[$order_id])) cdp_json(['ok'=>false,'message'=>'Order not found'],404);
$isPaid = in_array($transaction_status, ['settlement','capture'], true) && $fraud_status === 'accept' && $status_code === '200';
if($isPaid){
  $orders[$order_id]['status'] = 'paid';
  $orders[$order_id]['paid'] = true;
  $orders[$order_id]['paid_at'] = date('c');
  if(empty($orders[$order_id]['license_key'])) $orders[$order_id]['license_key'] = cdp_license_key($orders[$order_id]['email']);
  $orders[$order_id]['expires_at'] = date('c', strtotime('+30 days'));
}else{
  $orders[$order_id]['status'] = $transaction_status ?: 'pending';
}
$orders[$order_id]['last_notification'] = $notif;
cdp_save_orders($orders);
cdp_json(['ok'=>true]);
?>
