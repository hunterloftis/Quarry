function Quarry(options) {
  
  options = options || {};

  // observables
  this.stacks = ko.observableArray([]);
  this.features = ko.observableArray([]);
  this.active_feature = ko.observable(null);


  // computes
  this.has_active_feature = ko.computed(function() {
    return this.active_feature() !== null;
  }, this);

  this.active_feature_details = ko.computed(function() {
    if (this.has_active_feature()) {
      return this.active_feature();
    }
    else {
      return {
        id:"",
        name:"",
        dependants:[],
        addDependant:function(){},
        addNewDependant:function(){},
        removeFeature:function(){}
      };
    }
  }, this);

}


// prototype methods
Quarry.prototype = {
  addFeature: function(f) {
    this.features.push(new Feature(f));
  },
  prependFeatureList: function() {
    this.features.unshift(new Feature());
    this.saveToLocalStorage();
  },
  appendFeatureList: function() {
    this.features.push(new Feature());
    this.saveToLocalStorage();
  },
  saveToLocalStorage: function() {
    amplify.store('quarry', ko.toJSON(this));
  },
  removeFeature: function(f) {
    console.log("removing from quarryVM");
    this.active_feature(null);
    this.features.remove(f);
    this.saveToLocalStorage();
  },
  loadFeatures: function() {
    var initial_features = [],
        self = this;

    if (amplify.store('quarry')) {
      initial_features = JSON.parse(amplify.store('quarry')).features;
    }

    // load all initial features
    _.each(initial_features, function(feature) {
      self.addFeature(feature);
    });
  },
  animateRemovingFeature: function(elem, index, item) {
    // $(elem).slideUp(1000, function() { $(elem).remove(); });
    $(elem).addClass("removing");
    setTimeout(function(){
      $(elem).remove();
    }, 500);
  }
};