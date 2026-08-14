const STORAGE_KEY = "expense-tracker-v1";
const incomeCategories = ["Salary", "Freelance", "Investment", "Gift", "Other"];
const expenseCategories = ["Food", "Housing", "Utilities", "Transport", "Entertainment", "Healthcare", "Shopping", "Education", "Travel", "Other"];

const transactionForm = document.getElementById("transactionForm");
const typeSelect = document.getElementById("typeSelect");
const descriptionInput = document.getElementById("descriptionInput");
const amountInput = document.getElementById("amountInput");
const categorySelect = document.getElementById("categorySelect");
const dateInput = document.getElementById("dateInput");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const formTitle = document.getElementById("formTitle");
const submitBtn = transactionForm.querySelector(".primary-btn");
const typeFilter = document.getElementById("typeFilter");
const categoryFilter = document.getElementById("categoryFilter");
const transactionsList = document.getElementById("transactionsList");

const incomeAmount = document.getElementById("incomeAmount");
const expenseAmount = document.getElementById("expenseAmount");
const balanceSummary = document.getElementById("balanceSummary");
const balanceAmount = document.getElementById("balanceAmount");
const insightText = document.getElementById("insightText");

let transactions = loadTransactions();
let editingId = null;

function loadTransactions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDefaultDate() {
  return new Date().toISOString().split("T")[0];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function populateCategoryOptions(type = typeSelect.value) {
  const categories = type === "expense" ? expenseCategories : incomeCategories;
  const currentSelection = categorySelect.value || categories[0];

  categorySelect.innerHTML = categories
    .map((category) => {
      const selected = currentSelection === category ? "selected" : "";
      return `<option value="${category}" ${selected}>${category}</option>`;
    })
    .join("");

  if (!categories.includes(currentSelection)) {
    categorySelect.value = categories[0];
  }
}

function populateCategoryFilterOptions() {
  const selectedType = typeFilter.value;
  const categories =
    selectedType === "income"
      ? incomeCategories
      : selectedType === "expense"
      ? expenseCategories
      : [...new Set([...incomeCategories, ...expenseCategories])];

  const options = ["all", ...categories];
  categoryFilter.innerHTML = options
    .map((category, index) => {
      const value = category === "all" ? "all" : category;
      const label = index === 0 ? "All categories" : category;
      return `<option value="${value}">${label}</option>`;
    })
    .join("");

  if (categoryFilter.value && options.includes(categoryFilter.value)) {
    categoryFilter.value = categoryFilter.value;
  } else {
    categoryFilter.value = "all";
  }
}

function resetForm() {
  transactionForm.reset();
  typeSelect.value = "income";
  dateInput.value = getDefaultDate();
  populateCategoryOptions("income");
  editingId = null;
  formTitle.textContent = "Add a transaction";
  submitBtn.textContent = "Save transaction";
  cancelEditBtn.classList.add("hidden");
}

function startEditing(id) {
  const transaction = transactions.find((item) => item.id === id);
  if (!transaction) return;

  editingId = id;
  typeSelect.value = transaction.type;
  descriptionInput.value = transaction.description;
  amountInput.value = transaction.amount;
  categorySelect.value = transaction.category;
  dateInput.value = transaction.date;
  populateCategoryOptions(transaction.type);
  categorySelect.value = transaction.category;
  formTitle.textContent = "Edit transaction";
  submitBtn.textContent = "Update transaction";
  cancelEditBtn.classList.remove("hidden");
  descriptionInput.focus();
}

function calculateTotals() {
  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const expense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const balance = income - expense;
  return { income, expense, balance };
}

function renderSummary() {
  const { income, expense, balance } = calculateTotals();

  incomeAmount.textContent = formatCurrency(income);
  expenseAmount.textContent = formatCurrency(expense);
  balanceSummary.textContent = formatCurrency(balance);
  balanceAmount.textContent = formatCurrency(balance);

  if (balance > 0) {
    balanceSummary.classList.add("positive");
    balanceSummary.classList.remove("negative");
  } else if (balance < 0) {
    balanceSummary.classList.add("negative");
    balanceSummary.classList.remove("positive");
  } else {
    balanceSummary.classList.remove("positive", "negative");
  }

  const topExpense = [...transactions]
    .filter((transaction) => transaction.type === "expense")
    .sort((a, b) => Number(b.amount) - Number(a.amount))[0];

  if (income === 0 && expense === 0) {
    insightText.textContent = "Add your first transaction to begin.";
  } else if (balance >= 0) {
    insightText.textContent = `You are saving ${formatCurrency(balance)}. ${topExpense ? `Largest expense: ${topExpense.category}.` : ""}`.trim();
  } else {
    insightText.textContent = `You are ${formatCurrency(Math.abs(balance))} over budget. ${topExpense ? `Largest expense: ${topExpense.category}.` : ""}`.trim();
  }
}

function renderTransactions() {
  const selectedType = typeFilter.value;
  const selectedCategory = categoryFilter.value;

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType = selectedType === "all" || transaction.type === selectedType;
    const matchesCategory = selectedCategory === "all" || transaction.category === selectedCategory;
    return matchesType && matchesCategory;
  });

  if (!filteredTransactions.length) {
    transactionsList.innerHTML = '<div class="empty-state">No transactions match the current filters.</div>';
    return;
  }

  const sortedTransactions = [...filteredTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  transactionsList.innerHTML = sortedTransactions
    .map((transaction) => {
      const signedAmount = transaction.type === "expense" ? -transaction.amount : transaction.amount;
      const amountClass = transaction.type === "expense" ? "negative" : "positive";
      const amountPrefix = transaction.type === "expense" ? "-" : "+";

      return `
        <article class="transaction-item">
          <div class="transaction-main">
            <span class="transaction-badge ${transaction.type}">${transaction.type}</span>
            <div>
              <h3 class="transaction-title">${escapeHtml(transaction.description)}</h3>
              <p class="transaction-date">${escapeHtml(transaction.category)} • ${formatDate(transaction.date)}</p>
            </div>
          </div>
          <div class="transaction-meta">
            <strong class="transaction-amount ${amountClass}">${amountPrefix}${formatCurrency(Math.abs(signedAmount))}</strong>
            <div class="action-group">
              <button class="icon-btn edit-btn" data-id="${transaction.id}">Edit</button>
              <button class="icon-btn delete-btn" data-id="${transaction.id}">Delete</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function render() {
  renderSummary();
  populateCategoryFilterOptions();
  renderTransactions();
}

transactionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const payload = {
    id: editingId || `${Date.now()}`,
    type: typeSelect.value,
    description: descriptionInput.value.trim(),
    amount: Number(amountInput.value),
    category: categorySelect.value,
    date: dateInput.value || getDefaultDate(),
  };

  if (!payload.description || Number.isNaN(payload.amount) || payload.amount <= 0) {
    alert("Please enter a valid description and amount.");
    return;
  }

  if (editingId) {
    transactions = transactions.map((transaction) => (transaction.id === editingId ? { ...transaction, ...payload } : transaction));
  } else {
    transactions.unshift(payload);
  }

  saveTransactions();
  resetForm();
  render();
});

typeSelect.addEventListener("change", () => {
  populateCategoryOptions(typeSelect.value);
});

typeFilter.addEventListener("change", () => {
  populateCategoryFilterOptions();
  renderTransactions();
});

categoryFilter.addEventListener("change", () => {
  renderTransactions();
});

cancelEditBtn.addEventListener("click", () => {
  resetForm();
});

transactionsList.addEventListener("click", (event) => {
  const actionButton = event.target.closest("button[data-id]");
  if (!actionButton) return;

  const id = actionButton.dataset.id;
  if (actionButton.classList.contains("delete-btn")) {
    transactions = transactions.filter((transaction) => transaction.id !== id);
    saveTransactions();
    render();
  } else if (actionButton.classList.contains("edit-btn")) {
    startEditing(id);
  }
});

resetForm();
render();
