document.getElementById("submitBtn").addEventListener("click", async function(event) {
    event.preventDefault(); // Prevent form from submitting normally

    let formData = {
        Gender: parseInt(document.getElementById("gender").value),
        Married: parseInt(document.getElementById("married").value),
        Dependents: parseInt(document.getElementById("dependents").value),
        Education: parseInt(document.getElementById("education").value),
        Self_Employed: parseInt(document.getElementById("selfEmployed").value),
        ApplicantIncome: parseFloat(document.getElementById("applicantIncome").value),
        CoapplicantIncome: parseFloat(document.getElementById("coapplicantIncome").value),
        LoanAmount: parseFloat(document.getElementById("loanAmount").value),
        Loan_Amount_Term: parseFloat(document.getElementById("loanAmountTerm").value),
        Credit_History: parseInt(document.getElementById("creditHistory").value),
        Property_Area: parseInt(document.getElementById("propertyArea").value)
    };

    // Check if any field is empty
    if (Object.values(formData).some(value => value === "" || isNaN(value))) {
        document.getElementById("result").innerHTML = "<span style='color:red;'>Please fill all required fields.</span>";
        return;
    }

    try {
        // Send data to Flask backend
        let response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        let result = await response.json();

        // Display prediction result
        document.getElementById("result").innerHTML = 
            `<span style='color:${result.loan_status === "Approved" ? "green" : "red"};'>Loan ${result.loan_status} 🎉</span>`;
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("result").innerHTML = "<span style='color:red;'>Error predicting loan status.</span>";
    }
});
