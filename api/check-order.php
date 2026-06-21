<?php
require __DIR__ . '/config.php';
$order_id = $_GET['order_id'] ?? '';
$orders = cdp_load_orders();
if(!$order_id || !isset($orders[$order_id])) cdp_json(['ok'=>false,'message'=>'Order tidak ditemukan'],404);
$o = $orders[$order_id];
cdp_json(['ok'=>true,'paid'=>!empty($o['paid']),'status'=>$o['status'] ?? 'pending','plan'=>$o['plan'],'plan_name'=>$o['plan_name'],'name'=>$o['name'],'email'=>$o['email'],'license_key'=>$o['license_key'] ?? null,'expires_at'=>$o['expires_at'] ?? null]);
?>
