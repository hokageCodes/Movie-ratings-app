const apiKey = '9b718451';

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const modalOverlay = document.querySelector('.modal-overlay');
const closeButton = document.querySelector('.close-button');

const modal = document.getElementById('modal');
const movieTitle = document.getElementById('movie-title');
const movieDetails = document.getElementById('movie-details');

// Event listeners
searchButton.addEventListener('click', searchMovies);
resultsContainer.addEventListener('click', handleResultClick);
modalOverlay.addEventListener('click', closeModal);
window.addEventListener('scroll', handleScroll);
closeButton.addEventListener('click', closeModal);
const scrollToTopButton = document.getElementById('scroll-to-top-button');

// Show or hide the scroll-to-top button based on the scroll position
function toggleScrollToTopButton() {
  if (window.scrollY > 200) {
    scrollToTopButton.style.display = 'block';
  } else {
    scrollToTopButton.style.display = 'none';
  }
}

// Scroll to the top of the page when the button is clicked
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add event listeners
window.addEventListener('scroll', toggleScrollToTopButton);
scrollToTopButton.addEventListener('click', scrollToTop);



// Variables
let currentPage = 1; // Track the current page of results
const resultsPerPage = 5; // Number of results per page
let totalResults = 0; // Total number of results
let isLoading = false; // Flag to prevent multiple simultaneous API requests

// Functions

// Perform a search when the user clicks the search button
function searchMovies() {
  const searchTerm = searchInput.value.trim();

  // Clear previous results and reset pagination variables
  resultsContainer.innerHTML = '';
  currentPage = 1;
  totalResults = 0;

  // Make API request for the first page of results
  fetchMovies(searchTerm, currentPage);
}

// Fetch movies from the API
function fetchMovies(searchTerm, page) {
  if (isLoading) return;

  isLoading = true;

  // Simulate loading state
  showLoadingState();

  const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(searchTerm)}&page=${page}`;

  // Make API request
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.Response === 'True') {
        totalResults = parseInt(data.totalResults);
        displayResults(data.Search);
      } else {
        displayError('No results found.');
      }
    })
    .catch(error => {
      displayError('An error occurred. Please try again later.');
      console.error(error);
    })
    .finally(() => {
      isLoading = false;
      hideLoadingState();
    });
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

// Handle scroll event for infinite scroll
function handleScroll() {
  const scrollPosition = window.innerHeight + window.scrollY;
  const containerHeight = resultsContainer.offsetHeight;

  if (scrollPosition >= containerHeight && !isLoading && totalResults > resultsPerPage) {
    currentPage++;
    fetchMovies(searchInput.value.trim(), currentPage);
  }
}

// Show loading state
function showLoadingState() {
  const loadingIndicator = document.createElement('div');
  loadingIndicator.classList.add('loading-indicator');
  loadingIndicator.textContent = 'Loading...';
  resultsContainer.appendChild(loadingIndicator);
}

// Hide loading state
function hideLoadingState() {
  const loadingIndicator = document.querySelector('.loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.remove();
  }
}

// Delay function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Delay before loading the next set of results
const delayInMilliseconds = 2000;

// Override the fetchMovies function to add a delay
const originalFetchMovies = fetchMovies;
fetchMovies = async (searchTerm, page) => {
  originalFetchMovies(searchTerm, page);
  await delay(delayInMilliseconds);
};

