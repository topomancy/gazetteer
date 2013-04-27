            <div class="pagViews smallFont">
            <div class="pagBlock">
                                
                <div class="floatRight">
                <span class="sortTitle">Sort</span>
<!--                     <select name="" class="selectSort">
 -->
                    <select name="" class="selectSort">
                        <option value="">A-Z</option>
                        <option value="">Z-A</option>
                        <option value="">Latest</option>
                        <option value="">Oldest</option>
                    </select>
                </div> <!-- end float right  -->
                <div class="clear"></div>
                
                <br>
                
                <div id="legend" class="smallFont floatRight">
                    <p><span class="fontIcons">U</span>  <input type="checkbox" checked disabled> Feature name</p>
                    <p><span class="fontIcons">J</span>  <input type="checkbox" checked> Alternate names</p>
                    <p><span class="fontIcons">#</span>  <input type="checkbox" checked> Timeframe</p>
                    <p><span class="fontIcons">_</span>  <input type="checkbox" checked> Feature type</p>
                    <p><span class="fontIcons">1</span>  <input type="checkbox" checked> Origin</p>
                </div> <!-- end legend  --> <!-- Sanj, can't this be checkboxes and filters as well  -->
    
                <div class="clear"></div>
                <br>
                
                <div class="pagination smallFont floatRight">
                    <span class="fontIcons pagNav">n</span>
                    <span>1...</span>
                    <span>50</span>
                    <span class="paginationSelected">51</span>
                    <span>52</span>
                    <span>...85</span>
                    <span class="fontIcons pagNav">p</span>
                    <p class="center smallFont resultsNosPages"><strong><%= totalPages %> pages / <%= totalResults %> results</strong></p>
                </div>   
            
                <div class="clear"></div>
                <br>
                <div id="menuWrap" class="floatRight marginBottom">
                    <div class="menuMain">
                        <div class="navList">
                            <p class="button placeListLink">Last Viewed Places</p>
                        </div>
                        <ul>
                            <li>New Yorker</li>
                            <li>New York Palace</li>
                            <li>New York Hotel</li>
                        </ul>
                    </div>
                </div> <!-- end menuwrap  -->

                <div class="clear"></div>
                                                
            </div> <!-- end pagBlock  -->
        </div>

