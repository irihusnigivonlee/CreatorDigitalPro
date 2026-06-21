<?php
require __DIR__ . '/config.php';

function cdp_clean_domain($domain){
  $domain = strtolower(trim((string)$domain));
  $domain = preg_replace('#^https?://#','',$domain);
  $domain = preg_replace('#/.*$#','',$domain);
  $domain = preg_replace('#:\d+$#','',$domain);
  return $domain ?: 'localhost';
}

function cdp_is_local_domain($domain){
  return in_array($domain, ['localhost','127.0.0.1','::1','0.0.0.0'], true) || str_ends_with($domain, '.local');
}

$input = json_decode(file_get_contents('php://input'), true);
if(!is_array($input)) cdp_json(['ok'=>false,'message'=>'Payload tidak valid'],400);

$license = strtoupper(trim($input['license_key'] ?? $input['license'] ?? ''));
$email = strtolower(trim($input['email'] ?? ''));
$domain = cdp_clean_domain($input['domain'] ?? ($_SERVER['HTTP_HOST'] ?? 'localhost'));

if(!$license) cdp_json(['ok'=>false,'message'=>'License key wajib diisi'],422);

$orders = cdp_load_orders();
$foundId = null;
foreach($orders as $id => $order){
  if(strtoupper($order['license_key'] ?? '') === $license){ $foundId = $id; break; }
}
if(!$foundId) cdp_json(['ok'=>false,'message'=>'License key tidak ditemukan'],404);

$order = $orders[$foundId];
if(empty($order['paid'])) cdp_json(['ok'=>false,'message'=>'License belum aktif karena pembayaran belum lunas'],403);
if(!empty($order['expires_at']) && strtotime($order['expires_at']) < time()) cdp_json(['ok'=>false,'status'=>'expired','message'=>'License sudah expired. Silakan perpanjang akses.'],403);
if($email && strtolower($order['email'] ?? '') !== $email) cdp_json(['ok'=>false,'message'=>'Email tidak sesuai dengan license'],403);

$now = date('c');
$isLocal = cdp_is_local_domain($domain);
$bound = $order['activated_domain'] ?? '';

if(!$isLocal){
  if(!$bound){
    $orders[$foundId]['activated_domain'] = $domain;
    $orders[$foundId]['activated_at'] = $now;
  }elseif($bound !== $domain){
    cdp_json(['ok'=>false,'message'=>'License sudah aktif di domain lain: '.$bound],403);
  }
}

$orders[$foundId]['last_license_check_at'] = $now;
$orders[$foundId]['last_license_check_domain'] = $domain;
cdp_save_orders($orders);

cdp_json([
  'ok'=>true,
  'status'=>'active',
  'message'=>$isLocal ? 'License aktif untuk localhost/development' : 'License aktif untuk domain '.$domain,
  'license_key'=>$license,
  'email'=>$order['email'] ?? '',
  'plan'=>$order['plan'] ?? '',
  'plan_name'=>$order['plan_name'] ?? '',
  'domain'=>$isLocal ? ($bound ?: 'localhost') : $domain,
  'activated_domain'=>$orders[$foundId]['activated_domain'] ?? null,
  'expires_at'=>$order['expires_at'] ?? null
]);
?>
