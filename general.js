const express = require('express');
const router = express.Router();
const axios = require('axios');

// Función para obtener libros usando async/await con Axios
const getBooks = async () => {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/lib-developer-skills-network/expressBookReview/main/books.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

// Obtener todos los libros
router.get('/', async (req, res) => {
  try {
    const books = await getBooks();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Buscar por ISBN
router.get('/isbn/:isbn', async (req, res) => {
  try {
    const books = await getBooks();
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn === isbn);
    
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book" });
  }
});

// Buscar por Autor
router.get('/author/:author', async (req, res) => {
  try {
    const books = await getBooks();
    const author = req.params.author.toLowerCase();
    const filteredBooks = books.filter(b => 
      b.author.toLowerCase().includes(author)
    );
    
    if (filteredBooks.length > 0) {
      res.status(200).json(filteredBooks);
    } else {
      res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Buscar por Título
router.get('/title/:title', async (req, res) => {
  try {
    const books = await getBooks();
    const title = req.params.title.toLowerCase();
    const filteredBooks = books.filter(b => 
      b.title.toLowerCase().includes(title)
    );
    
    if (filteredBooks.length > 0) {
      res.status(200).json(filteredBooks);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Obtener reseñas
router.get('/review/:isbn', async (req, res) => {
  try {
    const books = await getBooks();
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn === isbn);
    
    if (book) {
      // Simular obtención de reseñas
      const reviews = {
        "user1": "Excellent book!",
        "user2": "Highly recommended"
      };
      res.status(200).json({
        book: book.title,
        reviews: reviews
      });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving reviews" });
  }
});

module.exports = router;
