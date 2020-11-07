## Release Planning Meeting Sprint #2
### Team BBQED
### Date: 2020-10-20
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
Goal 1: The Zone
- While we finished the ability to make posts, we didn't have anyway to view them or interact with them
- Thus it made sense to work on the main landing page "The Zone" next
- Interactions should include like-dislike and commenting

Goal 2: Radar List, Profile & Settings Completion
- While we made the skeleton for profile and the abilities to view and edit profiles, there were features we didn't assign to sprint-1
- We wanted to add to the profile page and make it feel more complete so we decided to work on the Radar List
- During our last meeting with the client, they put a heavy emphasis on the radar list which also played into our decision making
- Include it's ability to add and remove people from the list
- We also wanted to work on Settings, since we worked on editing profile, which leads into settings

Goal 3: Trivia
- While the first two goals were heavily related to sprint-1, we want to start something mostly new for this sprint as well
- After debating over which "net-new" feature we wanted to do, we decided on the Trivia feature
- After this sprint, we should be able to play trivia with ourselves or others and see it reflect in our ACS scores 

### Decided Stories to Complete During Sprint 2:
------------------------------------------------

Goal 1:
- [3] As a [enthusiast], I want to be able to report posts so that [moderators] can remove the post and keep the community safe.
    - Subtasks:
        - Create new route to handle the report option
        - Update post and comment models to track what has been reported including the # of reports
        - Create the UI that will activate the route
- [18] As a [casual user/enthusiast], I want to interact with others through posts so that I can stay up to date about the sports community and make more accurate predictions.
    - Subtasks:
        - Create the new view for "The Zone"
        - Create seperate view for individual posts
        - Create routes that will handle things for the zone, including the option to create a comment, agree/disagree and gather relevant posts
        - (Optional) Compressed View - Where the posts you see is only based off the signed-in person's radarlist
Goal 2:
- [8] As a [casual user/enthusiast], I want to view other people’s profiles, so that I can get to know other people better.
    - Subtasks:
        - Update the view to hide certain options depending on who is viewing the profile page (Follow/Unfollow & Create Post)
        - Update the routes to handle new data for Radarlist and ACS
- [11] As a [casual user/enthusiast], I want to have the follow option in other people’s profiles, so that I can add other people to my radar list
    - Subtasks:
        - Update the view on other profiles to handle following
        - Create a route to add other users to the RadarList
- [12] As a [casual user/enthusiast], I want to have the delete friend option in my profile’s friend list, so that I can remove some of my friends from my list.
    - Subtasks:
        - Update the view on other profiles to handle unfollowing
        - Create a route to remove other users to the RadarList
- [23] As a [casual user/enthusiast], I want to access and view the "Setting page" so that I can be personlized the app settings.
    - Subtasks:
        - Create routes to update passwords and emails
        - Create a view to be handle updating passwords and emails

Goal 3:
- [4] As a [enthusiast], I want to play trivia sololy, so that I can test my own knowledge.
    - Subtasks:
        - Create view for single-player trivia, that updates depending on views:
            - Needs a timer that goes down and swaps questions
            - Visual feedback to know that they've selected the right or wrong answer
            - Post screen to know how much they gained/lost
        - Create routes to:
            - Provide Questions & Correct Answers
            - Stores the results of the trivia game
            - Calculates and stores the ACS gain/loss
- [5] As a [enthusiast], I want to play trivia against others, so that I can see how my knowledge compares to others.
    - Subtasks:
        - Subtasks seen in [4]
        - Any net-new views required for H2H (Head-to-Head) trivia
            - New side bar to see the opponent
        - Create routes to:
            - Handle Queuing (Match Making)

While this time we had more user stories, we felt confident because of how well last sprint went. Again, the number represents the JIRA ticket #.

### Capacity of the team:
-------------------------
- ## Given Capacity ##
- Estimated 2.5 hours every workday available from each teammate every weekday:
    - 2 Weeks worth of sprint
    - 2.5\*5\*2 = **25 Total Hours working on the project per team member** (Including time spent learning)

- ## Capacity lost due to Midterms ##
    - 5 Midterms will be written by team members, we want to make sure that they have time to study (2 days + date of midterm)
        - **Dates: 29th, 30th**
        - During these times, code flow will probably be slower
    - -2.5\*5\*3 = **37.5 Total Hours lost as time prepared for other courses**

- ## Time lost due to A2 ##
    - -2.5\*1.5\*7 = **26.25 Total Hours lost**
    - Total Hours:
        - 7 Team members
        - 25\*7 - 37.5 - 26.25 = **111 Hours Totally Available**

### Other Spikes & Issues:
--------------------------
Some concerns that we have this sprint due to a lack of knowledge are:
- How will matchmaking be done?
- Live H2H - how does this work on client side and on our servers?
- Timers for trivia
- How will posts be displayed on the zone?

We should do some research and ask clients for details.