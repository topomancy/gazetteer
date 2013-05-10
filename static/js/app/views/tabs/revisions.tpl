
<a href="<%= revisionURL %>" class="viewPlaceDetail bold">Revision JSON</a>
<p>Created at: <%= displayDate %> </p>
<!-- <p><%= digest %></p> -->
<% if (typeof(comment) != 'undefined') { %>
    <p><%= user %>: <%= comment %></p>
<% } %>
<p><a href="" class="viewPlaceDetail revert">Revert</a> / <a href="" class="viewPlaceDetail viewDiff">View difference</a></p>
