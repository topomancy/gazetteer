    <td class="tdRelation">
        <span class="relationText">
            No relation
        </span>
        <span class="editable">
            <select class="relationSelect">
                <option value="">does not relate to</option>
                <% for (r in relationChoices) { if (relationChoices.hasOwnProperty(r)) { var val = r; var rel = relationChoices[r]; %>
                    <option value="<%= val %>"><%= rel %></option>
                <% } } %>
            </select>
        </span>
    
    </td>
    <td class="tdName">
        <%= properties.name %>
        <% if (display.admin) { %>
            <div class="adminDisplay"><%= display.admin %></div>
        <% } %>
    </td>
    <td class="tdTimeframe">
        <%= display.timeframe %>
    </td>
    <td class="tdType">
        <%= display.feature_type %>
    </td>
    <td class="tdOrigin">
        <%= display.origin %>
    </td>
    <td>
        <%= properties.distance %>
    </td>

