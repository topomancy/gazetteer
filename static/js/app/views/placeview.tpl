<h6><span class="smallestFont fontIcons">U</span><a href="" class="viewPlaceDetail"><strong><%= properties.name %></strong></a></h6>

<% if (display.admin) { %>
<p><span class="smallestFont fontIcons"></span> <%= display.admin %></p>

<% } %>

<% if (display.alternateNames) { %>
<p><span class="smallestFont fontIcons">J</span> <%=  display.alternateNames %></p>
<% } %>

<% if (display.timeframe) { %>
    <p><span class="smallestFont fontIcons">#</span> <%= display.timeframe %></p>
<% } %>

<!-- <p><span class="smallestFont fontIcons">_</span> City</p> -->

<p><span class="smallestFont fontIcons">1</span> Origin: <a href="<%= originURL %>" target="_blank"><%= display.origin %></a></p>

<p class="resultsActions"><a href="" class="zoomOnMap">Zoom on map</a> / <a href="" class="viewPlaceDetail">View details</a> / <a href="">Edit</a></p>

