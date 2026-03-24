const configButton = document.getElementById("configButton");
const configSubmenu = document.getElementById("configSubmenu");
const searchForm = document.getElementById("searchForm");
const documentSearch = document.getElementById("documentSearch");
const resultSection = document.getElementById("resultSection");
const loadingOverlay = document.getElementById("loadingOverlay");
const searchButton = searchForm?.querySelector("button[type='submit']");

let isSearching = false;

const middlewareData = [
  {
    dataCriacao: "23/03/2026 - 14:25",
    dataAlteracao: "24/03/2026 - 15:00",
    documento: "08005813180",
    numeroSerie: "2256FD8F4021",
    idTerminal: "00646090",
    iccId: "8955555555555555",
    status: "Descredenciada"
  },
  {
    dataCriacao: "20/03/2026 - 14:30",
    dataAlteracao: "24/03/2026 - 12:00",
    documento: "08005813180",
    numeroSerie: "2256FD8F6025",
    idTerminal: "00646091",
    iccId: "8955555555555556",
    status: "Credenciada"
  }
];

const statusClassMap = {
  ativo: "status-ativo",
  inativo: "status-inativo",
  pendente: "status-pendente",
  credenciada: "status-credenciada",
  descredenciada: "status-descredenciada"
};

if (configButton && configSubmenu) {
  configButton.addEventListener("click", () => {
    const isHidden = configSubmenu.hasAttribute("hidden");

    if (isHidden) {
      configSubmenu.removeAttribute("hidden");
      configButton.setAttribute("aria-expanded", "true");
      return;
    }

    configSubmenu.setAttribute("hidden", "");
    configButton.setAttribute("aria-expanded", "false");
  });
}

if (searchForm && documentSearch && resultSection && loadingOverlay && searchButton) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (isSearching) return;

    const documentValue = documentSearch.value.replace(/\D/g, "");
    documentSearch.value = documentValue;

    isSearching = true;
    setLoading(true);
    setSearchButtonState(true);

    window.setTimeout(() => {
      if (documentValue.length !== 11 && documentValue.length !== 14) {
        renderFeedback("Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.");
        finalizeSearch();
        return;
      }

      const results = middlewareData.filter(
        (item) => item.documento.replace(/\D/g, "") === documentValue
      );

      if (results.length === 0) {
        renderFeedback("Nenhum terminal encontrado para o CPF/CNPJ informado.");
        finalizeSearch();
        return;
      }

      renderResults(results);
      finalizeSearch();
    }, 3000);
  });
}

function renderFeedback(message) {
  resultSection.innerHTML = `<p class="feedback">${message}</p>`;
}

function renderResults(items) {
  const rows = items
    .map((item) => {
      const statusClass = statusClassMap[item.status.toLowerCase()] || "status-pendente";

      return `
        <tr>
          <td>${item.dataCriacao}</td>
          <td>${item.dataAlteracao}</td>
          <td>${item.documento}</td>
          <td>${item.numeroSerie}</td>
          <td>${item.idTerminal}</td>
          <td>${item.iccId}</td>
          <td><span class="status-pill ${statusClass}">${item.status}</span></td>
        </tr>
      `;
    })
    .join("");

  resultSection.innerHTML = `
    <table class="result-table">
      <thead>
        <tr>
          <th>Data Criação</th>
          <th>Data de Alteração</th>
          <th>Documento</th>
          <th>Número de Série</th>
          <th>ID Terminal</th>
          <th>IccID</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function setLoading(isLoading) {
  if (isLoading) {
    loadingOverlay.removeAttribute("hidden");
    return;
  }

  loadingOverlay.setAttribute("hidden", "");
}

function setSearchButtonState(isDisabled) {
  searchButton.disabled = isDisabled;
  searchButton.textContent = isDisabled ? "Carregando..." : "Pesquisar";
}

function finalizeSearch() {
  setLoading(false);
  setSearchButtonState(false);
  isSearching = false;
}
