# Todo Dopamine Chart:
Crashes should also happen in + if change was - negative
Fix grabbing being righ shifted issue(about different screen sizes registering weirdly on svg)
Deploy on Vercel this React App.
Create responsive screen sizes starting with mobile.
Fix dropping on wrong spot issue on all sizes. 
Might be related to this const timeScale = d3.scaleTime()
          .domain([new Date().setHours(7, 0, 0, 0), new Date().setHours(24, 0, 0, 0)])
          .range([margin.left, svgWidth - margin.right]);
        //x_cord has to be between margin.left and svgWidth - margin.right
        const x_cord = Math.min(Math.max(coords[0], margin.left), svgWidth - margin.right);
        const dropTime = timeScale.invert(x_cord);
        console.log('dropTime:', dropTime); Since on smaller screens where canvas dont fit, domain isnt the whole
	'.domain([new Date().setHours(7, 0, 0, 0), new Date().setHours(24, 0, 0, 0)])' its however much is on the screen.
Have also crash duration for activites or implement something that can give similar effect perhaps a premade structure like e complex version of cubic bezir
