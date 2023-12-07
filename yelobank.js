const balanceEl = document.querySelector("#moneyBalance");
const moneyAmount = document.querySelector("#moneyAmount");
const depositBtn = document.querySelector("#depositBtn");
const withdrawBtn = document.querySelector("#withdrawBtn");
const cardPaymentBtn = document.querySelector("#cardPaymentBtn");
const transferBtn = document.querySelector("#transferBtn");
const list = document.querySelector("#list");

const balance = {
  total: 0,
  data: [],

  deposit: function (amount) {
    if (amount > 0 && amount !== null && amount !== "") {
      amount = parseFloat(amount);
      if (amount > 0) {
      } else {
        alert("Invalid deposit amount. Amount must be greater than 0.");
      }
    } else {
      alert("Please enter a valid deposit amount.")
      return;
    }

    this.cardOp("Deposit", amount);
  },
  withdraw: function (amount) {
    if (this.total >= amount) {
      this.cardOp("Withdraw", -amount);
    } else {
      alert("Insufficient funds for withdraw.");
    }
  },

  cardPayment: function (amount) {
    if (this.total >= amount) {
      const cashback = this.calcCashback(amount);
      this.cardOp("Card Payment", -amount);
      this.cardOp("Cashback", cashback, "success");
    } else {
      alert("Insufficient funds for card payment.");
    }
  },

  transfer: function (amount, recipientCardNumber) {
   
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Invalid amount. Please enter a valid positive number.");
      return;
    }
  
    if (recipientCardNumber.length !== 4 || isNaN(recipientCardNumber)) {
      alert("Invalid recipient card number. Please complete a 16-digit number.");
      return;
    }
  
    const cvvCode = prompt("Enter your 3-digit CVV code:");

    if (!/^\d{3}$/.test(cvvCode)) {
      alert("Invalid CVV code. Please enter a 3-digit number.");
      return;
    }
  
    this.cardOp("Transfer", -amount, recipientCardNumber, cvvCode);
  
    moneyAmount.value = "";
  },
  
  calcCashback: function (amount) {
    return amount * 0.03;
  },

  cardOp: function (type, amount, recipientCardNumber) {
    
    this.total += amount;
    balanceEl.innerHTML = `$${this.total.toFixed(2)}`;

    const color = amount >= 0 ? "success" : "danger";

    const historyItem = {
      type: type,
      amount: amount,
      recipientCardNumber: recipientCardNumber, 
      created: new Date().toLocaleString(),
      color: color,
    };

    this.data.unshift(historyItem);

    const newContent = this.data
      .map(
        (item) =>
          `<tr class="table-${item.color}">
            <td>${item.type === "Transfer" ? `${item.type} to ${item.recipientCardNumber}` : item.type}</td>
            <td>${
              item.amount >= 0
                ? `+$${item.amount.toFixed(2)}`
                : `-$${Math.abs(item.amount).toFixed(2)}`
            }</td>
            <td>${item.created}</td>
          </tr>`
      )
      .join("");
    list.innerHTML = newContent;
  },
};

depositBtn.addEventListener("click", function () {
  const value = moneyAmount.value;
  balance.deposit(+value);
  moneyAmount.value = "";
});

withdrawBtn.addEventListener("click", function () {
  const value = moneyAmount.value;

  const withdrawalAmount = parseFloat(value);

  if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
    alert("Please enter a valid withdrawal amount.");
    return;
  }

  const pinCode = prompt("Enter your 4-digit PIN code:");

  if (!/^\d{4}$/.test(pinCode)) {
    alert("Invalid PIN code. Please enter a 4-digit numeric PIN code.");
    return;
  }

  balance.withdraw(withdrawalAmount);
  moneyAmount.value = "";
});

cardPaymentBtn.addEventListener("click", function () {
  const value = moneyAmount.value;

  const paymentAmount = parseFloat(value);

  if (isNaN(paymentAmount) || paymentAmount <= 0) {
    alert("Please enter a valid payment amount.");
    return;
  }

  const cvvCode = prompt("Enter your 3-digit CVV code:");

  if (!/^\d{3}$/.test(cvvCode)) {
    alert("Invalid CVV code. Please enter a 3-digit numeric CVV code.");
    return;
  }

  balance.cardPayment(paymentAmount);
  moneyAmount.value = "";
});

function validateCvv(cvv) {
  const predefinedCvv = "validateCvv"; 
  return cvv === predefinedCvv;
}

transferBtn.addEventListener("click", function () {
  const amount = moneyAmount.value;

  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    alert("Invalid amount. Please enter a valid positive number.");
    return;
  }

  const recipientCardNumber = prompt("Enter recipient card number's last 4 digit 4724 9975 9020 ****");

  if (recipientCardNumber !== null) {
    balance.transfer(amount, recipientCardNumber);
    moneyAmount.value = "";
  } else {
    alert("Transfer canceled.");
  }
});
