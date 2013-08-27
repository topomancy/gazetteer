<td>
    <%= relationChoices[properties.relation_type] %>
</td>
<td>
    <a href="<%= permalink %>" class="viewPlaceDetail">
        <%= properties.name %>
        <% if (display.admin) { %>
            <div class="adminDisplay"><%= display.admin %></div>
        <% } %>
    </a>
</td>
<td>
    <%= display.timeframe %>    
</td>
<td>
    <%= properties.feature_code %>
</td>
<td>
    <span class="buttonAdd removeRelation">Remove <span class="fontIcons">3</span> </span>    
</td>

<!--
 <a href="<%= permalink %>" class="smallerFont viewPlaceDetail"><%= properties.name %></a>
<br />
<span class="propertyforRelation"><%= properties.relation_type %></span>
    <span class="buttonAdd removeRelation">Remove <span class="fontIcons">3</span> </span>
-->
