Course: CSE 564 - Visualization
Name: Venkateswara Prasad Pandeti
Id: 110396994

1. Files that I am submitting
bar_chart2.png
bar.js
baseball_data.csv
d3_1.html
d3.min.js
force_chart2.png
pie_chart1.png
README.txt

2. The data source is  baseball_data.csv
I have taken three variables Heights, Weights and Heart Rates of multiple base ball players
bar.js - The javascript file that contains logic for visualization using d3.js
d3.min.js - minified version of d3.js
d3_1.html - HTML file
Remaining are icons for Bar, Pie and Force charts

3. Implementation:
For Height, no of bins is 32.
For Weight, no of bins is 70.
For Heart rate, no of bins is 35.
Created bar chart using the specified bins for each variable.
I took a variable. If its value is 0, it reads only the height data, 1 for weight data and 2 for Heart rate. I increase this variable, on mouse click. While reading I am using this variable to pick the corresponding data.
On mouse over, I added a callback, in which, I am increasing the width, height, x and y properties of that particular bar, appending a div to svg and setting bar's value as a tooltip.
On mouse out, I am restoring the previous values and removing the tooltip div from svg.
I used three buttons. one for bar, one for pie and one for force. Using these buttons, You can switch through the layouts.

For the extra credit: mouse moves left(right) should decrease(increase) bin width/size
I added a button "ExtraCredit-Bins". It's a toggle button. You can turn it off. When it is on and mouse moves from one end to another end (left to right/right to left) bin width increase and decreases

Data shown: Heights, Weights and Heart Rates

4. Testing
http://allv28.all.cs.stonybrook.edu/vpandeti/d3_1.html
Implemented the below features. Please test them.
 bin variables into a fixed range of your choice
	Please observe the bin sizes on the x-axis
 create a bar chart of each such variable
	Please observe the bar charts for each variable(Height, Weight and Heart rate) on mouse click
 respond to mouse clicks to cycle through the different variables
	Please observe the bar charts for each variable(Height, Weight and Heart rate) on mouse click
 only on mouse over display the value of the bar on top of the bar
	Please observe the tooltip on mouse over on a bar
 on mouse over make the bar wider and higher to focus on it
	Please observer the increase in width and height of bar on mouse over on that bar
 on mouse click transform the bar chart into a pie chart (and back)
	Please observe that the bar chart is transformed into pie chart on click of pie chart button and the reverse happens too
	You can observe the ranges on the right side for your information
 on mouse click create a force-directed layout using a chosen distance
	Please observe that the bar chart is transformed into force chart on click of pie chart button and the reverse happens too
	You can observe the ranges on the right side for your information
 I attempted for extra grade: elegant implementation/function
	Please observe the user interface and easy understanding of the data distribution.
 For the extra credit: mouse moves left(right) should decrease(increase) bin width/size
	Please observe the increase/decrease in the widths of bins.
	I added it as a separate functionality as it is extra credit, though it works as expected.