# project-bbqed
project-bbqed created by GitHub Classroom

Upon cloning the sportcred folder
There are dependencies that are required to be installed
Follow the steps carefully to ensure the code runs correctly on your respective devices

1. Ensure that node is installed
To check,
Open up your command prompt
cd to the sportcred folder and type in
     Node -v

If a version shows, then node is installed on your system. Otherwise, you would need to install it 
https://nodejs.org/en/

After installation, type the line below in the terminal of Visual studio code
     Node -v 

If it's not being recognized then add the nodeJS folder path to the environment variable: PATH

2. Steps following from here assume lines are typed into the terminal of Visual Studio Code
and if any problems arise, the line below should be typed
     npm audit fix 

From the sportcred folder, cd to backend folder and type:
     npm init -y

3. Type the below line:
     npm install express cors mongoose dotenv

4. Install nodemon.
     npm install -g nodemon

Sometimes, the npm install -g will be prohibited. If that is occurring type the line
     sudo install -g nodemon

5. Test that everything related to backend is working by typing the following:
     nodemon server
     
If successful, the server would open and the database can be accessed. 
In terminal, you should see:
     "Server is running on port: 5000
      MongoDB database connection established successfully"

6. Now cd to the src folder from the backend folder and type the following:
     npm install bootstrap 
     (This may involve install jquery and popper as well)
     npm install react-router-dom
     npm install axios
     npm install react-hook-form
     npm install react-multi-select-component
     
7. Test that everything related to frontend is working by typing the following:
     npm start 
If configured correctly, the code would redirect to a localhost where frontend code is visible
