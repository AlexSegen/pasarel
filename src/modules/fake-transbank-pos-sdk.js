import getLastSaleMock from '../../__mocks__/pos/getLastSale.json' with {type: "json"}; 

function getMock(m) {
    try {
        return data;
    } catch (error) {
        
    }
}

export class POSIntegrado {
    constructor() { }

    loadKeys() {
        return new Promise((resolve) => resolve({terminalId: 1}));
    }

    setDebug(debug) {
        console.log(`setDebug result, debug: ${debug}`);
    }

    isConnected() {
        return true;
    }

    autoconnect() {
        return new Promise((resolve) => resolve({
            path: "autoconnect result",
        }));
    }

    sale(amount, ticket, sendStatus, callback) {
        console.log(`[sale] params - amount: ${amount}, ticket: ${ticket}, sendStatus: ${sendStatus}, callback: ${callback}`)
        return new Promise((resolve) => resolve("sale result"));
    }

    getLastSale() {
        return new Promise((resolve) => resolve(getLastSaleMock));
    }

    getTotals() {
        return new Promise((resolve) => resolve("getTotals result"));
    }

    salesDetail(printOnPos) {
        return new Promise((resolve) => resolve(`salesDetail result, printOnPos: ${printOnPos}`));
    }
}