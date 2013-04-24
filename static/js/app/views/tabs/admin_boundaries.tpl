<h6>
    <% if (url) { %>
    <a href="<%= url %>">
    <% } %>
        <%= name %>
    <% if (url) { %>
    </a>
    <% } %>
</h6>
<p><%= alternate_names %></p>
<p><%= feature_code %></p>
