function Stack(options, container) {
  
  options = options || {};

  console.log(QuarryVM);

  this.features = ko.observableArray([]);

  // computes
  this.width = ko.computed(function() {
    var widest_element =  _.max(this.features(), function(f) {
      return f.width();
    });
    return(widest_element) ? widest_element.width() : 1 ;
  }, this);

  // load all initial features
  var self = this;
  _.each(options.features, function(feature) {
    self.addFeature(feature);
  });

}

Stack.prototype = {
  addFeature: function(f) {
    this.features.unshift(new Feature(f));
  },
  addNewFeature: function() {
    this.addFeature({name:QuarryVM.new_feature()});
    QuarryVM.new_feature("");
    QuarryVM.saveToLocalStorage();
  },
  removeFeature: function(f) {
    this.features.remove(f);
    if (this.features().length === 0) {
      QuarryVM.stacks.remove(this);
    }
    QuarryVM.active_feature({});
    QuarryVM.saveToLocalStorage();
  },
  animateRemovingFeature: function(elem, index, item) {
    // $(elem).slideUp(1000, function() { $(elem).remove(); });
    $(elem).addClass("removing");
    setTimeout(function(){
      $(elem).remove();
    }, 500);
  }
};