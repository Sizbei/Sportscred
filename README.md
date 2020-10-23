# SPORTSCRED - SUMMARY

## Objective:
    The objective is to build a web application that allows for people to be more involved in sports, specifically the NBA.
    
    This application allows users to view game results, play sports related trivia both solely and versus, make picks and predictions, and have debates with other users. 
    
    A forum which we’ll be calling the “open court” will also be included to create a community. 
    
    A.C.S (analytical credibility score) will be used to quantitatively rank a user’s sports knowledge gained through using the application.

## Key Users:

    Casual: A user that uses the application from time to time. For example, during important games of the season, or the NBA finals. They may play solo trivia for fun during spare time and make picks/predictions during playoff time. This user will likely not participate in many debates, but may lurk in the open court.

    Enthusiast: A user that frequently uses the application multiple times throughout the day. They will constantly participate in debates and compete against others in trivia in order to farm A.C.S. They will want to make picks/predictions on a variety of categories.

    Admin: An user that ensures the application is fulfilling its objective and also moderates the application. This can include moderation in the open court and discussion in debates. They are there to ensure users are following the terms of service and respond to feedback.

Persona’s of each key user can be found in Personas.pdf

## Key Scenarios:

    Q is a huge NBA fan but he has no friends. However, Q really loves having discussions with people after a game, but the problem is he doesn’t have anyone to talk with. At school, all everyone talks about is Tik Tok. Q wants some way to have meaningful discussion and debates with other people.
    
    M works a 9-5 job from Mondays to Fridays. He doesn’t have much time, but he watches a game here and there after an exhausting day at work. M takes the TTC to work and oftentimes his train is delayed. M wants something to do during his commute to work.

## Key Principles:

    Functionality over Aesthetics - All features should meet functional requirements even if it may come at the cost of the overall aesthetics of the design
    
    Quality over Quantity - Strive to ensure each feature is working as intended in a single category before attempting to expand the number for categories for         features such as trivia and picks/predictions
    
    Recognition rather than recall - Avoid overloading the user with information even if it comes at the cost of excluding certain elements on a page. Try to use objects such as icons rather than text, and keep text short if needed.


## How To Run It Yourself:

Upon cloning the sportcred folder.
There are dependencies that are required to be installed.
Follow the steps carefully to ensure the code runs correctly on your respective devices.

### 1. Ensure that node is installed
    
    To check,
    Open up your command prompt
    cd to the sportcred folder and type in
    
    node -v

    If a version shows, then node is installed on your system. Otherwise, you would need to install it 
    https://nodejs.org/en/

    After installation, type the line below in the terminal of Visual studio code

    node -v 

If it's not being recognized then add the nodeJS folder path to the environment variable: PATH

**Steps following from here assume lines are typed into the terminal of Visual Studio Code**

### 2. From the project-bbqed directory, run the following command:
    
    npm install

### 3. Test that everything related to backend is working by typing the following in 'project-bbqed/backend':
    
    nodemon server
     
    If successful, the server would open and the database can be accessed. 
    
    In terminal, you should see:
     "Server is running on port: 5000
      MongoDB database connection established successfully"
      
### 4. Test that everything related to frontend is working by typing the following in 'project-bbqed':
    
    npm start 
     
    If configured correctly, the code would redirect to a localhost where frontend code is visible

## Credits:
This project is brought to you by team BBQED

