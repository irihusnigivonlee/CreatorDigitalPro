<?php
require __DIR__ . '/config.php';
function cdp_clean_domain_check($domain){
  $domain = strtolower(trim((string)$domain));
  $domain = preg_replace('#^https?://#','',$domain);
  $domain = preg_replace('#/.*$#','',$domain);
  $domain = preg_replace('#:\d+$#','',$domain);
  return $domain ?: 'localhost';
}
function cdp_is_local_domain_check($domain){
  return in_array($domain, ['localhost','127.0.0.1','::1','0.0.0.0'], true) || str_ends_with($domain, '.local');
}
$license = strtoupper(trim($_GET['license_key'] ?? $_GET['license'] ?? ''));
$domain = cdp_clean_domain_check($_GET['domain'] ?? ($_SERVER['HTTP_HOST'] ?? 'localhost'));
if(!$license) cdp_json(['ok'=>false,'message'=>'License key wajib diisi'],422);
$orders = cdp_load_orders();
foreach($orders as $id => $order){
  if(strtoupper($order['license_key'] ?? '') === $license){
    if(empty($order['paid'])) cdp_json(['ok'=>false,'status'=>'unpaid','message'=>'Pembayaran belum lunas'],403);
    if(!empty($order['expires_at']) && strtotime($order['expires_at']) < time()) cdp_json(['ok'=>false,'status'=>'expired','message'=>'License sudah expired. Silakan perpanjang akses.'],403);
    $bound = $order['activated_domain'] ?? '';
    $isLocal = cdp_is_local_domain_check($domain);
    if(!$isLocal && $bound && $bound !== $domain){
      cdp_json(['ok'=>false,'status'=>'domain_mismatch','message'=>'License aktif di domain lain: '.$bound],403);
    }
    $orders[$id]['last_license_check_at'] = date('c');
    $orders[$id]['last_license_check_domain'] = $domain;
    cdp_save_orders($orders);
    cdp_json(['ok'=>true,'status'=>'active','license_key'=>$license,'domain'=>$bound ?: ($isLocal ? 'localhost' : $domain),'plan'=>$order['plan'] ?? '', 'plan_name'=>$order['plan_name'] ?? '', 'email'=>$order['email'] ?? '', 'expires_at'=>$order['expires_at'] ?? null]);
  }
}
cdp_json(['ok'=>false,'status'=>'not_found','message'=>'License tidak ditemukan'],404);
?>
