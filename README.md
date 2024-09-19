# Heros and Minors

## Overview

'Heros and Minors' is a full-stack web application designed to empower children and their families through interactive games and a platform for donating and receiving gently used items or services.

### Features

- **Maze Game:** Engage in a fun maze-solving challenge.
- **Hidden Object Game:** Test observation skills with hidden object puzzles.
- **Wishlist:** Create and manage wishlists of desired items or experiences.
- **Donation Platform ('Heros'):** Donate or request gently used items or services.

## Technologies Used

- **Frontend:** HTML5, CSS, JavaScript, React
- **Backend:** Node.js, Express.js, MongoDB
- **Others:** Canvas API (for games), RESTful API architecture

## Installation

To run 'Heros and Minors' locally, follow these steps:

1. **Clone Repository:**
   ```bash
   git clone https://github.com/brikhotso/heros_and_minors.git
   cd heros_and_minors
   ```

2. **Install Dependencies:**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set Up Environment Variables:**
   - Create a `.env` file in the `backend` directory with the following variables:
     ```
     PORT=3001
     MONGODB_URI=<your_mongodb_uri>
     ```

4. **Run Backend Server:**
   ```bash
   # From the backend directory
   npm start
   ```

5. **Run Frontend Development Server:**
   ```bash
   # From the frontend directory
   npm start
   ```

6. **Access Application:**
   Open your web browser and go to `http://localhost:3000` to view the application.

## Usage

- **Creating an Account:** Sign up using the registration form.
- **Exploring Games:** Navigate to the maze game or hidden object game sections.
- **Managing Wishlist:** Add, delete, and grant wishes from your wishlist.
- **Donating ('Heros'):** Donate items or services and manage donation requests.

## Contributing

Contributions are welcome! If you have suggestions, feature requests, or found a bug, please open an issue or submit a pull request.

## Authors

- Brenda Rikhotso ([@brikhotso](https://github.com/brikhotso))

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspiration and support from family and friends.
