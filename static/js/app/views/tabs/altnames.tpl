<div class="altnameDetails">
    <h6>
        <span class="smallestFont fontIcons">U</span>
        <strong>
            <span class="altnameDetail alternateNameName"><%= name %></span>
        </strong>
        <span class="altnameEditable">
            <input class="alternateNameNameInput" value="<%= name %>" placeholder="Alternate Name" />
        </span>
    </h6>
    <p>
        <span class="smallestFont fontIcons">J</span>
        <span class="altnameDetail alternateNameLang"><%= lang %></span>
        <span class="altnameEditable">
            <input class="alternateNameLangInput" value="<%= lang %>" placeholder="Language" />    
        </span>
    </p>
    <!-- <p><span class="smallestFont fontIcons">#</span> 1852-1961</p> -->
    <p>
        <span class="smallestFont fontIcons">_</span>
        <span class="altnameDetail alternateNameType"><%= type %></span>
        <span class="altnameEditable">
            <input class="alternateNameTypeInput" value="<%= type %>" placeholder="Type" />
        </span>
    </p>
    <div class="editButtons">
        <p class="editAlternateName">Edit</p>
        <p class="deleteAlternateName">Delete</p>
    </div>
    <div class="saveButtons" style="display:none;">
        <p class="saveAlternateName">Save</p>
        <p class="cancel">Cancel</p> 
    </div>
</div>
