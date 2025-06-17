document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("registracion-form");
    const nameInput = document.getElementById("Nombre");
    const apeInput = document.getElementById("Apellido");
    const emailInput = document.getElementById("Email");
    const passInput = document.getElementById("Contrasena");
    const confirmPassInput = document.getElementById("ConfirmarContraseña");

    const nameError = document.getElementById("nameerror");
    const apeError = document.getElementById("apeerror");
    const emailError = document.getElementById("emailerror");
    const passError = document.getElementById("contraerror");
    const confirmPassError = document.getElementById("confirmarerror");

    
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePassword(password) {
        return password.length >= 8 && /[!@*(),.?":{}|<>#$%^&]/.test(password);
    }

    
    function validatePasswordMatch(pass1, pass2) {
        return pass1 === pass2;
    }

   
    function showError(element, message) {
        element.textContent = message;
        element.style.display = "block";
    }

    
    function clearError(element) {
        element.textContent = "";
        element.style.display = "none";
    }

    passInput.addEventListener("input", function() {
        if (!validatePassword(passInput.value)) {
            showError(passError, "La contraseña debe tener mínimo 8 caracteres y 1 signo");
        } else {
            clearError(passError);
        }
        
        
        if (confirmPassInput.value) {
            if (!validatePasswordMatch(passInput.value, confirmPassInput.value)) {
                showError(confirmPassError, "Las contraseñas no coinciden");
            } else {
                clearError(confirmPassError);
            }
        }
    });

    
    confirmPassInput.addEventListener("input", function() {
        if (!validatePasswordMatch(passInput.value, confirmPassInput.value)) {
            showError(confirmPassError, "Las contraseñas no coinciden");
        } else {
            clearError(confirmPassError);
        }
    });

   
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        
        if (nameInput.value.trim() === "") {
            showError(nameError, "El nombre es obligatorio");
            isValid = false;
        }
        
       
        if (apeInput.value.trim() === "") {
            showError(apeError, "El apellido es obligatorio");
            isValid = false;
        }
        
        
        if (!validateEmail(emailInput.value)) {
            showError(emailError, "Ingresa un email válido");
            isValid = false;
        }
        
        if (!validatePassword(passInput.value)) {
            showError(passError, "La contraseña debe tener mínimo 8 caracteres y 1 signo");
            isValid = false;
        }
        
        
        if (!validatePasswordMatch(passInput.value, confirmPassInput.value)) {
            showError(confirmPassError, "Las contraseñas no coinciden");
            isValid = false;
        }
        
      
        if (isValid) {
            alert("Registro exitoso.");
           
        }
    });
});