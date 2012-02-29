function Feature(options) {

  options = options || {};

  // observables
  this.id = ko.observable(options.id || guidGenerator());
  this.name = ko.observable("This feature doesn't have a name yet");
  this.width = ko.observable(options.width || 1);

  // computes
  this.is_active_feature = ko.computed(function() {
    return QuarryVM.active_feature() === this;
  }, this);

  // subscribes
  this.name.subscribe(function(val) {
    QuarryVM.saveToLocalStorage();
  }, this);

}

Feature.prototype = {
  click: function(d, e) {
    e.stopPropagation();
    if (this.is_active_feature()) QuarryVM.active_feature({});
    else QuarryVM.active_feature(this);
  },
  increaseWidth: function(d, e) {
    e.stopPropagation();
    var new_width = this.width() + 1;
    this.width(new_width);
  }
};