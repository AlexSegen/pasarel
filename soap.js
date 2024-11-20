const soap = require('strong-soap').soap;

const url = './pos.wsdl';
const requestArgs = {
    POSID: "IT205078",
    VKORG: "0110",
    WERKS: "0102",
  };
const options = {};

soap.createClient(url, options, (err, client) => {
  if (err) {
    console.error('Error creando cliente SOAP:', err);
    return;
  }

  client.setSecurity(new soap.BasicAuthSecurity("vpm_abap", "V@nessit@ntoni@3"));

  client.ZRFC_POS_TBK_REQUEST(requestArgs, (err, result) => {
    if (err) {
      console.error('Error invocando método SOAP:', err);
      return;
    }
    console.log('Resultado del método:', result);
  });
});