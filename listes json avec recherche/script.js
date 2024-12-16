
const searchInput = document.getElementById('searchInput');
const filterDepartment = document.getElementById('filterDepartment');
const employeeTableBody = document.querySelector('#employeeTable tbody');
const errorMessageDiv = document.getElementById('error-message');
const paginationDiv = document.querySelector('.pagination'); 
const rowsPerPageSelect = document.getElementById('rowsPerPage'); 

//  les employés dapres fichier JSON
let employees = [];
let currentPage = 1;
let employeesPerPage = 5; 

//  les employés au chargement de la page
async function loadEmployees() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Erreur de chargement des données');
    employees = await response.json();
    displayEmployees(employees);
  } catch (error) {
    console.error('Erreur:', error);
    errorMessageDiv.textContent = "Une erreur est survenue : " + error.message;
    errorMessageDiv.style.display = 'block';
    employeeTableBody.innerHTML = '<tr><td colspan="6">Erreur lors du chargement des données.</td></tr>';
  }
}

// Fonction pour mettre à jour la pagination
function updatePagination(totalEmployees) {
  const totalPages = employeesPerPage === 'all' ? 1 : Math.ceil(totalEmployees / employeesPerPage);

  paginationDiv.innerHTML = ''; 
  if (totalPages <= 1) return; 

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.addEventListener('click', () => goToPage(i));
    if (i === currentPage) button.disabled = true; 
    paginationDiv.appendChild(button);
  }
}

// Fonction pour aller à une page spécifique
function goToPage(pageNumber) {
  currentPage = pageNumber;
  filterEmployees(); 
}

// Fonction pour afficher les employés
function displayEmployees(data) {
  employeeTableBody.innerHTML = ''; 

  // Calculer les employés à afficher en fonction de la pagination
  const startIndex = (currentPage - 1) * employeesPerPage;
  const endIndex = employeesPerPage === 'all' ? data.length : startIndex + employeesPerPage;

  const employeesToShow = data.slice(startIndex, endIndex);

  // Ajouter les employés au tableau
  employeesToShow.forEach(employee => {
    const row = `
      <tr>
        <td>${employee.name}</td>
        <td>${employee.department}</td>
        <td>${employee.address.city}</td>
        <td>${employee.age}</td>
        <td>${employee.isActive ? 'Oui' : 'Non'}</td>
        <td>${employee.skills.join(', ')}</td>
      </tr>
    `;
    employeeTableBody.innerHTML += row;
  });

  // Mettre à jour la pagination
  updatePagination(data.length);
}

// Fonction de filtrage
function filterEmployees() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedDepartment = filterDepartment.value;

  const filteredEmployees = employees.filter(employee => {
    const matchesNameOrCity =
      employee.name.toLowerCase().includes(searchTerm) ||
      employee.department.toLowerCase().includes(searchTerm) ||
      employee.address.city.toLowerCase().includes(searchTerm);

    const matchesDepartment =
      selectedDepartment === '' || 
      employee.department === selectedDepartment;

    return matchesNameOrCity && matchesDepartment;
  });

  displayEmployees(filteredEmployees);

  if (filteredEmployees.length === 0) {
    // Si aucun résultat n'est trouvé, afficher le message d'erreur
    errorMessageDiv.style.display = 'block';
    errorMessageDiv.textContent = 'Aucun employé trouvé avec les critères de recherche.';
  } else {
    // Si des résultats sont trouvés, cacher le message d'erreur
    errorMessageDiv.style.display = 'none';
  }
}

// Gestion du changement de lignes par page
rowsPerPageSelect.addEventListener('change', () => {
  const selectedValue = rowsPerPageSelect.value;

  if (selectedValue === 'all') {
    employeesPerPage = 'all';
    currentPage = 1; 
  } else {
    employeesPerPage = parseInt(selectedValue);
    currentPage = 1; 
  }

  filterEmployees(); 
});

// Écouteurs d'événements
searchInput.addEventListener('input', filterEmployees);
filterDepartment.addEventListener('change', filterEmployees);

// Charger les employés au chargement de la page
loadEmployees();
