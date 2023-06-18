const apiKey = '9b718451';
const apiKeytmdb = '1c8c506c2972c4d18841252b9b749fa4';

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
window.addEventListener('load', fetchRandomMovies);



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

// Fetch random movies by popularity from the API
function fetchRandomMovies() {
  if (isLoading) return;

  isLoading = true;

  // Simulate loading state
  showLoadingState();

  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKeytmdb}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`;

  // Make API request
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results.length > 0) {
        displayResults(data.results, 'random-movies-container');
      } else {
        displayError('An error occurred while fetching random movies.');
      }
    })
    .catch((error) => {
      displayError('An error occurred. Please try again later.');
      console.error(error);
    })
    .finally(() => {
      isLoading = false;
      hideLoadingState();
    });
}

// Perform a search when the user clicks the search button
function searchMovies() {
  const searchTerm = searchInput.value.trim();

  // Clear previous results and reset pagination variables
  resultsContainer.innerHTML = '';
  currentPage = 1;
  totalResults = 0;

  if (searchTerm === '') {
    // Fetch random movies
    fetchRandomMovies();
  } else {
    // Fetch movies from the OMDB API
    fetchMovies(searchTerm);
  }
}


// Fetch random movies by popularity from the TMDB API
function fetchTMBDandomMovies() {
  if (isLoading) return;

  isLoading = true;

  // Simulate loading state
  showLoadingState();

  const randomPage = Math.floor(Math.random() * 500) + 1; // Generate a random page number (assuming a total of 500 pages)

  const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${randomPage}&sort_by=popularity.desc&api_key=${apiKeytmdb}`;

  // Make API request
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results.length > 0) {
        displayResults(data.results, 'random-movies-container');
      } else {
        displayError('An error occurred while fetching random movies.');
      }
    })
    .catch((error) => {
      displayError('An error occurred. Please try again later.');
      console.error(error);
    })
    .finally(() => {
      isLoading = false;
      hideLoadingState();
    });
}

// Call fetchOMDBRandomMovies to start fetching movies
fetchTMBDandomMovies();



// Call fetchRandomMovies to start fetching movies
fetchRandomMovies();




// Display the search results
function displayResults(movies) {
  if (movies.length === 0) {
    displayNoResultsMessage();
    return;
  }

  movies.forEach(movie => {
    const movieCard = createMovieCard(movie);
    resultsContainer.appendChild(movieCard);
  });
}

// Display a message when there are no search results
function displayNoResultsMessage() {
  const message = document.createElement('p');
  message.textContent = 'No results found.';
  resultsContainer.appendChild(message);
}


// Create a movie card element
function createMovieCard(movie) {
  const movieCard = document.createElement('div');
  movieCard.classList.add('movie-card');

  const img = document.createElement('img');
  img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  img.alt = movie.title;
  movieCard.appendChild(img);

  const title = document.createElement('h3');
  title.textContent = movie.title;
  movieCard.appendChild(title);

  const year = document.createElement('p');
  year.textContent = movie.release_date;
  movieCard.appendChild(year);

  const viewDetailsButton = document.createElement('button');
  viewDetailsButton.classList.add('view-details-button');
  viewDetailsButton.textContent = 'View Details';
  viewDetailsButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent the click event from propagating to the movie card
    const movieId = movie.id;
    fetchMovieDetails(movieId, viewDetailsButton);
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


// Display movie details and additional movie details in the modal
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

// Expand the plot text to show the full content
function expandPlotText() {
  const plotTextElement = document.getElementById('plot-text');
  const fullText = movieDetails.querySelector('p').querySelector('span').textContent;

  plotTextElement.textContent = fullText;
  plotTextElement.removeEventListener('click', expandPlotText);
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
    const searchTerm = searchInput.value.trim();
    fetchMovies(searchTerm, currentPage);
  }
}

// Show the loading state
function showLoadingState() {
  const loadingText = document.createElement('p');
  loadingText.textContent = 'Loading...';
  loadingText.classList.add('loading-text');
  resultsContainer.appendChild(loadingText);
}

// Hide the loading state
function hideLoadingState() {
  const loadingText = resultsContainer.querySelector('.loading-text');
  if (loadingText) {
    loadingText.remove();
  }
}