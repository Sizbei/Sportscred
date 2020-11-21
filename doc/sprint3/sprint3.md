## Release Planning Meeting Sprint #3
### Team BBQED
### Date: 2020-11-17
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
Goal 1: The Zone Moderation
- Now that "The Zone" was operational and we could add posts
- We want to be able to delete posts as well
- So given someone being able to report posts, a moderator should be able to review them and delete them as needed

Goal 2: Debate & Analysis
- We also wanted to work on a net-new feature
- Debate & Analysis seemed more doable with our limited resources because the ui is similar to the zone
- So users should be able to view debates/analysis and participate/vote on other debates
- It should also calculate ACS score down the line

We decided to reduce the amount of goals that we wanted to complete due to reduced availability

### Decided Stories to Complete During Sprint 3:
------------------------------------------------

Goal 1: The Zone Moderation
- [2] As a [moderator], I want to moderate discussions and remove posts if they pose a threat to the community so that the community feels safe and well informed on sports and topics.
    - Subtasks:
        - Set up routes to handle removing posts, clearing posts from reports, getting all reported posts
        - Make adjustments to the model to handle reported comments/posts
        - Set up view for Moderators only
        - Connect the routes and the view together
- [3] As a [enthusiast], I want to be able to report posts so that [moderators] can remove the post and keep the community safe.
    - Subtasks:
        - Set up route to send reports, adjust routes for GET requests
        - Set up button to handle the report, only appears when the user hasn't reported
Goal 2:
- [19] As a [enthusiast], I be able to post my opinion on my tier's debate so that I can be judged by my peers and increase my rating
    - Subtasks:
        - Add routes and models for debates and analysis
        - Create basic layout for adding debate opinions
        - Create layout for comments option
        - Add infinite scroll for debate options
- [20] As a [casual user/enthusiast], I want to view outstanding debates, so that I could listen to other people’s ideas.
    - Subtasks:
        - Create basic layout for debates and analysis landing page + Pagination for historical debates
        - Add routes to get data and view debates
        - Add ACS gatekeeping to keep people in their ACS level
        - Add histogram to view how people are voting
        - Connect routes to components
- [21] As a [casual user/enthusiast], I want to score arguments in a debate, so that I could participate in the debate as one of the judges.
    - Subtasks:
        - Create the scoring wheel
        - Set up routes to handle scoring
        - Calculate ACS score at the end of the day with a trigger

While this time we had fewer stories, we were also confident since Debates & Analysis were similar to The Zone.

### Capacity of the team:
-------------------------
- ## Given Capacity ##
- Estimated 2.5 hours every workday available from each teammate every weekday:
    - 2 Weeks worth of sprint
    - 2.5\*5\*2 = **25 Total Hours working on the project per team member** (Including time spent learning)

- ## Capacity lost due to Midterms ##
    - 14 Midterms will be written by team members, we want to make sure that they have time to study (2 days + date of midterm)
        - During these times, code flow will probably be slower
        - We need to be extra vigilant since people are so busy
    - -2.5\*14\*3 = **105 Total Hours lost as time prepared for other courses**

- ## Not Including A2/A3 In Calculations ##
    - Total Hours:
        - 7 Team members
        - 25\*7 - 105 = **70 Hours Totally Available**

### Other Spikes & Issues:
--------------------------
Some concerns that we have this sprint due to a lack of knowledge are:
- How do we add in an automatic closer/opener of debate questions?
- How do we calculate ACS once the debate is over?
- The clients specifically asked for a slider to agree/disagree with a debate topic - How do we implement this?

We should do some research and ask clients for details.