# ![restaurant](https://cdn-icons-png.flaticon.com/128/2311/2311475.png)RocketFood
A comprehensive application that simulates a virtual restaurant menu. It features two types of personas: the restaurant administrator and the user (customer).
This frontend application is built on Clean Architecture, with Controllers handling relevant route methods, providing clarity and easy understanding.
This backend API was developed to be widely consumed by a frontend or any other application that wishes to access the information stored in the used database.
It retrieves all data from a SQLite Database to deliver dish images, as well as their details, description, price, category, etc. It also provides information about registered users and allows registration of both users and dishes by the restaurant administrator.

# 🧩 Fundamentals
- Business Logic: Contains all the necessary business logic to deliver the information requested by the frontend. This includes processing data, performing calculations, applying business rules, and determining how different application components interact with each other.

- Data Management: Manages access to application data through a SQLite database. It handles data queries, updates, inserts, and deletes.

- Data Validation: This API validates incoming data to ensure correctness, consistency, and security through the SessionsController.

- Authentication and Authorization: Implements an authentication and authorization system to control who can access which resources and functionalities. This is necessary due to the two personas that can make requests in the interface. This includes generating and validating authentication tokens, checking permissions, and protecting against unauthorized access through Middleware.

- Response Formatting: Formats responses in JSON. It also sets appropriate HTTP status codes to indicate the outcome of the request.

- Error Handling: Facilitates error handling with the AppError class, used to create custom error objects.

- Routing and Endpoints: Defines clear routes and endpoints for different resources and functionalities. Each endpoint corresponds to a specific resource and is responsible for handling requests related to that resource.

- Logs: Code is properly versioned using GIT for activity tracking and diagnosing potential issues.

- Security: Data protection through the use of environment variables, the '.env' file.

# 🎮 Features and Controllers:
Backend application based on route handling by Controllers. Each route leads to a different controller, depending on what was requested via the frontend's HTTP request.
Through the Controllers, business rules are managed, data is processed, and appropriate responses are returned.
Within each Controller, the basic CRUD operations are respected, with a maximum of 5 methods in each Controller, without method repetition, to achieve well-structured code.

## DishesController:
Manages operations related to dishes in an application. Operations include creating, showing details, updating, and deleting dishes, as well as listing existing dishes with search filters.

- Dish Creation:
Accepts an HTTP POST request with dish information, including title, description, price, category, ingredients, and photo.
Saves the image using a disk storage provider.
Inserts dish details and its ingredients into the database.

- Show Dish Details:
Accepts an HTTP GET request with the dish's ID.
Retrieves the dish's details and its corresponding ingredients from the database.
Returns the dish's details, including its ingredients, as a JSON response.

- Dish Update:
Accepts an HTTP PUT request with the dish's ID and updated information.
Updates the dish's details in the database, including the ability to update the image.
Updates ingredients associated with the dish.

- Dish Deletion:
Accepts an HTTP DELETE request with the dish's ID.
Removes the dish from the database.

- List Dishes:
Accepts an HTTP GET request to list dishes.
Accepts query parameters to filter by title and/or ingredients.
Returns a list of dishes from the database, possibly filtered by title or ingredients.
Includes ingredient details for each dish in the JSON response.

The controller uses the Knex library to interact with the database, as well as a disk storage provider to manage dish images. It also handles specific scenarios, such as ingredient updates and dish retrieval based on ingredients.

## FavoritesController:
Handles operations related to favorite dishes in an application. It has functions to create, list, show details, and remove favorite dishes for a specific user.

- Create: Creates a new favorite for a dish. It checks if the user exists, if the dish exists, and then inserts a record in the favorites table.

- Index: Lists all favorite dishes for a user. It joins the favorites and dishes tables using an INNER JOIN and returns a list of the user's favorite dishes.

- Show: Shows details of a specific favorite dish for the user. It combines the favorites and dishes tables using an INNER JOIN and returns the details of the requested favorite dish.

- Delete: Removes a specific favorite dish by dish ID.

