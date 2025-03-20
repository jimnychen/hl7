var hl7 = [];
document.getElementById("addTest").addEventListener("click", function() {
    let newInput = document.createElement("input");
    newInput.type = "text";
    newInput.placeholder = "輸入檢查項目";
    newInput.className = "form-control test-input my-2";
    document.getElementById("testList").appendChild(newInput);
    let newInputResault = document.createElement("input");
    newInputResault.type = "text";
    newInputResault.placeholder = "輸入檢查結果";
    newInputResault.className = "form-control test-input-resault my-2";
    document.getElementById("testList").appendChild(newInputResault);
});
function getHL7Timestamp() {
    const now = new Date();
    return now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  }

document.getElementById("sendHL7").addEventListener("click", async function() {
    const patientId = document.getElementById("patientId").value;
    const patientName = document.getElementById("patientName").value;
    const specimenId = document.getElementById("specimenId").value;
    const specimenName = document.getElementById("specimenName").value;
    const patientBarth = document.getElementById("patientBarth").value;
    const testInputs = document.querySelectorAll(".test-input");
    const teatResaults= document.querySelectorAll(".test-input-resault");
    let tests = [];
    testInputs.forEach(input => {
        if (input.value.trim()) {
            tests.push({ name: input.value.trim() });
        }
    });
    let testsResaults = [];
    teatResaults.forEach(input => {
        if (input.value.trim()) {
            testsResaults.push({ name: input.value.trim() });
        }
    });
    hl7 = [`MSH|^~\\&|ORDERSYSTEM|NTUNHS|||${getHL7Timestamp()}||ORM^O01|12345|T|2.5`,
           `PID|1|${patientId}|${patientId}||${patientName}||${patientBarth}|M`,
           `ORC|NW|ORDER|RIS123|SC||1||${getHL7Timestamp()}|||`,
            `SPM|1|${specimenId}|SPECIMEN_PARENT|||SER|${specimenName}||||getHL7Timestamp()`]
    testInputs.forEach((test, index) => {
            hl7.push(`OBR|${index + 1}|ORDER${12345 + index}|RIS${123 + index}|${test.name}^檢查項目`);
    });
    testsResaults.forEach((resault, index) => {
        hl7.push(`OBX|${index + 1}|NM|${resault.name}^檢查結果|1|1`);
      });
    hl7.forEach((res)=>{
        console.log(res);
    })
    document.getElementById("result").innerText = "與伺服器通訊中，請稍後...";
    const response = await fetch("http://localhost:3000/sendHL7", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({hl7})
    });
    const data = await response.text();
    document.getElementById("result").innerText = data;
});