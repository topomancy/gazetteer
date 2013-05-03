
                                
                <div class="floatRight">
                    <span class="sortTitle">Sort</span>
                    <select name="" class="selectSort">
                        <option value="">A-Z</option>
                        <option value="">Z-A</option>
                        <option value="">Latest</option>
                        <option value="">Oldest</option>
                    </select>
                </div> <!-- end float right  -->
                <div class="clear"></div>
                <br>
                
                <div class="pagination smallFont floatRight">
                    <% if (hasPrev()) { %>
                        <span class="fontIcons pagNav prevPage">n</span>
                    <% } %>

                    <% for (var i=0; i<pagesToShow().length; i++) { var page = pagesToShow()[i];  %>
                        <span class="pageNumber"><%= page %></span>
                    <% } %>
<!--                    <span>1...</span>
                    <span>50</span>
                    <span class="paginationSelected">51</span>
                    <span>52</span>
                    <span>...85</span> -->
                    <% if (hasNext()) { %>
                        <span class="fontIcons pagNav nextPage">p</span>
                    <% } %>
                    <p class="center smallFont resultsNosPages"><strong><%= totalPages %> pages / <%= totalResults %> results</strong></p>
                </div>   
            
                <div class="clear"></div>
                <br>

                                                


