L.Control.ViewMeta = L.Control.extend({
        options: {
                position: `topright`,
                placeholderHTML: `-----`
        },

        onRemove: function() {
                L.DomUtil.remove(this.container);
        },

        onAdd: function(map) {
                this.map = map;

                this.container = L.DomUtil.create(`div`, `leaflet-view-meta`);

                L.DomEvent.disableClickPropagation(this.container);
                L.DomEvent.on(this.container, `control_container`, function(e) {
                        L.DomEvent.stopPropagation(e);
                });
                L.DomEvent.disableScrollPropagation(this.container);

                table = L.DomUtil.create(
                        `table`,
                        `leaflet-view-meta-table`,
                        this.container
                );

                // map center
                this.addDividerRow(table, `Center`);
                this.lat_e = this.addDataRow(table, `Latitude`);
                this.lng_e = this.addDataRow(table, `Longitude`);

                this.addDividerRow(table, `Bounds`);
                this.nb_e = this.addDataRow(table, `Northern Bound`);
                this.sb_e = this.addDataRow(table, `Southern Bound`);
                this.eb_e = this.addDataRow(table, `Eastern Bound`);
                this.wb_e = this.addDataRow(table, `Western Bound`);

                this.map.on(`resize`, () => this.update());
                this.map.on(`zoomend`, () => this.update());
                this.map.on(`dragend`, () => this.update());
                
                return this.container;
        },

        addDividerRow: function(tableElement, labelString) {
                tr = tableElement.insertRow();
                tdDivider = tr.insertCell();
                tdDivider.colSpan = 2;
                tdDivider.innerText = labelString;
        },
        addDataRow: function(tableElement, labelString) {
                tr = tableElement.insertRow();
                tdLabel = tr.insertCell();
                tdLabel.innerText = labelString;
                tdData = tr.insertCell();
                tdData.innerHTML = this.options.placeholderHTML;
                return tdData;
        },

        update: function() {
                center = this.map.getCenter();
                this.lat_e.innerText = this.formatNumber(center.lat);
                this.lng_e.innerText = this.formatNumber(center.lng);

                bounds = this.map.getBounds();
                this.nb_e.innerText = this.formatNumber(bounds.getNorth());
                this.sb_e.innerText = this.formatNumber(bounds.getSouth());
                this.eb_e.innerText = this.formatNumber(bounds.getEast());
                this.wb_e.innerText = this.formatNumber(bounds.getWest());

        },

        formatNumber: function(num) {
                return num.toLocaleString({
                        minimumFractionDigits: 3,
                        maximumFractionDigits: 3
                });
        },

});

L.control.viewMeta = function(options) {
        return new L.Control.ViewMeta(options);
};
