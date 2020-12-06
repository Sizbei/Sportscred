## Release Planning Meeting Sprint #3
### Team BBQED
### Date: 2020-11-24
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
Goal 1: The Zone - Different Queries
- We've were able to view posts in the zone but we wanted to have the option to view posts differently
- So in the zone a user will be given the ability to sort by popular, by new, or to show only from your radarlist

Goal 2: ACS Calculations
- ACS is the heart of SportCred
- Currently, we've had a temporary system in place, ignoring calculations
- We hope to talk to the client to resolve some logic issues and refactor the calculations

Goal 3: Picks and Predictions
- Picks and predictions are the last key feature that needs to be completed
- Due to the size, we will break it up into three parts
- 3.1 Picks and Predictions (Seasonal)
    - The ability to predict on the regular season games
- 3.2 Picks and Predictions (Play-off)
    - The ability to predict on a play-off bracket
- 3.3 Leaderboard (Extra)
    - While this wasn't mentioned specifically by the clients
    - We thought it'd be interesting to do a leaderboard for the picks and predictions

### Decided Stories to Complete During Sprint 4:
------------------------------------------------

Goal 1: The Zone - Different Queries
- [2] As a [moderator], I want to moderate discussions and remove posts if they pose a threat to the community so that the community feels safe and well informed on sports and topics.
    - Subtasks:
        - Set up routes to handle removing posts, clearing posts from reports, getting all reported posts
        - Make adjustments to the model to handle reported comments/posts
        - Set up view for Moderators only
        - Connect the routes and the view together
Goal 2: ACS Calculations
- [104] As a [casual user/enthusiast], I want to have my ACS be calculated from my various activities, so that I can be assigned my tier
    - Subtasks:
        - Refactor debate trigger calculation
        - Refactor user acs creation
        - Refactor trivia ACS calculations
Goal 3: Picks and Predictions
- [7] As a [enthusiast], I want to be able to view the picks and prediction leaderboard, to know how good I am at picks and predictions.
    - Subtasks:
        - Create UI for picks and predictions
        - Create model to store predictions for each game
        - Create route to do aggregation calculations on historic predictions
- [109] As a [casual user/enthusiast], I want to be able to make predictions on the regular season, so that I can demonstrate my knowledge about the game
    - Subtasks:
        - Create view for picks and predictions
        - Create pagination for historical picks
        - Add most recent picks to profile
- [110] As a [casual user/enthusiast], I want to be able to make predictions on play-offs, so that I can demonstrate my knowledge about the game.
    - Subtasks:
        - Create the bracket view
        - Create a component to store team information
        - Create a popup view
        - Create routes to send information

### Capacity of the team:
-------------------------
- ## Given Capacity ##
- Estimated 2.5 hours every workday available from each teammate every weekday:
    - 2 Weeks worth of sprint
    - 2.5\*5\*2 = **25 Total Hours working on the project per team member** 

- ## Capacity lost due to Midterms ##
    - 5 Midterms will be written by team members, we want to make sure that they have time to study (2 days + date of midterm)
        - During these times, code flow will probably be slower
        - We need to be extra vigilant since people are so busy
    - -2.5\*5\*3 = **37.5 Total Hours lost as time prepared for other courses**

- ## Including A3 In Calculations ##
    - A3 will likely take 3 days per person
    - -2.5*3*7 = **52.5 Total Hours lost as time to complete A3**

- ## Total Hours ##
    - Total Hours:
        - 7 Team members
        - 25\*7 - 52.5 - 37.5 = **85 Hours Totally Available**

### Other Spikes & Issues:
--------------------------
Some concerns that we have this sprint due to a lack of knowledge are:
- How do we implement the bracket view? It's likely not as simple as the other pages

We should do some research.