# Test Cases

### Welcome Guide

Upon first starting the app, there should be a welcome guide that introduces the user to the application

Scroll through the 7 steps and ensure that it exits to the main menu

### Minimize/Maximize

At the top right, select the downward directing arrow

Confirm the UI changes to exclude the settings cog, preferences, session count and analytics.

Select the now upward facing arrow

Confirm the UI changes to include the settings cog, preferences, session count and analytics.

### Settings

At the top right, select the cog icon

A drop down menu should appear with the options: Enable notifications, Enable launch at login, autohide window on start, auto show window on finish and enable drag window

##### Enable drag window (currently failing)

Ensure you cannot drag the window around

Select the option "Enable drag window" from the settinds drop down

Ensure that the window is now movable

### Pomodoro Preferences

At the bottom right, select the stopwatch icon

Confirm that a menu pops up.

Change the Work time option to 1 min (for next test)
Change the Break time option to 1 min (for next test)

Ensure that the Repeat option is set to 0 and that the user can increase the number of cycles by 2.

Ensure that the user cannot decrease the number of cycles below 0

Ensure that the "Add a delay" option is set to 0 and that the user can increase the number of cycles by 2.

Ensure that the user cannot decrease the number of "Add a delay" below 0

### Start

At the bottom, select the icon that looks like a play button

Confirm the Pomodoro clock begins

After one minute, ensure that a bell dings and the break timer starts

After one minute, the break should end and the UI should return to normal

### Analytics

At the bottom left, select the icon that looks like a bar graph

Confirm a new menu pops up

Find the box that is titled Total and ensure the number beside the flame icon is the same as the one at the very top left of the application

Ensure there are three options to choose from: Week, Months and Goals

When Week is selected, there should be a bar graph that displays the number of minutes worked. It should be greater than 1 after running the "Start" test

When Months is selected, there should be a checkered graph that displays the days that the pomodoro clock was started. It should be highlighted on the current day.

When Goals is selected, the user should be given the option to add a Goals

##### Add a Goal

Select the plus icon on the left

The user should be able to decrease the amount of work to .1, but no lower

The user should be able to select the unit of time: day, week, month or year

Select the blue button on the far right

A new goal should appear

Exit the menu

### Session Count

At the top left, ensure there is a flame icon with a number beside it

Start the pomodoro clock once again

Ensure the number increases by 1

### Work-Till Functionality

Directly above the start button, ensure there is an option to work until a certain time

Push that button and ensure a pomodoro session starts

Stop the session by selecting the start button again, which should now be a stop button
