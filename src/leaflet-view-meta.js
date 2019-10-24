L.Control.ViewMeta = L.Control.extend({
    options: {
        position: `topright`,
        placeholderHTML: `-----`
    },

    onRemove: function () {
        L.DomUtil.remove(this.container);
    },

    onAdd: function (map) {
        this.map = map;

        this.container = L.DomUtil.create(`div`, `leaflet-view-meta`);

        L.DomEvent.disableClickPropagation(this.container);
        L.DomEvent.on(this.container, `control_container`, function (e) {
            L.DomEvent.stopPropagation(e);
        });
        L.DomEvent.disableScrollPropagation(this.container);

        let table = L.DomUtil.create(
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

        this.urlParams = new URLSearchParams(window.location.search);
        this.parseParams();

        return this.container;
    },

    addDividerRow: function (tableElement, labelString) {
        let tr = tableElement.insertRow();
        let tdDivider = tr.insertCell();
        tdDivider.colSpan = 2;
        tdDivider.innerText = labelString;
    },

    addDataRow: function (tableElement, labelString) {
        let tr = tableElement.insertRow();
        let tdLabel = tr.insertCell();
        tdLabel.innerText = labelString;
        let tdData = tr.insertCell();
        tdData.innerHTML = this.options.placeholderHTML;
        return tdData;
    },

    parseParams: function () {
        let lat, lng, nb, wb, sb, eb, nw_bound, se_bound, bounds;
        try {
            lat = +this.urlParams.get("lat");
            lng = +this.urlParams.get("lng");

            if (lat && lng) {
                this.map.panTo(new L.LatLng(lat, lng));
            }

            nb = +this.urlParams.get("nb");
            wb = +this.urlParams.get("wb");
            sb = +this.urlParams.get("sb");
            eb = +this.urlParams.get("eb");

            if (nb && sb && eb && wb) {
                nw_bound = L.latLng(nb, wb);
                se_bound = L.latLng(sb, eb);

                bounds = L.latLngBounds(nw_bound, se_bound);

                this.map.fitBounds(bounds);
            }
        } catch (e) {
            console.log(e);
        }
    },

    update: function () {
        let center = this.map.getCenter();
        let bounds = this.map.getBounds();

        let latStr = this.formatNumber(center.lat);
        let lngStr = this.formatNumber(center.lng);

        let nbStr = this.formatNumber(bounds.getNorth());
        let sbStr = this.formatNumber(bounds.getSouth());
        let ebStr = this.formatNumber(bounds.getEast());
        let wbStr = this.formatNumber(bounds.getWest());

        this.lat_e.innerText = latStr;
        this.lng_e.innerText = lngStr;

        this.nb_e.innerText = nbStr;
        this.sb_e.innerText = sbStr;
        this.eb_e.innerText = ebStr;
        this.wb_e.innerText = wbStr;

        this.urlParams.set("lat", latStr);
        this.urlParams.set("lng", lngStr);

        this.urlParams.set("nb", nbStr);
        this.urlParams.set("sb", sbStr);
        this.urlParams.set("eb", ebStr);
        this.urlParams.set("wb", wbStr);

        window.history.replaceState(
            {},
            "",
            `?${this.urlParams.toString()}`
        );
    },

    formatNumber: function (num) {
        return num.toLocaleString({
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
        });
    }
});

L.control.viewMeta = function (options) {
    return new L.Control.ViewMeta(options);
};
