
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("technician-id");
    const buttons = document.querySelectorAll("button");
    
    const system = {
        validId: "8492",
        validate(id) {
            return id === this.validId;
        }
    };
function updateStatus(success) {
    const footerStatus = document.getElementById("system-status");
    const indicator = document.getElementById("status-light");

    if (success) {
        footerStatus.textContent = "ACCESS_GRANTED";
        indicator.classList.remove("bg-green-500", "bg-red-500");
        indicator.classList.add("bg-primary");
        localStorage.setItem("floor2", "completed");
    } else {
        footerStatus.textContent = "ACCESS_DENIED";
        indicator.classList.remove("bg-green-500", "bg-primary");
        indicator.classList.add("bg-red-500");
        input.value = "";
    }
}

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const value = btn.innerText.trim();

            if (/^[0-9]$/.test(value)) {
                if (input.value.length < 4) {
                    input.value += value;
                }
            }

            if (btn.innerHTML.includes("backspace")) {
                input.value = input.value.slice(0, -1);
            }

            if (btn.innerHTML.includes("keyboard_return")) {
                updateStatus(system.validate(input.value));
            }

            if (btn.innerText.includes("DIAGNOSTIC")) {
                alert("Diagnostic Mode Activated");
            }
        });
    });

    document.addEventListener("keydown", (e) => {
        if (/^[0-9]$/.test(e.key)) {
            if (input.value.length < 4) {
                input.value += e.key;
            }
        }

        if (e.key === "Backspace") {
            input.value = input.value.slice(0, -1);
        }

        if (e.key === "Enter") {
            updateStatus(system.validate(input.value));
        }
    });
});
