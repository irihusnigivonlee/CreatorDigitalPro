<?php
require __DIR__ . '/config.php';
cdp_json([
  'ok'=>true,
  'clientKey'=>CDP_MIDTRANS_CLIENT_KEY,
  'mode'=>CDP_MIDTRANS_IS_PRODUCTION ? 'production' : 'sandbox',
  'starterPrice'=>CDP_STARTER_PRICE,
  'proPrice'=>CDP_PRO_PRICE,
  'premiumPrice'=>CDP_PREMIUM_PRICE,
  'configured'=>cdp_is_configured()
]);
?>
