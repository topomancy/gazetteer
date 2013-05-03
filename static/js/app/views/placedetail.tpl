
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
        <div class="placeDetailEdit">
            Start Date: <input type="text" id="timeframe_start" value=""> <br>
            Start Granularity:
                <select id="timeframe_start_range">
                    
                    <option value="0">
                        None
                    </option>
                    
                    <option value="1">
                        One Day
                    </option>
                    
                    <option value="7">
                        One Week
                    </option>
                    
                    <option value="30">
                        One Month
                    </option>
                    
                    <option value="365">
                        One Year
                    </option>
                    
                    <option value="3650">
                        One Decade
                    </option>
                    
                </select>
                <br>
            <br>
            End Date: <input type="text" id="timeframe_end" value=""><br>
            End Granularity:
                <select id="timeframe_end_range">
                    
                    <option value="0">
                        None
                    </option>
                    
                    <option value="1">
                        One Day
                    </option>
                    
                    <option value="7">
                        One Week
                    </option>
                    
                    <option value="30">
                        One Month
                    </option>
                    
                    <option value="365">
                        One Year
                    </option>
                    
                    <option value="3650">
                        One Decade
                    </option>
                    
                </select>
                <br>
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
    <div class="saveButtons" style="display:none;">
        <p class="button marginBottom inlineBlock floatRight savePlaceBtn">Save</p>
        <p class="button marginBottom inlineBlock floatRight cancelSaveBtn">Cancel</p>
    </div>

    <div class="editButtons">    
        <p class="button marginBottom inlineBlock floatRight editPlaceBtn">Edit Place</p>
        <div class="clear"></div>
        
        <p class="button inlineBlock floatRight marginBottom editShapeBtn">Edit Shape</p> <!-- remove all these classes later -->
        <div class="clear"></div>

    </div> 
    <div id="menuWrap" class="floatRight">
        <div class="menuMain">
        <div class="navList">
            <p class="button placeListLink">Last Viewed Places</p>
        </div>
        <div class="recentPlaces">
            <!--
            <ul id="recentlyViewedPlaces">
            </ul>
            -->
        </div>
        </div>
    </div> <!-- end menuwrap  -->

    <div class="clear"></div>

            
</div>
<div class="clear"></div>

<div class="placeDetailBlock">
    <div class="placeDetailTabs">
    <ul class="tabs">
        <li class="button tabButton col50"><a href="#alternateNames" data-tab="alternateNames">Alternate Names</a></li>
        <li class="button tabButton col50"><a href="#adminBoundaries" data-tab="adminBoundaries">Admin Boundaries</a></li>
        <div class="clear"></div>
        <li class="button tabButton col50"><a href="#revisions" data-tab="revisions">Revision History</a></li>
        <li class="button tabButton col50"><a href="#relations" data-tab="relations">Relations</a></li>
        <div class="clear"></div>
    </ul>
    
    <div class="tab_container" id="detailTabContainer">
    </div>
</div>
<!-- <h2><%= properties.name %></h2> -->
