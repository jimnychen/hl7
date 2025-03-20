  var express = require("express");
var bodyParser = require('body-parser')
var app = express();
const cors = require("cors");
const path = require('path');
var hl7 = require('simple-hl7');
var Facillty = require("./Facility.json");
const { console } = require("inspector");
const { log } = require("console");
app.use(express.static('web'))
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // 解析表單內容
  extended: false,
}));
function createORMMessage(patientName, patientID,patientbirth,specimenId,specimenName,test,resault) {
  const msg =  new hl7.Message(
    `MSH|^~\\&|${Facillty.Application}|${Facillty.Facillty}|||${getHL7Timestamp()}||ORM^O01|12345|T|2.5`,
    `PID|1|${patientID}|${patientID}||${patientName}||${patientbirth}|M`,
    `ORC|NW|ORDER|RIS123|SC||1||${getHL7Timestamp()}|||`,
  );
  msg.addSegment("SPM", "1", specimenId,"SPECIMEN_PARENT", "", "SER", "specimenName", "", "", "", getHL7Timestamp());
  test.forEach((test, index) => {
    msg.addSegment("OBR", index + 1, `ORDER${12345 + index}`, `RIS${123 + index}`, `${test.name}^檢查項目`);
});
resault.forEach((resault, index) => {
  msg.addSegment("OBX", index + 1, "NM", `${resault.name}^檢查結果`, "1", "1");
});
return msg;
}
app.post("/sendHL7", function (req, res) {
  console.log(req.body)
  var client = hl7.Server.createTcpClient(Facillty.serverHost,Facillty.serverPort);
  var msg = createORMMessage(req.body.patientName, req.body.patientId,req.body.patientBarth,req.body.specimenId,req.body.specimenName,req.body.tests,req.body.testsResaults);
  console.log("msg:"+ msg)
  client.send(msg, (err, ack) => {
    if (err){

      res.send("HL7 開單失敗: " + err.message);
  }else{
      console.log("HL7 開單成功:", ack.toString());
      res.send (`開單成功\n${ack.toString()}`);
    }
  });

});
var jsonParser = bodyParser.json()
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "web/index.html"));
});
app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
