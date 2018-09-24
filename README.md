# bezier-curves

## Notes
### Final result
Just download / fork the repository and open the index.html file on your browser.
Online demo: https://kissmybutton.github.io/bezier-curves/

### Description
On load the page creates three bezier curves with random control points. The arbitary control points' values (on an 1x1 space) are from 0 to 1. This way we 
keep our lines within the visible area of the browser.
Also, the app draws elements on each curve. Each element that appear on the curves represent a time point (from 0 to 1). Each element has the same time 
distance with its previous and next element on the same curve (considering the staring/0 and ending/1 point also elements). The time fraction between any two consequence 
elements depends on the number of elements the user picks to plot on each curve through the corresponding slider that exists on the top right corner of the app.
For example 3 elements will placed on time 0.25, 0.5, 0.75, 4 elements on 0.2, 0.4, 0.6, 0.8 etc.

If the user changes the number of elements through the slider or resize window the app redraws keeping the exact same curves that currently exist on the canvas.
If the user alters though the number of curves then the existing curves get discarded and new curves get on the canvas.
