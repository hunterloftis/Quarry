function Quarry(options) {
  
  options = options || {};

  // observables
  this.new_feature = ko.observable("");
  this.stacks = ko.observableArray([]);
  this.active_feature = ko.observable({});

  // computes
  this.adding_new_feature = ko.computed(function() {
    return true || this.new_feature() !== "";
  }, this);

}


// prototype methods
Quarry.prototype = {
  addStack: function(s) {
    
    this.stacks.push(new Stack(s));
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
  saveToLocalStorage: function() {
    amplify.store('quarry', ko.toJSON(this));
  },
  clear_new_feature: function() {
    this.new_feature("");
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
  }
};