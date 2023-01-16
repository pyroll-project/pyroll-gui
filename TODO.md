## High-priority bugs:

## New Features
* Implementing the reporter that is supposed to show the contour lines
  * For groove options
  * For input profile
  * Do this on every signal send when the textfields get changed
  * If this is too slow, attempt it to do it maybe every second if a change has been made
* Properly add all required parameters
* Maybe add feature to enlarge the size of the groove pictures
* Add writing to contour lines

## Lower priority:
* Find out how the groove should really be printed
* Pretty up the groove option parameters
* Fix CI/CD to generate changelog
* Test CI/CD locally using act
* Use the Github actions strategy/matrix setting to create Linux release (but maybe find out what exactly is needed before)
* Maybe add a padding around the PyQT forms
* Question: Do we actually need to save the current row or is it enough to always simply call the function
* Check if unnecessary data gets added to .exe file
* Drawing the window does not resize the GUI.


## General things
* Testing