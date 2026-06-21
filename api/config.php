<?php
/* =========================================================
   CreatorDigitalPro - Server Config Hosting Ready
   ---------------------------------------------------------
   Cara aman:
   1. Jangan simpan SERVER_KEY di file JavaScript.
   2. Simpan SERVER_KEY di sini atau ENV hosting.
   3. Untuk live production, ubah mode ke true dan pakai key production.
========================================================= */

function cdp_env($key, $default=''){
  $val = getenv($key);
  return $val !== false && $val !== '' ? $val : $default;
}

// GANTI DENGAN KEY MILIK ANDA / SET DI ENV HOSTING
if(!defined('CDP_MIDTRANS_SERVER_KEY')) define('CDP_MIDTRANS_SERVER_KEY', cdp_env('MIDTRANS_SERVER_KEY', 'ISI_SERVER_KEY_MIDTRANS_ANDA'));
if(!defined('CDP_MIDTRANS_CLIENT_KEY')) define('CDP_MIDTRANS_CLIENT_KEY', cdp_env('MIDTRANS_CLIENT_KEY', 'ISI_CLIENT_KEY_MIDTRANS_ANDA'));
if(!defined('CDP_MIDTRANS_IS_PRODUCTION')) define('CDP_MIDTRANS_IS_PRODUCTION', filter_var(cdp_env('MIDTRANS_IS_PRODUCTION', 'false'), FILTER_VALIDATE_BOOLEAN));

// Harga dan produk
if(!defined('CDP_STORE_NAME')) define('CDP_STORE_NAME', 'CreatorDigitalPro');
if(!defined('CDP_MONTHLY_PRICE')) define('CDP_MONTHLY_PRICE', 9000);
if(!defined('CDP_ZIP_PRICE')) define('CDP_ZIP_PRICE', 39000);

// File storage. Untuk shared hosting, folder ini wajib writable.
if(!defined('CDP_ORDERS_FILE')) define('CDP_ORDERS_FILE', __DIR__ . '/../storage/orders.json');
if(!defined('CDP_PRODUCT_ZIP')) define('CDP_PRODUCT_ZIP', __DIR__ . '/../private/downloads/CreatorDigitalPro_Product.zip');

function cdp_snap_url(){
  return CDP_MIDTRANS_IS_PRODUCTION
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';
}

function cdp_is_configured(){
  return CDP_MIDTRANS_SERVER_KEY && CDP_MIDTRANS_CLIENT_KEY &&
    strpos(CDP_MIDTRANS_SERVER_KEY, 'ISI_') !== 0 && strpos(CDP_MIDTRANS_CLIENT_KEY, 'ISI_') !== 0;
}

function cdp_load_orders(){
  if(!file_exists(CDP_ORDERS_FILE)) return [];
  $json = file_get_contents(CDP_ORDERS_FILE);
  $data = json_decode($json, true);
  return is_array($data) ? $data : [];
}

function cdp_save_orders($orders){
  $dir = dirname(CDP_ORDERS_FILE);
  if(!is_dir($dir)) mkdir($dir, 0755, true);
  file_put_contents(CDP_ORDERS_FILE, json_encode($orders, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

function cdp_json($data, $code=200){
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data, JSON_UNESCAPED_SLASHES);
  exit;
}

function cdp_base_url(){
  $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
  $scheme = $https ? 'https' : 'http';
  $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
  $script = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
  $root = preg_replace('#/api$#', '', $script);
  return rtrim($scheme . '://' . $host . $root, '/');
}

function cdp_license_key($email){
  return 'CDP-' . strtoupper(substr(hash('sha256', $email . microtime(true) . random_int(1000,9999)),0,4)) . '-' . strtoupper(substr(hash('sha256', random_int(1000,9999) . $email),0,4)) . '-' . strtoupper(substr(hash('sha256', time() . $email),0,4));
}
?>
