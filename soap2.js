const soap = require("soap");
const { parseStringPromise } = require("xml2js");

// Define the service endpoint
// const url = 'http://inddes:8000/sap/bc/srt/wsdl/bndg_49C03367BA90C172E10000000A6F371A/wsdl11/service/ws_policy/document?wsdl';

function startApp() {
  // Create a client object
  soap.createClient("./pos.wsdl", (err, client) => {
    if (err) {
      console.error("Error creating SOAP client:", err);
      return;
    }

    const security = new soap.BasicAuthSecurity("vpm_abap", "V@nessit@ntoni@3");
    client.setSecurity(security);

    // Define the arguments for the Greet operation
    const args = {
      POSID: "IT205078",
      VKORG: "0110",
      WERKS: "0102",
    };

    // Call the Greet operation
    client.ZRFC_POS_TBK_REQUEST(args, async (err, data) => {
      if (err) {
        const jsonData = await parseStringPromise(err.response.data, {
          explicitArray: false,
        });
        console.error(
          "Error calling Greet operation:",
          JSON.stringify(jsonData)
        );
        return;
      }

      // Access the greeting message from the response
      console.log("data", data); // Output: Hello, John Doe!
    });
  });
}

startApp();
