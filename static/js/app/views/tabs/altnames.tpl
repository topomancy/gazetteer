<div class="altnameDetails">
    <p class="smallFont">
        <strong>
            <span class="altnameDetail alternateNameName"><%= name %></span>
        </strong>
        <span class="altnameEditable">
            <input class="alternateNameNameInput" value="<%= name %>" placeholder="Alternate Name" />
        </span>
    </p>
    <p class="smallFont">
        <span>Language: </span>
        <span class="altnameDetail alternateNameLang"><%= lang %></span>
        <span class="altnameEditable">
            <input class="alternateNameLangInput" value="<%= lang %>" placeholder="Language" />    
        </span>
    </p>
    <p class="smallFont">
        <span>Type: </span>
        <span class="altnameDetail alternateNameType"><%= type %></span>
        <span class="altnameEditable">
            <input class="alternateNameTypeInput" value="<%= type %>" placeholder="Type" />
        </span>
    </p>
    <div class="editButtons">
        <p class="editAlternateName buttonAdd inlineBlock">Edit</p>
        <p class="deleteAlternateName buttonAdd inlineBlock"><span class="smallFont">x </span> Delete</p>
    </div>
    <div class="saveButtons" style="display:none;">
        <p class="saveAlternateName buttonAdd inlineBlock">Save</p>
        <p class="cancel buttonAdd inlineBlock">Cancel</p> 
    </div>
</div>
