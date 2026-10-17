/**
 * ARTSINLY Transactional Email Notification Service
 * Dispatches beautifully styled notification emails for orders, payments, and shipments.
 */

export interface OrderEmailItem {
  title: string;
  quantity: number;
  pricePaise: number;
}

export interface SendOrderConfirmationParams {
  orderNumber: string;
  buyerEmail: string;
  buyerName: string;
  items: OrderEmailItem[];
  totalPaise: number;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
}

export interface SendSellerOrderAlertParams {
  sellerEmail: string;
  sellerName: string;
  orderNumber: string;
  items: OrderEmailItem[];
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export interface SendShipmentDispatchedParams {
  orderNumber: string;
  buyerEmail: string;
  buyerName: string;
  carrier: string;
  trackingNumber: string;
}

function formatINR(paise: number): string {
  return "₹" + (paise / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * 1. Send Order Confirmation Email to Buyer
 */
export async function sendOrderConfirmationEmail(params: SendOrderConfirmationParams) {
  const { orderNumber, buyerEmail, buyerName, items, totalPaise, shippingAddress } = params;

  const subject = `Order Confirmed: ${orderNumber} | ARTSINLY Certified Heritage`;
  const itemsText = items
    .map((item) => `- ${item.quantity}x ${item.title} (${formatINR(item.pricePaise * item.quantity)})`)
    .join("\n");

  console.log(`\n============================================================`);
  console.log(`✉️  [TRANSACTIONAL EMAIL] Order Confirmation Dispatched`);
  console.log(`To: ${buyerEmail} (${buyerName})`);
  console.log(`Subject: ${subject}`);
  console.log(`Order Number: ${orderNumber}`);
  console.log(`Items:\n${itemsText}`);
  console.log(`Total: ${formatINR(totalPaise)}`);
  console.log(`Deliver to: ${shippingAddress.fullName}, ${shippingAddress.addressLine1}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.postalCode}`);
  console.log(`Status: Delivered to Sandbox Notification Log`);
  console.log(`============================================================\n`);

  return { success: true, messageId: `msg_order_${orderNumber}_${Date.now()}` };
}

/**
 * 2. Send New Order Alert to Seller/Artisan
 */
export async function sendSellerOrderAlertEmail(params: SendSellerOrderAlertParams) {
  const { sellerEmail, sellerName, orderNumber, items, shippingAddress } = params;

  const subject = `New Atelier Order Received: ${orderNumber} | Prepare Handcrafted Piece`;
  const itemsText = items
    .map((item) => `- ${item.quantity}x ${item.title}`)
    .join("\n");

  console.log(`\n============================================================`);
  console.log(`✉️  [TRANSACTIONAL EMAIL] Seller Order Alert Dispatched`);
  console.log(`To Artisan: ${sellerEmail} (${sellerName})`);
  console.log(`Subject: ${subject}`);
  console.log(`Order: ${orderNumber}`);
  console.log(`Items to Craft/Pack:\n${itemsText}`);
  console.log(`Ship to: ${shippingAddress.fullName}, ${shippingAddress.city}, ${shippingAddress.state}`);
  console.log(`Action Required: Log into Studio Dashboard to update fulfillment.`);
  console.log(`Status: Delivered to Sandbox Notification Log`);
  console.log(`============================================================\n`);

  return { success: true, messageId: `msg_seller_${orderNumber}_${Date.now()}` };
}

/**
 * 3. Send Shipment Dispatched Alert to Buyer
 */
export async function sendShipmentDispatchedEmail(params: SendShipmentDispatchedParams) {
  const { orderNumber, buyerEmail, buyerName, carrier, trackingNumber } = params;

  const subject = `Your Order ${orderNumber} Has Dispatched! | Tracking: ${trackingNumber}`;

  console.log(`\n============================================================`);
  console.log(`✉️  [TRANSACTIONAL EMAIL] Shipment Dispatched Notification`);
  console.log(`To Buyer: ${buyerEmail} (${buyerName})`);
  console.log(`Subject: ${subject}`);
  console.log(`Order Number: ${orderNumber}`);
  console.log(`Carrier: ${carrier}`);
  console.log(`Tracking AWB: ${trackingNumber}`);
  console.log(`Estimated Transit: Insured Pan-India Express Delivery`);
  console.log(`Status: Delivered to Sandbox Notification Log`);
  console.log(`============================================================\n`);

  return { success: true, messageId: `msg_ship_${orderNumber}_${Date.now()}` };
}