This controller uses the Knex library to interact with the database and also checks for the existence of the user and the dish before performing operations. It provides an interface to manage a user's collection of favorite dishes.

## IngredientsController:
Responsible for handling operations related to a dish's ingredients. It has a function called "index" that lists the ingredients of a specific dish.

- Index: Accepts an HTTP GET request with the dish_id (dish ID) as a parameter in the request parameters. It uses the dish_id to fetch ingredients related to that dish in the database. Ingredients are obtained using the "where" method based on dish_id, and then grouped by name using "groupBy."

Returns a JSON response containing the list of ingredients.

The controller uses the Knex library to interact with the database, and in this case, the "index" function is used to get the list of ingredients associated with a specific dish.

## OrderItemsController:
Responsible for handling the creation of order items in an application. It accepts a set of items and an order ID and inserts these items into the order items table.

- Create: Accepts an HTTP POST request with the request body containing the items (order items) and the order_id (order ID) to which the order belongs.
Checks if the order with the provided ID exists in the orders table.
If the order doesn't exist, it throws an error using the AppError class.
Maps the received items to the format that will be inserted into the order items table.
Inserts the items into the order_items table.
Responsible for receiving the items from an order and associating them with the specific order in the order_items table. It checks for the existence of the order and then inserts the items into the database.

## OrdersController:
Responsible for handling operations related to orders in an application. It covers functions to create, show details, list, update, and delete orders.

- Create: Creates a new order for a user. It checks if the user is logged in, gets the current time in São Paulo (using the moment-timezone library), and inserts a new order with the user's ID and creation/update dates.

- Show: Shows details of orders for a specific user. It joins the orders and order items tables using INNER JOIN and returns details of the orders, including related items.

- Index: Lists all existing orders with item details. It joins the orders and order items tables using INNER JOIN and returns details of all orders, including related items.

- Update: Updates the status of a specific order. It checks if the order exists and updates the status.

- Delete: Removes a specific order by order ID.

Handles all operations related to orders and their associated items. It uses the Knex library to interact with the database and the moment-timezone library to handle dates and times in different time zones.

## SessionsController:
Responsible for handling operations related to user authentication and session creation.

- Create: Creates a new user session (login). It receives the email and password from the request body.
Checks if a user with the provided email exists in the database.
- If the user doesn't exist, it throws an error using the AppError class.
- Compares the provided password with the user's hashed password using the "compare" method of bcryptjs.
- If the password doesn't match, it throws an error using the AppError class.
- Gets the secret key and token expiration time from the authentication settings.
- Creates a signed JWT token containing the user's ID as the content and expiration time.
Returns the user and token as a response.

This controller is responsible for authenticating users, comparing their hashed passwords, and generating JWT tokens for active sessions. It uses the Knex library to interact with the database, the bcryptjs library to compare hashed passwords, and the jsonwebtoken library to create and sign JWT tokens.

## UsersController:
Responsible for handling operations related to users, such as creating and updating user information.

- Create: Creates a new user.

Checks if a user with the provided email already exists in the database.
If the user already exists, it throws an error.
Encrypts the provided password using bcryptjs hash.
Inserts the new user into the database.
Returns a status 201 (Created) as a response.

- Update: Updates user information.
Gets the ID of the authenticated user.
Fetches the user by ID.
Checks if another user already has the updated email and throws an error if necessary.
Updates the user's name and email if provided.
Checks if the new password was provided without the old password and throws an error if necessary.
Compares the provided old password with the user's current password.
If the old password matches, encrypts the new password using bcryptjs hash.
Updates the user's data in the database.
Returns a status 201 (Created) as a response.

This controller is responsible for handling the creation of new users, ensuring that emails are unique, and encrypting passwords. It also handles updating user information, including the ability to update the password with verification of the old password.

# 🐱 Code Versioning
- Git
- Github

#  🚀 Technologies Used
- NodeJs
- JavaScript
- RESTful API
- Relational Database (SQLite)

