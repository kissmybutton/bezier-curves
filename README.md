# bezier-curves

## Notes
### Final result
Just download / fork the repository and open the index.html file on your browser.

Online demo: https://kissmybutton.github.io/bezier-curves/

### Description
On load the page creates three bezier curves with random control points. The arbitary control points' values (on an 1x1 space) are from 0 to 1. This way we 
keep our lines within the visible area of the browser.

Also, the app draws elements on each curve. Each element is eqally spaced on the curve (the distance between any two consecutive points of the same curve, following the curve, including the starting and ending point of the curve) is
always the same. 

If the user changes the number of elements through the slider or resize window the app redraws keeping the exact same curves that currently exist on the canvas.
If the user alters though the number of curves then the existing curves get discarded and new random curves are been generated and get plotted on the canvas.

### Implementation details
#### Element points calculation
As our graphics technology we've used canvas.

For drawing the bezier curves we followed a process of splitting each curve into small lines (we call them sub-lines). The final curve is actually a polyline consisting of a big 
number of lines.

The number of lines that each curve consists of depends on an accuracy parameter we set on top of our index.js file. It is a number that's lower than 1 and greater than 0.
What this number represents is the step of each t passed on the bezier function. The bezier function takes as parameter the progress (from 0 to 1) of the line and 
calculates the x,y point on the given t. The smaller the step (the accuracy parameter) the more the steps, the smaller the length of the sub-lines, the greater the smoothness of the final line.

The element points calculation follows a simple logic. 
- First we calculate the full curve length by calculating the total sum of the length of all sub-lines it consists of
- Then we identify the length of each sub-curve (that starts from point 0 of the curve and ends on each of the element points we want to plot). For example for 4 elements this would be full-length/5, 2*full-length/5, 3*full-length/5, 4*full-length/5
- As a next step, starting from 0 and progressing step-by-step using the bezier function we identify the sub-lines that contain the elements (we call them container-lines)
- For each container-line we calculate the point (that belongs to it) that its distance from 0 is exactly the distance of the corresponding element
- We print the element on canvas

#### Performance
The app utilises lot of processing power. In order not to block the browser that will result to a bad experience, especially in low-specs computers, we use web workers for the 
heavy lifting. This way our browser keeps operating smoothly even when the app generates 100 random bezier curves with 100 elements per each. 

In order to make the benefits of using web workers visible to the final user we have included a load bar that indicates the
progress of plotting curves and elements on each user action. This progress bar smoothly progresses from 0 to 100% while the curves and elements are been calculated and printed on the canvas
indicating the non-blocking architecture.