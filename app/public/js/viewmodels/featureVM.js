function Feature(options) {

  options = options || {};

  // observables
  this.id = ko.observable(options.id || guidGenerator());
  this.name = ko.observable(options.name || "");
  this.dependants = ko.observableArray([]);

  // computes
  this.is_active_feature = ko.computed(function() {
    return QuarryVM.active_feature() && QuarryVM.active_feature().id() === this.id();
  }, this);


  this.width = ko.computed(function(){
    
    var deps = this.dependants(),
        starting = (deps.length > 0) ? 0 : 1 ;

    var width =  _.reduce(deps, function(memo, d){ 
      var c = memo + d.width(); 
      return  c;
    }, starting);

    if (this.is_active_feature()) {
      return Math.max(width, 3);
    }
    else return width;

  }, this);

  this.elem_width = ko.computed(function() {
    var w = feature_width + feature_margin * 2;
    return (this.width() > 1) ? (this.width() * w) + "px" : feature_width+"px" ;
  }, this);

  

  // subscribes
  this.name.subscribe(function(val) {
    QuarryVM.saveToLocalStorage();
  }, this);


  // load all initial dependants
  var self = this;
  _.each(options.dependants, function(d) {
    self.dependants.push(new Feature(d));
  });

}

Feature.prototype = {
  click: function(d, e) {
    e.stopPropagation();
    if (this.is_active_feature()) {
      QuarryVM.active_feature(null);
    }
    else {
      QuarryVM.active_feature(this);
    }
  },
  close: function() {
    QuarryVM.active_feature(null);
  },
  addDependant: function(d, e) {
    e.stopPropagation();
    this.dependants.push(new Feature());
    QuarryVM.saveToLocalStorage();
  },
  removeFeature: function(f) {
    this.dependants.remove(f);
    QuarryVM.saveToLocalStorage();
  }
};



function guidGenerator() {
  var S4 = function() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}