## High-priority bugs:
* Fix the deletion causing 'list index out of range' errors
* Get the solve function to work properly
* Adding a row seems to delete all data
* The first-time-setup is buggy, there should not be 2 rows

## New Features
* Question: Do we actually need to save the current row or is it enough to always simply call the function
* Implementing the reporter that is supposed to show the contour lines
* Should the input profile be plotted as well?

## Lower priority:
* Find out how the groove should really be printed
* Pretty up the groove option parameters
* Fix CI/CD to generate changelog
* Test CI/CD locally using act
* Use the Github actions strategy/matrix setting to create Linux release (but maybe find out what exactly is needed before)
* Maybe add a padding around the PyQT forms
* Refactor \_\_init\_\_ to use newProject()

## General things
* Testing