const { POSIntegrado } = require("transbank-pos-sdk");

// Pos Instance
const POS = new POSIntegrado();

// Dictionary
const DICTIONARY = {
    "0250": () => POS.getLastSale(),
    "0700": () => POS.getTotals(),
    "0260": ({ printOnPos }) => POS.salesDetail(printOnPos),
};

export { POS, DICTIONARY };
