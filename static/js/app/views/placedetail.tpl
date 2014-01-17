
<div id="placeDetailEachBlock">

    <% if (!isSelected) { %>
    <div class="selectPlaceBtns">
        <div class="selectPlace"><strong>Select Place</strong></div>
        <div class="unselectPlace">Unselect Place</div>
    </div>
    <% } %>
    <div class="placeDetailEach">
        <span><span class="placeDetailResult h4Font"><%= properties.name %></span></span>
        <span class="editable">

            <input type="text" id="editNameInput" class="col65"/>
            <span class="confirmEdit confirmEditName fontIcons">*</span>
            <span class="cancelEdit cancelEditName fontIcons">+</span>
        </span>
         <span class="editIcon editName fontIcons">)</span>                   
    </div>  <!-- end place detail  each -->
  
    <div class="col70">
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
            <div class="placeDetailEdit editable timeframeParentBlock">
                <label>Start Date:</label> <input type="text" id="timeframe_start" value=""> <br>
                <label>Start Granularity:</label>
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
                <label>End Date:</label> <input type="text" id="timeframe_end" value=""><br>
                <label>End Granularity:</label>
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

    </div> <!-- end col70 --> 
    

    <div class="col30">
        <div class="placeDetailEach">
            <div class="bold placeDetailHeading">Source:</div>
            <div class="placeDetailResult"><a href="<%= originURL %>" target="_blank" class="underline"><%= display.origin %></a></div>
        </div> <!-- end place detail each -->

        <div class="placeDetailEach">
            <a href="<%= permalink %>" class="bold uppercase underline" id="permalinkPlace">Permalink</a> /
            <a href="<%= geojsonURL %>" class="bold underline" target="_blank">GeoJSON</a>
        </div> <!-- end place detail each -->
    </div> <!-- end col30 --> 


</div> <!-- end place detail each block -->


<div class="placeDetailViews col35">
    <div class="saveButtons" style="display:none;">
        <p class="button marginBottom inlineBlock tabButton floatRight savePlaceBtn">Commit Changes</p>
    </div>
    <div class="clear"></div>
</div>
<div class="clear"></div>

<div class="placeDetailBlock">
    <div class="placeDetailTabs">
    <ul class="tabs col90">
        <li class="button tabButton">
            <a href="" class="tabA" data-tab="alternateNames">Alternate Names</a>
            <div id="alternateNamesContainer" class="tabContainer"></div>
        </li>
        <li class="button tabButton">
            <a href="" class="tabA" data-tab="revisions">Revision History</a>
            <div id="revisionsContainer" class="tabContainer"></div>
        </li>
        <li class="button tabButton">
            <a href="" class="tabA" data-tab="adminBoundaries">Admin Boundaries</a>
            <div id="adminBoundariesContainer" class="tabContainer"></div>
        </li>
        <li class="button tabButton">
            <a href="" class="tabA" data-tab="relations">Relations</a>
            <div id="relationsContainer" class="tabContainer"></div>
        </li>
        <li class="button tabButton">
            <a href="" class="tabA" data-tab="similarPlaces">Similar</a>
            <div id="similarPlacesContainer" class="tabContainer"></div>
        </li>
        <div class="clear"></div>
    </ul>
    <div class="clear"></div>
</div>
