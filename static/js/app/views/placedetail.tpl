
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


<div class="placeDetailViews col35">
    <p class="button marginBottom inlineBlock floatRight editPlaceBtn">Edit Place</p>
    <div class="clear"></div>
    
    <p class="button inlineBlock floatRight marginBottom editShapeBtn">Edit Shape</p> <!-- remove all these classes later -->
    <div class="clear"></div>
    
    <div id="menuWrap" class="floatRight">
        <div class="menuMain">
        <div class="navList">
            <p class="button placeListLink">Last Viewed Places</p>
        </div>
        <ul id="recentlyViewedPlaces">
        </ul>
        </div>
    </div> <!-- end menuwrap  -->

    <div class="clear"></div>

            
</div>


<div class="placeDetailBlock">
    <div class="placeDetailTabs">
    <ul class="tabs">
        <li class="button tabButton"><a href="#alternateNames">Alternate Names</a></li>
        <li class="button tabButton"><a href="#revisions">Revision History</a></li>
        <li class="button tabButton"><a href="#relations">Relations</a></li>
    </ul>
    
    <div class="tab_container" id="detailTabContainer">
    </div>
</div>
<!-- <h2><%= properties.name %></h2> -->
