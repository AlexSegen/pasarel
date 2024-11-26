import Transbank from "transbank-pos-sdk";

// Pos Instance
const POS = new Transbank.POSIntegrado();

// Dictionary
const DICTIONARY = {
    "0800": () => POS.loadKeys(), // TRANSACCIÓN CARGA DE LLAVES
    "0100": () => POS.polling(), // TRANSACCIÓN DE POLLING
    "0250": () => POS.getLastSale(), // TRANSACCIÓN ÚLTIMA VENTA
    "0500": () => POS.closeDay(), // TRANSACCIÓN DE CIERRE
    "0700": () => POS.getTotals(), // DETALLE DE VENTAS
    "0300": () => POS.changeToNormalMode(), // CAMBIO DE MODALIDAD A POS NORMAL
    "0260": ({ printOnPos }) => POS.salesDetail(printOnPos),  // TRANSACCIÓN TOTALES
    "0200": ({ amount, ticket, sendStatus, callback }) => POS.sale(amount, ticket, sendStatus, callback), // TRANSACCIONES DE VENTA
    "1200": ({ operationId }) => POS.refund(operationId), // TRANSACCIÓN ANULACIÓN VENTA

};

export { POS, DICTIONARY };
