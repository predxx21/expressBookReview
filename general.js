const express = require('express');
const router = express.Router();
const axios = require('axios');

// Servicio independiente para manejar la lógica de libros
const bookService = {
  // URL del archivo JSON de libros
  booksUrl: 'https://raw.githubusercontent.com/ibm-developer-skills-network/expressBookReviews/main/books.json',
  
  // Método para obtener todos los libros usando async/await con Axios
  async getAllBooks() {
    try {
      const response = await axios.get(this.booksUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error.message);
      throw new Error('Unable to retrieve books from the database');
    }
  },
  
  // Método para buscar libro por ISBN
  async getBookByISBN(isbn) {
    try {
      const books = await this.getAllBooks();
      return books.find(book => book.isbn === isbn) || null;
    } catch (error) {
      throw new Error('Error searching book by ISBN');
    }
  },
  
  // Método para buscar libros por autor
  async getBooksByAuthor(authorName) {
    try {
      const books = await this.getAllBooks();
      const authorLower = authorName.toLowerCase();
      return books.filter(book => 
        book.author.toLowerCase().includes(authorLower)
      );
    } catch (error) {
      throw new Error('Error searching books by author');
    }
  },
  
  // Método para buscar libros por título
  async getBooksByTitle(titleName) {
    try {
      const books = await this.getAllBooks();
      const titleLower = titleName.toLowerCase();
      return books.filter(book => 
        book.title.toLowerCase().includes(titleLower)
      );
    } catch (error) {
      throw new Error('Error searching books by title');
    }
  }
};

// Middleware para manejo de errores
const handleResponse = (res, data, successMessage = null) => {
  if (data && (Array.isArray(data) ? data.length > 0 : true)) {
    res.status(200).json({
      success: true,
      message: successMessage || 'Operation successful',
      data: data
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'No books found matching your criteria'
    });
  }
};

// Ruta para obtener todos los libros
router.get('/', async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    handleResponse(res, books, 'All books retrieved successfully');
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving books'
    });
  }
});

// Ruta para buscar por ISBN
router.get('/isbn/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    
    // Validación de entrada
    if (!isbn || isbn.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'ISBN parameter is required'
      });
    }
    
    const book = await bookService.getBookByISBN(isbn);
    
    if (book) {
      res.status(200).json({
        success: true,
        message: 'Book found successfully',
        data: book
      });
    } else {
      res.status(404).json({
        success: false,
        message: `No book found with ISBN: ${isbn}`
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving book by ISBN'
    });
  }
});

// Ruta para buscar por autor
router.get('/author/:author', async (req, res) => {
  try {
    const { author } = req.params;
    
    // Validación de entrada
    if (!author || author.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Author name is required'
      });
    }
    
    const books = await bookService.getBooksByAuthor(author);
    
    if (books.length > 0) {
      res.status(200).json({
        success: true,
        message: `Found ${books.length} book(s) by author: ${author}`,
        count: books.length,
        data: books
      });
    } else {
      res.status(404).json({
        success: false,
        message: `No books found by author: ${author}`
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving books by author'
    });
  }
});

// Ruta para buscar por título
router.get('/title/:title', async (req, res) => {
  try {
    const { title } = req.params;
    
    // Validación de entrada
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Book title is required'
      });
    }
    
    const books = await bookService.getBooksByTitle(title);
    
    if (books.length > 0) {
      res.status(200).json({
        success: true,
        message: `Found ${books.length} book(s) with title containing: ${title}`,
        count: books.length,
        data: books
      });
    } else {
      res.status(404).json({
        success: false,
        message: `No books found with title containing: ${title}`
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving books by title'
    });
  }
});

// Ruta para obtener reseñas de un libro
router.get('/review/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    
    // Validación de entrada
    if (!isbn || isbn.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'ISBN parameter is required'
      });
    }
    
    const book = await bookService.getBookByISBN(isbn);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `No book found with ISBN: ${isbn}`
      });
    }
    
    // Simulación de reseñas (en un caso real, vendrían de una base de datos)
    const sampleReviews = {
      "9780385474542": {
        "user1": "Excelente libro, muy recomendado",
        "user2": "Un clásico de la literatura",
        "user3": "Me encantó la narrativa"
      },
      "9780143039521": {
        "user1": "Cuentos maravillosos",
        "user4": "Perfecto para niños y adultos"
      }
    };
    
    const reviews = sampleReviews[isbn] || {};
    
    res.status(200).json({
      success: true,
      message: `Reviews for book: ${book.title}`,
      data: {
        book: {
          title: book.title,
          author: book.author,
          isbn: book.isbn
        },
        reviews: reviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving book reviews'
    });
  }
});

module.exports = router;
