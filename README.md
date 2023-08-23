# SAC-Wellness-backend

This is a backend system for the SAC wellness bots, apps and many other interfaces. This system is built on Nodejs and ExpressJs framework. Please fork, clone and star our project.
To setup this project, follow the following steps.

- `git clone https://github.com/Anduhailhack/SAC-backend-system.git`
- `npm i`
- `touch .env`
  
# .env file should container the following enviromental variables
- `PORT` a port at which the system runs
- `ADDR` an address at which the system binds
- `MONGO_CONN` database connection string containing the connection to a collection
- `JWT_SECRET` jwt salt for protecting the jwt token, it should be long string with multitude of characters
- `USER_ROLE` any number, preferably long integer to uniquely identify the user role 
- `ADMIN_ROLE` any number, preferably long integer to uniquely identify the admin role 
- `SP_ROLE` any number, preferably long integer to uniquely identify the service providers role
- `BASE_WEB_API` a callback url for notifying the changes in the backend
  
# after setting up the above settings, run the following commands 
- `npm run dev` only for dev purposes
- `npm start` only for production purposes