# 📚 Libraries used
- bcryptjs: 2.4.3
- cors: 2.8.5
- dotenv: 16.3.1
- express: 4.18.2
- express-async-errors: 3.1.1
- jsonwebtoken: 9.0.1
- knex: 2.4.2
- moment-timezone: 0.5.43
- multer: 1.4.5-lts.1
- pm2: 5.3.0
- sqlite: 4.2.1
- sqlite3: 5.1.6
- diskStorage: Um provedor de armazenamento em disco
- path: Biblioteca para trabalhar com caminhos de arquivo
- fs: Biblioteca para lidar com a manipulação de arquivos e diretórios

Development dependency:
- nodemon: To automatically restart the server during development.
# 🧭 Usage Guidelines
- To install the project dependencies and initiate its functionality, execute the command npm i or yarn i in the terminal. It's important to run this command to ensure that all necessary dependencies are installed correctly.

- To initialize the database tables, run the command "npm run migrate".

- The administrator and the user are identified through the isAdmin logic developed in the backend to be consumed. This logic returns a boolean value; if it's "1," it indicates an administrator, and if it's "0," it signifies a user. This value should already be configured directly in the database, with "1" indicating an administrator role.

- Steps to Run the Project:

1 Clone the Repository:
Open the terminal or command prompt and navigate to the directory where you want to clone the project. Then, execute the command: 'git clone <REPOSITORY_URL_TO_CLONE>'

2 Access the Project Directory:
Use the 'cd' command in the integrated terminal to enter the cloned project directory.

3 Install Dependencies:
Ensure that you have Node.js installed on your machine. Run the following command to install the project's dependencies listed in the package.json file: 'npm install'

4 Configure Environment Variables:
Set up environment variables as per the .env.example file.

5 Run the Project:
In the integrated terminal, run the command: 'npm run dev'

# 🔗 Links
This backend is being kept running by PM2, and it's hosted on Render.

PM2 (Process Manager 2) is a process manager for Node.js applications that helps in managing and maintaining the execution of Node.js processes. It ensures that your Node.js applications run continuously and are automatically restarted in case of crashes or failures. PM2 provides features like process monitoring, load balancing, automatic restarts, logging, and more, making it suitable for deploying and managing Node.js applications in production environments.

"Render" is a cloud hosting platform that enables easy and efficient deployment and management of web applications and services. It is specifically designed for developers looking to simplify the deployment and management process of their applications, offering a streamlined experience compared to more complex hosting solutions.

[![deploy](https://img.shields.io/badge/deploy-00BFFF?style=for-the-badge&logo=cloud&logoColor=white)](https://rocketfood-api-im2b.onrender.com)

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/larissa-adler-ewertoncoelho1000)

# ⏯️ Previews
Here are just a few of the archives of this Application.

- Migrations: createUsers.js
![migrations](https://github.com/LaraAEC/api_foodExplorer/assets/91379960/95418b76-7323-48a2-900b-23fb98a536e7)

- Auth.js
![authjs](https://github.com/LaraAEC/api_foodExplorer/assets/91379960/7bd7dec0-08e5-4383-8cfc-0a4579a67813)

- DishesController.js
![dishescontroller](https://github.com/LaraAEC/api_foodExplorer/assets/91379960/41b210ee-2b91-4ce0-a28a-c008f8f435bc)

- DishesController.js
![dishescontroller2](https://github.com/LaraAEC/api_foodExplorer/assets/91379960/f0d65711-d8d4-4f94-9858-69f788cd381a)

- OrdersController.js
![orderscontroller](https://github.com/LaraAEC/api_foodExplorer/assets/91379960/c38326bd-f6d7-46e7-9ec1-e4db2ec292db)

- Upload.js
![uploads](https://github.com/LaraAEC/api_foodExplorer/assets/91379960/53488fd9-e827-4fed-a237-a7a9395d96c3)

- Index Routes
![routes](https://github.com/LaraAEC/api_foodExplorer/assets/91379960/35f46e8e-8fa4-4657-8db1-93fd8f0cd53d)