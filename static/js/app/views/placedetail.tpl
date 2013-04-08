
<div id="placeDetailEachBlock" class="col65">
    <div class="placeDetailEach">
        <h3><%= properties.name %></h3>                    
    </div>
  
    <div class="placeDetailEach">
        <div class="bold placeDetailHeading">Type:</div>
        <div class="placeDetailResult"><%= properties.feature_code_name %></div>
    </div> <!-- end place detail  each -->


    <div class="placeDetailEach">
        <div class="bold placeDetailHeading">Timeframe:</div>
        <div class="placeDetailResult">
            <% if (display.timeframe) { %>
                <%= display.timeframe %>
            <% } else { %>
                None
            <% } %>
        </div>
    </div> <!-- end place detail each -->

    <div class="placeDetailEach">
        <div class="bold placeDetailHeading">Updated:</div>
        <div class="placeDetailResult"><%= display.updated %></div>
    </div> <!-- end place detail each -->
    
    <div class="placeDetailEach">
        <div class="bold placeDetailHeading">Source:</div>
        <div class="placeDetailResult"><a href="<%= originURL %>" target="_blank"><%= display.origin %></a></div>
    </div> <!-- end place detail each -->

    <div class="placeDetailEach">
        <a href="<%= permalink %>" class="bold" id="permalinkPlace">Permalink</a> /
        <a href="<%= geojsonURL %>" class="bold" target="_blank">GeoJSON</a>
        
        <div id="permaLinks">
            <form action="" id="permalinkForm">
                <input type="text" name="" value="<%= permalink %>">
            </form>
        </div>
        
    </div> <!-- end place detail each -->
</div> <!-- end place detail each block -->


<!-- <h2><%= properties.name %></h2> -->
