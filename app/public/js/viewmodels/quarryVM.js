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
        name:"",
        dependants:[],
        addDependant:function(){},
        addNewDependant:function(){}
      };
    }
  }, this);

}


// prototype methods
Quarry.prototype = {
  addStack: function(s) {
    this.stacks.push(new Stack(s));
  },
  addFeature: function(f) {
    this.features.push(new Feature(f));
  },
  prependNewStackFromFeature: function() {
    this.stacks.unshift(new Stack({features:[{name:this.new_feature()}]}));
    this.new_feature("");
    this.saveToLocalStorage();
  },
  appendNewStackFromFeature: function() {
    this.stacks.push(new Stack({features:[{name:this.new_feature()}]}));
    this.new_feature("");
    this.saveToLocalStorage();
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
    this.features.remove(f);
    this.active_feature({});
    this.saveToLocalStorage();
  },
  loadStacks: function() {
    var initial_stacks = [],
        self = this;

    if (amplify.store('quarry')) {
      initial_stacks = JSON.parse(amplify.store('quarry')).stacks;
    }

    // load all initial stacks
    _.each(initial_stacks, function(stack) {
      self.addStack(stack);
    });
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