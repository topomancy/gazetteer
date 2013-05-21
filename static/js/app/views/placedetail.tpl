
<div id="placeDetailEachBlock" class="col65">

    <% if (!isSelected) { %>
    <div class="selectPlaceBtns">
        <div class="selectPlace">Select Place</div>
    </div>
    <% } %>
    <div class="placeDetailEach">
        <h3 class="placeDetailResult"><%= properties.name %></h3>
        <span class="editable">
            <input type="text" id="editNameInput" />
            <span class="confirmEdit confirmEditName fontIcons">*</span>
            <span class="cancelEdit cancelEditName fontIcons">+</span>
        </span>
         <span class="editIcon editName fontIcons">)</span>                   
    </div>
  
    <div class="placeDetailEach">
        <div class="bold placeDetailHeading">Type:</div>
        <div class="placeDetailResult"><%= properties.feature_code_name %></div>
        <div class="editable">
            <input type="text" id="editFeatureTypeInput" value="<%= properties.feature_code %>" />
            <span class="confirmEdit confirmEditFeatureType fontIcons">*</span>
            <span class="cancelEdit cancelEditFeatureType fontIcons">+</span>
        </div>
        <span class="editIcon editFeatureType fontIcons">)</span>
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
        <div class="placeDetailEdit editable">
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
                <span class="confirmEdit confirmEditTimeframe fontIcons">*</span>
                <span class="cancelEdit cancelEditTimeframe fontIcons">+</span>
        </div>
        <span class="editIcon editTimeframe fontIcons">)</span>
    </div> <!-- end place detail each -->

    <div class="placeDetailEach">
        <div class="bold placeDetailHeading">Updated:</div>
        <div class="placeDetailResult lastUpdated"></div>
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
        <p class="button marginBottom inlineBlock tabButton floatRight savePlaceBtn">Commit Changes</p>
        <!-- <p class="button marginBottom inlineBlock floatRight cancelSaveBtn">Cancel</p> -->
    </div>

    <!--
    <div class="editButtons">    
        <p class="button marginBottom inlineBlock floatRight editPlaceBtn">Edit Place</p>
        <div class="clear"></div>
        
        <p class="button inlineBlock floatRight marginBottom editShapeBtn">Edit Shape</p>
        <div class="clear"></div>

    </div>
    -->
    <!-- 
    <div id="menuWrap" class="floatRight">
        <div class="menuMain">
        <div class="navList">
            <p class="button placeListLink">Last Viewed Places</p>
        </div>
        <div class="recentPlaces">
            <ul id="recentlyViewedPlaces">
            </ul>
        </div>
        </div>
    </div> --> <!-- end menuwrap  -->

    <div class="clear"></div>

            
</div>
<div class="clear"></div>

<div class="placeDetailBlock">
    <div class="placeDetailTabs">
    <ul class="tabs col35">
        <li class="button tabButton"><a href="#alternateNames" data-tab="alternateNames">Alternate Names</a></li>
        <li class="button tabButton"><a href="#adminBoundaries" data-tab="adminBoundaries">Admin Boundaries</a></li>
        <li class="button tabButton"><a href="#revisions" data-tab="revisions">Revision History</a></li>
        <li class="button tabButton"><a href="#relations" data-tab="relations">Relations</a></li>
        <div class="clear"></div>
    </ul>
    
    <div class="tab_container col65" id="detailTabContainer">
    </div>
    <div class="clear"></div>
</div>
<!-- <h2><%= properties.name %></h2> -->
