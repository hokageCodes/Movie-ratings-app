const apiKey = '9b718451';

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const movieDetails = document.getElementById('movie-details');
const movieTitle = document.getElementById('movie-title');
const modal = document.getElementById('modal');
const closeButton = document.querySelector('.close-button');
const modalOverlay = document.querySelector('.modal-overlay');
const detailsButton = document.createElement('button');

// Event listeners
modalOverlay.addEventListener('click', closeModal);
closeButton.addEventListener('click', closeModal);
searchButton.addEventListener('click', searchMovies);

// Close modal function
function closeModal() {
  modal.style.display = 'none';
  modalOverlay.style.display = 'none';
}

// Search movies function
function searchMovies() {
  const searchTerm = searchInput.value.trim();

  if (searchTerm === '') {
    return;
  }

  const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.Response === 'True') {
        displayMovies(data.Search);
      } else {
        displayErrorMessage(data.Error);
      }
    })
    .catch((error) => {
      console.log(error);
      displayErrorMessage('An error occurred. Please try again.');
    });
}

// Display movies function
function displayMovies(movies) {
  resultsContainer.innerHTML = '';

  movies.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    resultsContainer.appendChild(movieCard);
  });
}

// Create movie card function
function createMovieCard(movie) {
  const movieCard = document.createElement('div');
  movieCard.classList.add('movie-card');
  movieCard.id = movie.imdbID;

  const title = document.createElement('h3');
  title.textContent = movie.Title;

  const poster = document.createElement('img');
  poster.src = movie.Poster === 'N/A' ? 'placeholder.png' : movie.Poster;
  poster.alt = movie.Title;

  const year = document.createElement('p');
  year.textContent = movie.Year;

  const detailsButton = document.createElement('button');
  detailsButton.textContent = 'View Details';
  detailsButton.classList.add('view-details-button'); // Add class to button

  detailsButton.addEventListener('click', () => {
    detailsButton.textContent = 'Loading...';
    detailsButton.disabled = true;
    openModal(movie.imdbID);
    fetchMovieDetails(movie.imdbID);
  });

  movieCard.appendChild(title);
  movieCard.appendChild(poster);
  movieCard.appendChild(year);
  movieCard.appendChild(detailsButton);

  return movieCard;
}

// Open modal function
function openModal(movieId) {
  modal.style.display = 'block';
  modalOverlay.style.display = 'block';
  movieDetails.innerHTML = '';
  movieTitle.textContent = 'Loading...';
}

// Fetch movie details function
function fetchMovieDetails(movieId) {
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}&plot=full`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.Response === 'True') {
        displayMovieDetails(data);
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

// Display movie details function
function displayMovieDetails(movie) {
  movieTitle.textContent = movie.Title;

  const detailsList = document.createElement('ul');
  detailsList.innerHTML = `
    <li><strong>Genre:</strong> ${movie.Genre}</li>
    <li><strong>Released:</strong> ${movie.Released}</li>
    <li><strong>Runtime:</strong> ${movie.Runtime}</li>
    <li><strong>Director:</strong> ${movie.Director}</li>
    <li><strong>Actors:</strong> ${movie.Actors}</li>
    <li><strong>Plot:</strong> ${movie.Plot}</li>
  `;

  movieDetails.appendChild(detailsList);
}

// Display movie details error function
function displayMovieDetailsError(errorMessage) {
  movieTitle.textContent = 'Error';
  const errorParagraph = document.createElement('p');
  errorParagraph.textContent = errorMessage;
  movieDetails.appendChild(errorParagraph);
}

// Display error message function
function displayErrorMessage(errorMessage) {
  resultsContainer.innerHTML = '';
  const errorParagraph = document.createElement('p');
  errorParagraph.textContent = errorMessage;
  resultsContainer.appendChild(errorParagraph);
}
