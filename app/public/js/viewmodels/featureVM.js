function Feature(options) {

  options = options || {};

  // observables
  this.id = ko.observable(options.id || guidGenerator());
  this.name = ko.observable(options.name || "");
  this.dependants = ko.observableArray([]);

  // computes
  this.width = ko.computed(function(){
    
    var deps = this.dependants(),
        starting = (deps.length > 0) ? 0 : 1 ;

    var width =  _.reduce(deps, function(memo, d){ 
      var c = memo + d.width(); 
      return  c;
    }, starting);

    return width;

  }, this);

  this.elem_width = ko.computed(function() {
    var width = feature_width + 6;
    return (this.width() > 1) ? (this.width() * 210) + "px" : "200px" ;
  }, this);

  this.is_active_feature = ko.computed(function() {
    return QuarryVM.active_feature() === this;
  }, this);

  // subscribes
  this.name.subscribe(function(val) {
    QuarryVM.saveToLocalStorage();
  }, this);


  // load all initial dependants
  var self = this;
  _.each(options.dependants, function(d) {
    self.addDependant(d);
  });

}

Feature.prototype = {
  click: function(d, e) {
    e.stopPropagation();
    if (this.is_active_feature()) QuarryVM.active_feature(null);
    else QuarryVM.active_feature(this);
  },
  addDependant: function(d) {
    this.dependants.push(new Feature(d));
  },
  addNewDependant: function() {
    this.dependants.push(new Feature());
    QuarryVM.saveToLocalStorage();
  },
  removeFeature: function(f) {
    this.dependants.remove(f);
    QuarryVM.active_feature({});
    QuarryVM.saveToLocalStorage();
  }
};



function guidGenerator() {
  var S4 = function() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}