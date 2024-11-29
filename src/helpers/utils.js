export const getArgs = (value) => {
  const args = value.split("|");
  args.splice(0, 1);
  return args;
};

export const mapvalues = (obj) => {
  let values = "";
  Object.keys(obj).forEach((key) => {
    values = values.toString().concat(`${obj[key]}|`);
  });
  return values;
};

class Item {
  WERKS;
  VKORG;
  UNAME;
  POSID;
  DATUM;
  UZEIT;
  FUNC;
  TOPER;
  RESPONSE;
  constructor({ WERKS, VKORG, UNAME, POSID, DATUM, UZEIT, FUNC }, values) {
    this.WERKS = WERKS;
    this.VKORG = VKORG;
    this.UNAME = UNAME;
    this.POSID = POSID;
    this.DATUM = DATUM;
    this.UZEIT = UZEIT;
    this.FUNC = FUNC;
    this.TOPER = "R";
    this.RESPONSE = values;
  }
}

export const handlePOSResult = (
  { WERKS, VKORG, UNAME, POSID, DATUM, UZEIT, FUNC },
  result
) => {
  const ITEM = [];
  let items = [];

  if (!Array.isArray(result)) {
    items.push(result);
  } else if (Array.isArray(result)) {
    items = [...result];
  }

  for (let item of items) {
    ITEM.push(
      JSON.parse(
        JSON.stringify(
          new Item(
            { WERKS, VKORG, UNAME, POSID, DATUM, UZEIT, FUNC },
            mapvalues(item)
          )
        )
      )
    );
  }

  return ITEM;
};
