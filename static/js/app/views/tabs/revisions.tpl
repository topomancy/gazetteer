
<a href="<%= revisionURL %>" target="_blank" class="bold">Revision JSON</a>
<p>Created at: <%= displayDate %> </p>
<% if (typeof(comment) != 'undefined') { %>
    <p><%= user %>: <%= comment %></p>
<% } %>
<p>
    <span class="revertDisplay">
        <a href="" class="viewPlaceDetail buttonAdd revert">
            Revert <span class="buttonAddIcon"><strong>&#8635;</strong></span>
        </a>
    </span>
</p>
