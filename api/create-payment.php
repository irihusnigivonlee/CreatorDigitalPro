<?php
require __DIR__ . '/config.php';

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);
if(!is_array($input)) cdp_json(['ok'=>false,'message'=>'Payload tidak valid'],400);
if(!cdp_is_configured()) cdp_json(['ok'=>false,'message'=>'Midtrans belum aktif. Isi MIDTRANS_SERVER_KEY dan MIDTRANS_CLIENT_KEY di api/config.php atau ENV hosting.'],500);

$plan = $input['plan'] ?? 'starter';
$buyer = $input['buyer'] ?? [];
$name = trim($buyer['name'] ?? 'Creator');
$email = trim($buyer['email'] ?? '');
$phone = trim($buyer['phone'] ?? '');
if(!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) cdp_json(['ok'=>false,'message'=>'Email aktif wajib diisi'],422);

$plans = [
  'starter' => ['name'=>'Starter 9K','price'=>CDP_STARTER_PRICE,'duration_days'=>30],
  'pro' => ['name'=>'Creator Pro 49K','price'=>CDP_PRO_PRICE,'duration_days'=>30],
  'premium' => ['name'=>'Premium 99K','price'=>CDP_PREMIUM_PRICE,'duration_days'=>30]
];
if(!isset($plans[$plan])) cdp_json(['ok'=>false,'message'=>'Paket tidak ditemukan'],404);
$item = $plans[$plan];
$order_id = 'CDP-' . date('YmdHis') . '-' . strtoupper(substr(bin2hex(random_bytes(3)),0,6));
$base = cdp_base_url();

$payload = [
  'transaction_details' => ['order_id'=>$order_id, 'gross_amount'=>$item['price']],
  'item_details' => [[ 'id'=>$plan, 'price'=>$item['price'], 'quantity'=>1, 'name'=>$item['name'] ]],
  'customer_details' => ['first_name'=>$name, 'email'=>$email, 'phone'=>$phone],
  'callbacks' => ['finish' => $base . '/pages/success.html?order_id=' . urlencode($order_id)]
];

$ch = curl_init(cdp_snap_url());
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => ['Content-Type: application/json','Accept: application/json','Authorization: Basic ' . base64_encode(CDP_MIDTRANS_SERVER_KEY . ':')],
  CURLOPT_POSTFIELDS => json_encode($payload),
  CURLOPT_TIMEOUT => 30
]);
$response = curl_exec($ch);
$http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);
if($error) cdp_json(['ok'=>false,'message'=>'Koneksi Midtrans gagal: '.$error],500);
$data = json_decode($response, true);
if($http < 200 || $http >= 300 || empty($data['token'])){
  cdp_json(['ok'=>false,'message'=>'Midtrans menolak transaksi. Periksa Server Key dan mode sandbox/production.','midtrans'=>$data],500);
}

$orders = cdp_load_orders();
$orders[$order_id] = [
  'order_id'=>$order_id,'plan'=>$plan,'plan_name'=>$item['name'],'amount'=>$item['price'],'name'=>$name,'email'=>$email,'phone'=>$phone,
  'status'=>'pending','paid'=>false,'license_key'=>null,'created_at'=>date('c'),'expires_at'=>null,'snap_token'=>$data['token']
];
cdp_save_orders($orders);
cdp_json(['ok'=>true,'order_id'=>$order_id,'token'=>$data['token'],'redirect_url'=>$data['redirect_url'] ?? null]);
?>
