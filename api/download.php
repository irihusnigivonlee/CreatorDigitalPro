<?php
require __DIR__ . '/config.php';
$order_id = $_GET['order_id'] ?? '';
$orders = cdp_load_orders();
if(!$order_id || !isset($orders[$order_id])) { http_response_code(403); exit('Order tidak ditemukan.'); }
$o = $orders[$order_id];
if(empty($o['paid']) || $o['plan'] !== 'zip') { http_response_code(403); exit('Akses download hanya untuk pembeli paket ZIP yang sudah lunas.'); }
if(!file_exists(CDP_PRODUCT_ZIP)) { http_response_code(404); exit('File ZIP produk belum dipasang di private/downloads/CreatorDigitalPro_Product.zip'); }
header('Content-Type: application/zip');
header('Content-Disposition: attachment; filename="CreatorDigitalPro-' . preg_replace('/[^A-Za-z0-9_-]/','',$order_id) . '.zip"');
header('Content-Length: ' . filesize(CDP_PRODUCT_ZIP));
readfile(CDP_PRODUCT_ZIP);
exit;
?>
