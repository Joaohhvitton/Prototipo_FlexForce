const configButton = document.getElementById("configButton");
const configSubmenu = document.getElementById("configSubmenu");
const openMiddlewareQuery = document.getElementById("openMiddlewareQuery");

const searchForm = document.getElementById("searchForm");
const serialSearch = document.getElementById("serialSearch");
const resultSection = document.getElementById("resultSection");
const loadingOverlay = document.getElementById("loadingOverlay");
const searchButton = searchForm?.querySelector("button[type='submit']");

let isSearching = false;

const middlewareData = [
  {
    dataCriacao: "25/03/2026 - 15:00",
    dataAlteracao: "26/03/2026 - 15:00",
    documento: "86099578536",
    numeroSerie: "2256FD8F4021",
    idTerminal: "00646090",
    iccId: "8955555555555555",
    status: "Alocado"
  },

   {
    dataCriacao: "22/03/2026 - 15:00",
    dataAlteracao: "25/03/2026 - 15:00",
    documento: "86099578536",
    numeroSerie: "2256FD8F4021",
    idTerminal: "00646090",
    iccId: "8955555555555555",
    status: "Desalocado"
  },

     {
    dataCriacao: "21/03/2026 - 15:00",
    dataAlteracao: "22/03/2026 - 15:00",
    documento: "86099578536",
    numeroSerie: "2256FD8F4021",
    idTerminal: "00646090",
    iccId: "8955555555555555",
    status: "Desalocado"
  },

     {
    dataCriacao: "20/03/2026 - 10:25",
    dataAlteracao: "21/03/2026 - 15:00",
    documento: "26828025000171",
    numeroSerie: "2256FD8F4021",
    idTerminal: "00646090",
    iccId: "8955555555555555",
    status: "Desalocado"
  },

  {
    dataCriacao: "20/03/2026 - 14:30",
    dataAlteracao: "24/03/2026 - 12:00",
    documento: "08005813180",
    numeroSerie: "2256FD8F6025",
    idTerminal: "00646091",
    iccId: "8955555555555556",
    status: "Alocado"
  }
];

const statusClassMap = {
  ativo: "status-ativo",
  inativo: "status-inativo",
  pendente: "status-pendente",
  credenciada: "status-credenciada",
  descredenciada: "status-descredenciada",
  alocado: "status-alocado",
  desalocado: "status-desalocado"
};

if (configButton && configSubmenu) {
  configButton.addEventListener("click", () => {
    const isHidden = configSubmenu.hasAttribute("hidden");

    if (isHidden) {
      configSubmenu.removeAttribute("hidden");
      configButton.setAttribute("aria-expanded", "true");
    } else {
      configSubmenu.setAttribute("hidden", "");
      configButton.setAttribute("aria-expanded", "false");
    }
  });
}

if (openMiddlewareQuery) {
  openMiddlewareQuery.addEventListener("click", () => {
    const queryCard = document.querySelector(".query-card");
    if (queryCard) {
      queryCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

if (searchForm && serialSearch && resultSection && loadingOverlay && searchButton) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (isSearching) return;

    const serialValue = serialSearch.value.trim().toUpperCase();
    serialSearch.value = serialValue;

    isSearching = true;
    setLoading(true);
    setSearchButtonState(true);

    window.setTimeout(() => {
      if (serialValue.length < 6) {
        renderFeedback("Informe um número de série válido.");
        finalizeSearch();
        return;
      }

      const results = middlewareData.filter(
        (item) => item.numeroSerie.trim().toUpperCase() === serialValue
      );

      if (results.length === 0) {
        renderFeedback("Nenhum histórico encontrado para o número de série informado.");
        finalizeSearch();
        return;
      }

      renderResults(results);
      finalizeSearch();
    }, 1200);
  });
}

function renderFeedback(message) {
  if (!resultSection) return;
  resultSection.innerHTML = `<p class="feedback">${message}</p>`;
}

function renderResults(items) {
  if (!resultSection) return;

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
          <th>Data Alteração</th>
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
  if (!loadingOverlay) return;

  if (isLoading) {
    loadingOverlay.removeAttribute("hidden");
  } else {
    loadingOverlay.setAttribute("hidden", "");
  }
}

function setSearchButtonState(isDisabled) {
  if (!searchButton) return;
  searchButton.disabled = isDisabled;
  searchButton.textContent = isDisabled ? "Carregando..." : "Pesquisar";
}

function finalizeSearch() {
  setLoading(false);
  setSearchButtonState(false);
  isSearching = false;
}
