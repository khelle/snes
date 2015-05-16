var Vertex = require('./Vertex');
var Class = require('../../utils/Class');
var Utils = require('../../utils/Utils');

/** Place class*/
function Place(graph, label, markers) {
    Vertex.call(this, graph, Utils.getValue(label, 'Place'));
    this.setMarkers(Utils.getValue(markers, 0));
}

Place.prototype = {
    getMarkers: function() {
        return this.markers;
    },

    setMarkers: function(markers) {
        this.markers = Utils.number(markers);
        return this;
    },

    incrementMarker: function() {
        return this.addMarkers(1);
    },

    decrementMarker: function() {
        return this.removeMarkers(1);
    },

    addMarkers: function(markers) {
        this.markers += Utils.number(markers);
        return this;
    },

    removeMarkers: function(markers) {
        if (markers > this.markers) {
            this.markers = 0;
            return this;
        }

        this.markers -= Utils.number(markers);
        return this;
    },

    connectTransition: function(transition, weight) {
        validateTransition(transition);

        this.addNeighbour(transition, weight);
        return this;
    },

    disconnectTransition: function(transition) {
        validateTransition(transition);

        this.removeNeighbour(transition);
        return this;
    }
};

Class.extend(Vertex, Place);

/** Transition class */
function Transition(graph, label, priority) {
    Vertex.call(this, graph, Utils.getValue(label, 'Transition'));
    this.setPriority(Utils.getValue(priority, 0));
}

Transition.prototype = {
    getPriority: function() {
        return this.priority;
    },

    setPriority: function(priority) {
        this.priority = priority;
        return this;
    },

    connectPlace: function(place, weight) {
        validatePlace(place);

        this.addNeighbour(place, weight);
        return this;
    },

    disconnectPlace: function(place) {
        validatePlace(place);

        this.removeNeighbour(place);
        return this;
    },

    /*
    Return true if this transition can be executed at this network stance
     */
    canBeExecuted: function() {
        var tmpPlaces = this.getReferencing();

        for (var i in tmpPlaces) {
            if(tmpPlaces[i].getMarkers() < tmpPlaces[i].getCostTo(this))
                return false;
        }
        return true;
    }
};

Class.extend(Vertex, Transition);

/** Argument validators */
function validatePlace(argument) {
    if (!(argument instanceof Place)) {
        throw new Error('Argument must be an instance of Place');
    }
}

function validateTransition(argument) {
    if (!(argument instanceof Transition)) {
        throw new Error('Argument must be an instance of Transition');
    }
}

/** Export */
exports.Place = Place;
exports.Transition = Transition;
