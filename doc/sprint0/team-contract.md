Team BBQED Contract
====================

### **Communication & Meetings**

- Discord will be used for quick questions, messaging, and as the location for meetings.
    - It is expected that if a question is directed to a team member on Discord, the member should reply within 24 hours.
    - It is also expected that the person asking the question will patiently wait, check fellow team member's available times and **NOT** harass fellow team members with excess messages.
    - Discord will be the first contact option, though a phone call may happen in the event that someone ignores the team's messages or an emergency requiring someone's immediately attention.
- Standup meetings (5min - 15min) will happen every weekday on the following times:
    - In the event that someone is absent, the standup will continue.
    - See *Contengecy* section for dealing with consistently tardy/absent team members.

        | Monday  | Tuesday | Wednesday | Thursday | Friday |
        |---------|---------|-----------|----------|--------|
        | 10:15PM | 10:15PM |  10:15PM  | 10:15PM  | 1:30PM |
        *Note that these roles were decided from a meeting called on 2020-09-17*

- Non-standup meetings (30min - 1hr) can be called by anyone in the group and must be scheduled at least 3 days in advance.
    - Notes will be taken by team member *Deon Li*, or a volunteer if he is absent. The notes should be posted to the Google Drive for anyone who missed the meeting.
    - Notes should include what was discussed, who was present, and key decisions moving forward.
    - It is expected that the person who calls for a meeting prepare a list of things they would like to discuss.
        - Others are free to bring their own topics for discussion

### **Contengency**

- In the event a team member drops the course, an emergency meeting will be called to determine how to redistrubute the work
- In the event a team member plagiarizes and the code has not been submitted for the sprint, the team member is expected to redo the portion before submission. If the code has been submitted, the instructor will be informed immediately and will be asked on how to proceed
- In the event a team member is consistently, significantly late (10 minutes) or absent (2+ times) from meetings without good reason, an emergency meeting will be called to determine the reason why and adjust meeting schedules and planning accordingly. If the team member ignores warnings and continues their behaviour, the instructor will be notified

### **Roles and Work Division**

- The *current* role assignments are the following:
    | Role                                     | Members                       |
    | ---------------------------------------- | ----------------------------- |
    | Backend [ Database (Mongo), Node.Js ]    | Deon Li, Alex Wan, Frank Chen |
    | Frontend [ React.js, HTML, etc. ]        | Cherrie Fong, Alex Yang       |
    | Fullstack [ Everything ]                 | Andy Phylim, Raymond Chen     |
    |                                          |                               |
    
    *Note that these roles were decided from a meeting called on 2020-09-17*
    - Roles are **NOT** strictly fixed. These are more guidelines than hard rules, people will be shifted around as the requirements of the project changes.
        - Though, if people need to be moved around, members of the *Fullstack* position will be moved first.
    - Before submission, a volunteer will go through the submission and check, in the event no one volunteers, a 7-sided dice will be rolled (RNG)
        - The person who is rolled will be the one to check the submission:
            - 1 - Deon
            - 2 - Frank
            - 3 - Andy
            - 4 - Alex Wan
            - 5 - Alex Yang
            - 6 - Raymond
            - 7 - Cherrie

- It is expected that for the each sprint presentation, there is at least 1 rehersal that everyone attends.

### **Version Control**

- A Commit Summary should contain the following things
    - [JIRA Ticket Number] - Verb (Created, Updated, Bugfix) - Files Worked on
    - In the option for more details, explain what was introduced and what the code does for the feature
        - E.g: Introduced a method that gets user data from db for XYZ feature
        - E.g: Fixed a bug where images were not being correctly shown
- We will commit whenever we write a substantial amount of code towards a subtask
    - We will commit only when we think that the code works to a certain extent; code that we have at the very least manually tested
- We will split our repository into branches:
    - Master branch acting as a "release" branch
    - Working branches for each feature
    - Hotfixes for immediate problems found in master
- We will try our best to avoid having multiple people working on the same file in order to avoid having lots of merge conflicts
- In the event that a merge conflict does happen, then the person who is doing the merge will find which file is having the conflict
    - They will reach out to team members who have worked on that file through a message on discord to figure out how to resolve the conflict
- Anyone can do pull requests, though we should

### **Team Signatures**

We accept these guidelines and intend to fulfill them:

Deon Li - lideon - 1003349263
