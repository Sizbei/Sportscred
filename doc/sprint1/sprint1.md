## Sprint #1 Planning Meeting
### Team BBQED
### Date: 2020-10-06
--------------------
### Attendence:
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

### Release Goals (Pulled from RPM.md):
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

### Decided Stories to Complete During Sprint 1 (Now with Subtasks!):
------------------------------------------------
- [13]: As a [casual user/enthusiast], I want to sign up with my personal information, so that I can create my sportcred account
    - Subtasks:
        - Need to set up Schema in mongoose + db setup
        - Need to set up routes and connect front to back and send create queries
        - Need to build the page (view & components)
            - Need to make sure that it validates username & emails
- [14]: As a [casual user/enthusiast], I want to sign in my account, so that I can log into the app to enjoy its contents
    - Subtasks:
        - Need routes to query DB and return results to front
        - Need to do authentication & validation
        - Need to build the page to handles signin
        - Need a logout option
- [09]: As a [casual user/enthusiast]. I want to view my own profiles, so that I can validate my personal information and view my account status
    - Subtasks:
        - Need to create a page for profile (view & components)
        - Need to set up routes to query DB for information and return to front
- [10]: As a [casual user/enthusiast], I want to edit my own profiles, so that I can update my personal information
    - Subtasks:
        - Need to create a page or component to handle editing
        - Need routes to send update queries to DB to change information
        - Need something more specific for user image storage
- [27]: As a [casual user/enthusiast], I want to create posts in my status, so that I could share my insights relating with sports with other users
    - Subtasks:
        - Since we'll be making posts from profile, no need for page but maybe a component/popup
        - Need Schema to hold posts in mongoose
        - Need to have routes to send create queries to the db
    - Note that all Stories clearly follow the release goals that are features
    - The number indicates the ticket number in JIRA
        - See subtask allocation on JIRA

### Capacity of the team:
-------------------------
- Estimated 2.5 hours every workday available from each teammate every weekday:
    - 2 Weeks worth of sprint
    - 2.5\*5\*2 = **25 Total Hours working on the project per team member** (Including time spent learning)
    - Capacity lost due to Midterms
        - 6 Midterms will be written by team members, we want to make sure that they have time to study (2 days + date of midterm)
            - **Dates: 17th, 19th, 20th, 23rd**
            - During these times, code flow will probably be slower
        - -2.5\*6\*3 = **45 Total Hours lost as time prepared for other courses**
    - Since A1 was completed before Sprint 1, we won't have time allocated for it
    - Total Hours:
        - 7 Team members
        - 25\*7 - 45 = **130 Hours Totally Available**

