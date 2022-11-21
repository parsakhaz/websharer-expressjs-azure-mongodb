# Web Sharer

## Motivations
Utilize expressjs and javascript to fetch and display data on page, experiment with backend, auth, sessions, xcss vulnerabilities, user data and actions, and more as I keep adding to this

## Functionality
Web Sharing app that has Azure Authentication and hosting. Allow users to log in share a website link (with live preview!), add a description, then post. Allow users to like and comment on other posts. Allow user to delete posts.

## Development Branches

Experiment using GitHub branches

### A2

I added the functionality to check a website link for bootstrap, by checking if it is included in a script. If it is not included, nothing is displayed.

You can check it functioning with the following links:
https://getbootstrap.com/docs/4.0/examples/
http://kylethayer.com/

---

### A3

Additional piece of information that I added is the ability to add associated company name.

URL to Heroku deployment:
https://websharer-parsa.herokuapp.com/

---

### A4

URL to Azure deployment:
https://test.parsak.me/

---

### A5

redeploy with:
az webapp up --name websharer-app --logs --launch-browser 

tested with: 
https://test.parsak.me/api/v3/users/myIdentity
https://test.parsak.me/api/v3/posts?username=parsak@uw.edu
https://test.parsak.me/api/v3/posts?username=kylethayer@uw.edu

URL to Azure deployment:
https://test.parsak.me/

---

### A6

URL to Azure deployment:
https://test.parsak.me/