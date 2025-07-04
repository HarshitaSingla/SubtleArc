L.Curve = L.Path.extend({
    options: {},
    initialize: function(path, options){
        L.setOptions(this, options);
        this._setPath(path);
    },
    getPath: function(){
        return this._coords;
    },
    _setPath: function(path){
        this._coords = path;
        this.redraw();
    },
    _project: function(){
        var px = [],
            path = this._coords;

        for (var i = 0; i < path.length; i++) {
            if (typeof path[i] == 'string') {
                px.push(path[i]);
            } else {
                var point = this._map.latLngToLayerPoint(path[i]);
                px.push(point);
            }
        }

        this._points = px;
    },
    _update: function(){
        if (!this._map) { return; }

        this._updatePath();
    },
    _updatePath: function(){
        this._renderer._updatecurve(this);
    }
});

L.curve = function (path, options){
    return new L.Curve(path, options);
};

L.SVG.include({
    _updatecurve: function(layer){
        var d = this._curvePointsToPath(layer._points);
        this._setPath(layer, d);
    },
    _curvePointsToPath: function(points){
        var point, curCommand, str = '';
        for (var i = 0; i < points.length; i++) {
            point = points[i];
            if (typeof point == 'string') {
                curCommand = point;
                str += curCommand;
            } else {
                str += point.x + ',' + point.y + ' ';
            }
        }
        return str || 'M0 0';
    }
});