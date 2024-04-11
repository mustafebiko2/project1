let books = []; // Initialize an empty array to store book objects

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-btn');
    const resultsContainer = document.getElementById('results-container');

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            getBooks(searchTerm);
        }
    });

    const getBooks = async (item) => {
        const apiUrl = `https://openlibrary.org/search.json?q=${item}`; // Corrected API URL with backticks

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            console.log(data);

            displayResults(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const displayResults = async (data) => {
        resultsContainer.innerHTML = '';

        if (data && data.docs && data.docs.length > 0) {
            books = []; // Clear existing books array

            for (const book of data.docs) {
                const bookElement = document.createElement('div');
                bookElement.classList.add('book-item');

                const imageUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`; // Corrected image URL with backticks
                const imageElement = document.createElement('img');
                imageElement.src = imageUrl;
                imageElement.alt = book.title;
                bookElement.appendChild(imageElement);

                const bookInfo = document.createElement('div');
                bookInfo.innerHTML = `
                    <h3>${book.title}</h3>
                    <p>Author(s): ${book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
                    <p>First Published: ${book.first_publish_year || 'N/A'}</p>
                    <button class="borrow-btn" data-key="${book.key}">Borrow</button>
                `;
                bookElement.appendChild(bookInfo);

                resultsContainer.appendChild(bookElement);

                const newBook = {
                    title: book.title,
                    authors: book.author_name ? book.author_name.join(', ') : 'Unknown',
                    firstPublished: book.first_publish_year || 'N/A',
                    key: book.key,
                    imageUrl: imageUrl // Store image URL in the book object
                };
                books.push(newBook); // Store book information in the 'books' array
            }

            // Add event listeners to borrow buttons
            const borrowButtons = document.querySelectorAll('.borrow-btn');
            borrowButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const bookKey = event.target.getAttribute('data-key');
                    const selectedBook = books.find(book => book.key === bookKey);
                    if (selectedBook) {
                        borrowBook(selectedBook);
                    }
                });
            });
        } else {
            resultsContainer.innerHTML = '<p>No results found</p>';
        }
    };

    const borrowBook = (selectedBook) => {
        console.log('Borrowing book:', selectedBook); // Corrected console.log statement with quotation marks
        // Perform borrow action using the selected book object (e.g., send borrowing request to server)
        alert(`Book "${selectedBook.title}" borrowed successfully!`); // Corrected alert message with backticks
    };
});
