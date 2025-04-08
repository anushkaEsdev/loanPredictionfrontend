document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loanForm');
    const submitBtn = document.getElementById('submitBtn');
    const resultDiv = document.getElementById('result');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Function to show loading state
    function showLoading() {
        loadingOverlay.classList.add('show');
        submitBtn.disabled = true;
    }

    // Function to hide loading state
    function hideLoading() {
        loadingOverlay.classList.remove('show');
        submitBtn.disabled = false;
    }

    // Function to show result
    function showResult(message, isApproved) {
        resultDiv.textContent = message;
        resultDiv.classList.add('show');
        resultDiv.classList.add(isApproved ? 'approved' : 'rejected');
    }

    // Function to validate form data
    function validateFormData(data) {
        const requiredFields = [
            "Gender", "Married", "Dependents", "Education", "Self_Employed",
            "ApplicantIncome", "CoapplicantIncome", "LoanAmount",
            "Loan_Amount_Term", "Credit_History", "Property_Area"
        ];

        for (const field of requiredFields) {
            if (!data[field] && data[field] !== 0) {
                throw new Error(`Please fill in all required fields`);
            }
        }

        // Validate numeric fields
        const numericFields = ["ApplicantIncome", "CoapplicantIncome", "LoanAmount", "Loan_Amount_Term"];
        for (const field of numericFields) {
            if (isNaN(data[field]) || data[field] <= 0) {
                throw new Error(`Please enter a valid amount for ${field}`);
            }
        }
    }

    submitBtn.addEventListener('click', async function(event) {
        event.preventDefault();
        
        try {
            // Reset previous result
            resultDiv.className = 'result-container';
            
            // Get form data
            const formData = {
                Gender: document.getElementById("gender").value,
                Married: document.getElementById("married").value,
                Dependents: document.getElementById("dependents").value,
                Education: document.getElementById("education").value,
                Self_Employed: document.getElementById("selfEmployed").value,
                ApplicantIncome: parseFloat(document.getElementById("applicantIncome").value),
                CoapplicantIncome: parseFloat(document.getElementById("coapplicantIncome").value),
                LoanAmount: parseFloat(document.getElementById("loanAmount").value),
                Loan_Amount_Term: parseFloat(document.getElementById("loanAmountTerm").value),
                Credit_History: document.getElementById("creditHistory").value,
                Property_Area: document.getElementById("propertyArea").value
            };

            // Validate form data
            validateFormData(formData);

            // Show loading state
            showLoading();

            // Make API request
            const response = await fetch("http://localhost:5000/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // Hide loading state
            hideLoading();

            // Show result
            const isApproved = result.loan_approval === "Approved";
            const probability = (result.approval_probability * 100).toFixed(1);
            const message = isApproved 
                ? `🎉 Congratulations! Your loan has been approved with ${probability}% confidence.`
                : `❌ We're sorry, but your loan application has been rejected. Confidence: ${probability}%`;

            showResult(message, isApproved);

        } catch (error) {
            hideLoading();
            showResult(`Error: ${error.message}`, false);
        }
    });

    // Add input validation for numeric fields
    const numericInputs = document.querySelectorAll('input[type="number"]');
    numericInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
    });
});
