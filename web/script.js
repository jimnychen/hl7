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
    document.getElementById("result").innerText = "與伺服器通訊中，請稍後...";
    const response = await fetch("http://localhost:3000/sendHL7", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId,patientName,patientBarth,specimenId,specimenName, tests,testsResaults})
    });

    const data = await response.text();
    document.getElementById("result").innerText = data;
});