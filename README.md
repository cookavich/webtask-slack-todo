# Webtask Slack Todo

This is a small experiment to build a todo application with [Webtask](https://webtask.io/), [Slack](https://slack.com/), and [Firebase](https://firebase.google.com/).

## Set Up

First things first is you need to actually set up Webtask to work on Slack. This link right [here will](https://webtask.io/slack) get you started on doing that. My command was called, creatively `todo`, but it really doesn't matter what you name it. After that you can copy the code in `index.js`, and then get going!

After that you need to set up a database at [Firebase](https://firebase.google.com/). Once you have a project there will be an option to "Add Firebase to your app." Click on that because we'll need to get the config information from there so we can easily wire our Webtask to our Firebase DB.

In the online Webtask editor there is a submenu shaped like a wrench that has a "Secrets" selection. You'll add in all of your Firebase config there, and you can see at the top of the file how that is arranged.

The only other thing you need to be sure is have the NPM module Firebase installed, and there's an option to add that from the same wrench menu where you set your app secrets.

## TODO

- [ ] More feedback to users if they enter in a wrong command
- [ ] Ability to return filtered todos based on complete/incomplete
