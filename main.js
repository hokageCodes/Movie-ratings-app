const apiKey = '9b718451';
let currentPage = 1;
let totalPages = 1;



// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const modalOverlay = document.querySelector('.modal-overlay');
const modal = document.getElementById('modal');
const movieTitle = document.getElementById('movie-title');
const movieDetails = document.getElementById('movie-details');

// Event listeners
searchButton.addEventListener('click', searchMovies);
resultsContainer.addEventListener('click', handleResultClick);
modalOverlay.addEventListener('click', closeModal);

// Functions

// Perform a search when the user clicks the search button
function searchMovies() {
  const searchTerm = searchInput.value.trim();

  // Clear previous results
  resultsContainer.innerHTML = '';

  // Make API request
  fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(searchTerm)}&page=${currentPage}`)
    .then(response => response.json())
    .then(data => {
      if (data.Response === 'True') {
        totalPages = Math.ceil(data.totalResults / 10); // Calculate the total number of pages
        displayResults(data.Search);
      } else {
        displayError('No results found.');
      }
    })
    .catch(error => {
      displayError('An error occurred. Please try again later.');
      console.error(error);
    });
}

function loadMoreResults() {
  if (currentPage < totalPages) {
    currentPage++;
    searchMovies();
  }
  
}


// Display the search results
function displayResults(movies) {
  movies.forEach(movie => {
    const movieCard = createMovieCard(movie);
    resultsContainer.appendChild(movieCard);
  });
}

// Create a movie card element
function createMovieCard(movie) {
  const movieCard = document.createElement('div');
  movieCard.classList.add('movie-card');

  const img = document.createElement('img');
  img.src = movie.Poster;
  img.alt = movie.Title;
  movieCard.appendChild(img);

  const title = document.createElement('h3');
  title.textContent = movie.Title;
  movieCard.appendChild(title);

  const year = document.createElement('p');
  year.textContent = movie.Year;
  movieCard.appendChild(year);

  const viewDetailsButton = document.createElement('button');
  viewDetailsButton.classList.add('view-details-button');
  viewDetailsButton.textContent = 'View Details';
  viewDetailsButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent the click event from propagating to the movie card
    const imdbID = movie.imdbID;
    fetchMovieDetails(imdbID, viewDetailsButton);
  });
  movieCard.appendChild(viewDetailsButton);

  return movieCard;
}

// Handle clicks on the result cards or the view details button
function handleResultClick(event) {
  const movieCard = event.target.closest('.movie-card');
  if (movieCard) {
    const imdbID = movieCard.dataset.imdbId;
    const viewDetailsButton = movieCard.querySelector('.view-details-button');
    fetchMovieDetails(imdbID, viewDetailsButton);
  }
}

// Fetch movie details function
function fetchMovieDetails(movieId, detailsButton) {
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}&plot=full`;

  detailsButton.textContent = 'Loading...';
  detailsButton.disabled = true;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.Response === 'True') {
        displayMovieDetails(data);
        showModal(); // Show the modal after fetching and displaying the details
      } else {
        displayMovieDetailsError(data.Error);
      }
    })
    .catch((error) => {
      console.log(error);
      displayMovieDetailsError('An error occurred while fetching movie details.');
    })
    .finally(() => {
      detailsButton.textContent = 'View Details';
      detailsButton.disabled = false;
    });
}



// Display additional movie details in the modal
function displayMovieDetails(movie) {
  movieTitle.textContent = movie.Title;

  movieDetails.innerHTML = `
    <p><strong>Plot:</strong> ${movie.Plot}</p>
    <p><strong>Director:</strong> ${movie.Director}</p>
    <p><strong>Actors:</strong> ${movie.Actors}</p>
    <p><strong>Genre:</strong> ${movie.Genre}</p>
    <p><strong>Released:</strong> ${movie.Released}</p>
    <p><strong>Runtime:</strong> ${movie.Runtime}</p>
    <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
  `;
}

// Display movie details error function
function displayMovieDetailsError(errorMessage) {
  const errorElement = document.createElement('p');
  errorElement.textContent = errorMessage;

  const detailsContainer = document.getElementById('movie-details');
  detailsContainer.appendChild(errorElement);

  // Show the details container
  detailsContainer.style.display = 'block';
}


// Show the modal
function showModal() {
  modalOverlay.style.display = 'block';
}

// Close the modal
function closeModal() {
  modalOverlay.style.display = 'none';
}

// Display an error message
function displayError(message) {
  const errorText = document.createElement('p');
  errorText.textContent = message;
  resultsContainer.appendChild(errorText);
}