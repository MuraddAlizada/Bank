const balanceEl = document.querySelector("#moneyBalance");
const moneyAmount = document.querySelector("#moneyAmount");
const depositBtn = document.querySelector("#depositBtn");
const withdrawBtn = document.querySelector("#withdrawBtn");
const list = document.querySelector("#list");

const balance = {
  total: 0,
  data: [],

  deposit: function (amount) {
    if (amount > 0 && amount !== null && amount !== "") {
      amount = parseFloat(amount);
      if (amount > 0) {
        this.total += amount;
        balanceEl.innerHTML = `$${this.total}`;
        history.call(this, "Cash", amount);
      } else {
        alert("Invalid deposit amount. Amount must be greater than 0.");
      }
    } else {
      alert("Invalid input or operation cancelled.");
    }
  },

  withdraw: function (amount) {
    if (amount > 0 && amount !== null && amount !== "") {
      amount = parseFloat(amount);
      if (amount > 0 && amount <= this.total) {
        this.total -= amount;
        balanceEl.innerHTML = `$${this.total}`;
        history.call(this, "Withdraw", -amount);
        // alert(`New total balance: $${this.total}`);
      } else {
        alert(
          "Invalid withdraw amount. Amount must be greater than 0, less than your balance."
        );
      }
    } else {
      alert("Invalid input or operation cancelled.");
    }
  },
};

depositBtn.addEventListener("click", function () {
  const value = moneyAmount.value;
  balance.deposit(+value);
  moneyAmount.value = "";
});

withdrawBtn.addEventListener("click", function () {
  const value = moneyAmount.value;
  balance.withdraw(value);
  moneyAmount.value = "";
});

function history(type, amount) {
  const lastOp = {
    type: type,
    amount: amount,
    created: new Date().toLocaleString(),
  };
  this.data.push(lastOp);

  const newContent = this.data
    .slice()
    .reverse()
    .map(
      (item, index) =>
      `<tr>
            <th scope="row">${index + 1}</th>
            <td>${item.type === "Cash" ? "Deposit" : item.type}</td>
            <td class="text-${
              item.type === "Withdraw" ? "danger" : "success"
            }">${item.amount > 0 ? `+$${item.amount.toFixed(2)}` : `-$${Math.abs(item.amount).toFixed(2)}`}</td>
            <td>${item.created}</td>
        </tr>`
    )
    .join("");
  list.innerHTML = newContent;
}