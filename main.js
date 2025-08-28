document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("myForm");
  const errorDiv = document.getElementById("errors");

  const fields = {
    nome: document.getElementById("nome"),
    cpf: document.getElementById("cpf"),
    login: document.getElementById("login"),
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword"),
    salario: document.getElementById("salario"),
    numeroDependentes: document.getElementById("numeroDependentes"),
    impostoRenda: document.getElementById("impostoRenda"),
  };

  const validators = {
    required: (val) => val && val.trim() !== "",
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    password: (val) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(val),
    cpf: (val) => val.replace(/\D/g, "").length === 11,
    numberPositive: (val) => !isNaN(val) && parseFloat(val) > 0,
    numberNonNegative: (val) => !isNaN(val) && parseInt(val) >= 0,
  };

  const rules = {
    nome: [{ check: "required", message: "Campo obrigatório" }],
    cpf: [
      { check: "required", message: "Campo obrigatório" },
      { check: "cpf", message: "CPF deve ter 11 dígitos." },
    ],
    login: [{ check: "required", message: "Campo obrigatório" }],
    email: [
      { check: "required", message: "Campo obrigatório" },
      { check: "email", message: "Email inválido" },
    ],
    password: [
      { check: "required", message: "Campo obrigatório" },
      { check: "password", message: "A senha deve ter pelo menos 8 caracteres, incluindo letras e números." },
    ],
    confirmPassword: [
      { check: "required", message: "Campo obrigatório" },
      { check: (val, all) => val === all.password, message: "As senhas não coincidem." },
    ],
    salario: [
      { check: "required", message: "Campo obrigatório" },
      { check: "numberPositive", message: "Salário deve ser um número válido maior que zero." },
    ],
    numeroDependentes: [
      { check: "required", message: "Campo obrigatório" },
      { check: "numberNonNegative", message: "Número de dependentes deve ser >= 0." },
    ],
    impostoRenda: [{ check: "required", message: "Campo obrigatório" }],
  };

  function showFieldError(id, message) {
    const input = fields[id];
    input.style.border = "2px solid red";

    let errorDiv = input.parentNode.querySelector(".error-message");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      input.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
  }

  function clearFieldError(id) {
    const input = fields[id];
    input.style.border = "";
    const errorDiv = input.parentNode.querySelector(".error-message");
    if (errorDiv) errorDiv.remove();
  }

  function validateAll() {
    let hasError = false;
    errorDiv.innerHTML = "";
    errorDiv.style.display = "none";

    Object.keys(rules).forEach((id) => clearFieldError(id));

    const values = Object.fromEntries(
      Object.entries(fields).map(([id, el]) => [id, el.value])
    );

    for (const [id, validations] of Object.entries(rules)) {
      for (const { check, message } of validations) {
        let isValid = typeof check === "string"
          ? validators[check](values[id])
          : check(values[id], values);

        if (!isValid) {
          showFieldError(id, message);
          hasError = true;
          break; 
        }
      }
    }

    if (hasError) {
      errorDiv.innerHTML = "Existem campos inválidos. Corrija-os e tente novamente.";
      errorDiv.style.display = "block";
    }

    return !hasError;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateAll()) return;

    Toastify({
      text: "Cadastro realizado com sucesso!",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: {
        background: "#4CAF50",
        fontSize: "16px",
        padding: "20px",
        minWidth: "300px",
        borderRadius: "8px",
      },
    }).showToast();

    form.reset();
  });
});
