<?php
require __DIR__ . '/config.php';
cdp_json([
  'ok'=>true,
  'clientKey'=>CDP_MIDTRANS_CLIENT_KEY,
  'mode'=>CDP_MIDTRANS_IS_PRODUCTION ? 'production' : 'sandbox',
  'monthlyPrice'=>CDP_MONTHLY_PRICE,
  'zipPrice'=>CDP_ZIP_PRICE,
  'configured'=>cdp_is_configured()
]);
?>
