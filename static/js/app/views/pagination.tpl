<div class="pagination">
    <% if (hasPrev()) { %>
        <span class="fontIcons pagNav prevPage">n</span>
    <% } %>

    <% for (var i=0; i<pagesToShow().length; i++) { var page = pagesToShow()[i];  %>
        <span class="pageNumber"><%= page %></span>
    <% } %>
    <% if (hasNext()) { %>
        <span class="fontIcons pagNav nextPage">p</span>
    <% } %>
    <p class="smallFont resultsNosPages"><%= totalPages %> pages / <%= totalResults %> results</p>
</div>   

<div class="clear"></div>
<br>

                                                


