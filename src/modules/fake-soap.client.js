//import ZRFC_POS_TBK_REQUESTMock from '../../__mocks__/soap/ZRFC_POS_TBK_REQUEST.json' with {type: "json"}; 

const ZRFC_POS_TBK_REQUESTMock = {
    "REQUEST": {
        "FUNC": "0260",
        "REQUEST": "0200|15000|20|0|0",
        "WERKS": "WERKS",
        "VKORG": "VKORG",
        "UNAME": "UNAME",
        "POSID": "POSID",
        "DATUM": "DATUM",
        "UZEIT": "UZEIT",
        "TOPER": "R"
    },
    "SUBRC": 0
}

class Client {
    constructor() { }
    
    setSecurity = (args) => {};


    ZRFC_POS_TBK_REQUEST = (_, callback) => {
        callback(null, ZRFC_POS_TBK_REQUESTMock);
    }

    ZRFC_POS_TBK_RESPONSE = (_, callback) => {
        callback(null, {});
    }
}

class BasicAuthSecurity {
    constructor() {}
};

export class Soap {
    
    client;
    url;
    options;
    BasicAuthSecurity;
    
    constructor() { 
        this.client = null;
        this.url = '';
        this.options = {}  
        this.BasicAuthSecurity = BasicAuthSecurity;
    }

    createClient = (url, options, callback) => {
        callback(null, new Client());
    }
}

export const soap = new Soap();
