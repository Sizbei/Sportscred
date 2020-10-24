## Release Planning Meeting Sprint #1
### Team BBQED
### Date: 2020-10-02
--------------------
Attendence:
(✓ Ontime, / Late, X Missing)
| Team Member   |   |
| ------------- | -- | 
| Alex Wan      | ✓ |
| Alex Yang     | ✓ |
| Andy Phylim   | ✓ |
| Cherie Kong   | ✓ |
| Deon Li       | ✓ |
| Frank Chen    | ✓ |
| Raymond Chen  | ✓ |

### Release Goals:
---------------------------------------
Goal 1: We want to learn as much as we can about the frameworks and technologies we'll be using
- We had decided to use a MERN stack so:
    - Node.js
    - Express.js
    - React.js
    - MongoDB & mongoose
    - Refresh on HTML & CSS
- We want to make sure we leave enough time in the sprint to learn new technology

Goal 2: SignUp & Registration
- By the end of the sprint we want to be able to sign up a user for SportCred
- This includes checking email formats and uniqueness, unique usernames
- We also need to include the questions the client wants to ask future users
- We should see the user's information to appear in the DB

Goal 3: Login & Authentication
- By the end of the sprint, if a user is signed up we want a user to be able to log into the application
- This would be done by getting the user's information in the DB to check if their credentials are correct

Goal 4: Profile
- We want users to be able to view their profile once they're logged into the application
- This includes viewing ACS history, their "friends" (later renamed radar list), Status and Posts
- We want them to be able to edit their page, status, profile image, etc.
- These changes should be visable the next time they view the page and in the database

Goal 5: Adding Posts
- After discussing with the TA it seemed like our release would be on the lower end of delivery compared to other teams
- We decided to try and push for a 5th goal and added in the ability for users to create posts
- While "The Zone" isn't complete, so we can't view the posts, we're able to at the very least create them and add them into the database

### Decided Stories to Complete During Sprint 1:
------------------------------------------------
- [13]: As a [casual user/enthusiast], I want to sign up with my personal information, so that I can create my sportcred account
- [14]: As a [casual user/enthusiast], I want to sign in my account, so that I can log into the app to enjoy its contents
- [09]: As a [casual user/enthusiast]. I want to view my own profiles, so that I can validate my personal information and view my account status
- [10]: As a [casual user/enthusiast], I want to edit my own profiles, so that I can update my personal information
- [27]: As a [casual user/enthusiast], I want to create posts in my status, so that I could share my insights relating with sports with other users
    - Note that all Stories clearly follow the release goals that are features
    - The number indicates the ticket number in JIRA