// packing 시 주의점
// 1. var a = function() {}; <- 세미콜론필요, 2 aa={ bb : cc, dd : ee  }; <- 세미콜론, ee <- 세미콜론 없음  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SELECT :: JYH
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(function(){ 
	$(".select>div>ul>li:first-child").click(function(){ var ptr = $(this).parent().parent().prev(); $(ptr).val(''); $(this).siblings().removeClass("select-selected");});
	$(".select>div>ul>li").not(':first-child').click(function(){var val1 = $(this).text(); var val2 = val1.replace(/^\s+|\s+$/g,''); var ptr = $(this).parent().parent().prev(); $(ptr).val(val2); $(this).addClass("select-selected"); $(this).siblings().removeClass("select-selected"); });

	$(".myselect>div>ul>li:first-child").click(function(){ var ptr = $(this).parent().parent().prev(); $(ptr).val(''); document.category_search.submit(); });
	$(".myselect>div>ul>li").not(':first-child').click(function(){ 
		var val1 = $(this).text(); 
		var val2 = $.trim(val1); 
		var ptr = $(this).parent().parent().prev(); 
		$(ptr).val(val2); 
		document.category_search.submit();
	});
});
//////////////////////////////////////////////////
// bootstrap-transition.js v2.3.1 
//////////////////////////////////////////////////
!function ($) { "use strict";  $(function () { $.support.transition = (function () { var transitionEnd = (function () { var el = document.createElement('bootstrap'), transEndEventNames = { 'WebkitTransition' : 'webkitTransitionEnd',  'MozTransition'    : 'transitionend',  'OTransition'      : 'oTransitionEnd otransitionend',  'transition'       : 'transitionend' }, name ;  for (name in transEndEventNames){ if (el.style[name] !== undefined) { return transEndEventNames[name]; } } }());  return transitionEnd && { end: transitionEnd }})();});}(window.jQuery);
//////////////////////////////////////////////////
// bootstrap-collapse.js v2.3.1 
//////////////////////////////////////////////////
!function ($) {"use strict"; var Collapse = function (element, options) { this.$element = $(element); this.options = $.extend({}, $.fn.collapse.defaults, options); if (this.options.parent) { this.$parent = $(this.options.parent)}  this.options.toggle && this.toggle();}; Collapse.prototype = { constructor: Collapse , dimension: function () { var hasWidth = this.$element.hasClass('width'); return hasWidth ? 'width' : 'height';}, show: function () {var dimension, scroll, actives, hasData;  if (this.transitioning || this.$element.hasClass('in')) return; dimension = this.dimension(); scroll = $.camelCase(['scroll', dimension].join('-'));  actives = this.$parent && this.$parent.find('> .accordion-group > .in');  if (actives && actives.length) { hasData = actives.data('collapse'); if (hasData && hasData.transitioning) return;  actives.collapse('hide');  hasData || actives.data('collapse', null);  }  this.$element[dimension](0); this.transition('addClass', $.Event('show'), 'shown'); $.support.transition && this.$element[dimension](this.$element[0][scroll]); }, hide: function () { var dimension; if (this.transitioning || !this.$element.hasClass('in')) return;  dimension = this.dimension(); this.reset(this.$element[dimension]());  this.transition('removeClass', $.Event('hide'), 'hidden');  this.$element[dimension](0); }, reset: function (size) { var dimension = this.dimension();  this.$element.removeClass('collapse')[dimension](size || 'auto')[0].offsetWidth; this.$element[size !== null ? 'addClass' : 'removeClass']('collapse');  return this;}, transition: function (method, startEvent, completeEvent) { var that = this, complete = function () {  if (startEvent.type == 'show') that.reset(); that.transitioning = 0; that.$element.trigger(completeEvent);  };   this.$element.trigger(startEvent);  if (startEvent.isDefaultPrevented()) return;   this.transitioning = 1;  this.$element[method]('in');  $.support.transition && this.$element.hasClass('collapse') ?   this.$element.one($.support.transition.end, complete) :  complete();  }, toggle: function () {  this[this.$element.hasClass('in') ? 'hide' : 'show'](); } };  var old = $.fn.collapse; $.fn.collapse = function (option) {  return this.each(function () {  var $this = $(this), data = $this.data('collapse'), options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option);  if (!data) $this.data('collapse', (data = new Collapse(this, options))); if (typeof option == 'string') data[option](); }); };  $.fn.collapse.defaults = { toggle: true }; $.fn.collapse.Constructor = Collapse; $.fn.collapse.noConflict = function () { $.fn.collapse = old;  return this; }; $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) { var $this = $(this), href, target = $this.attr('data-target') || e.preventDefault() || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''), option = $(target).data('collapse') ? 'toggle' : $this.data(); $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed'); $(target).collapse(option); });}(window.jQuery);
//////////////////////////////////////////////////
// bootstrap-dropdown.js v2.3.1 
//////////////////////////////////////////////////
!function ($) { "use strict"; var toggle = '[data-toggle=dropdown]', Dropdown = function (element) { var $el = $(element).on('click.dropdown.data-api', this.toggle);  $('html').on('click.dropdown.data-api', function () { $el.parent().removeClass('open'); }); };  Dropdown.prototype = { constructor: Dropdown, toggle: function (e) { var $this = $(this), $parent, isActive; if ($this.is('.disabled, :disabled')) return; $parent = getParent($this); isActive = $parent.hasClass('open');  clearMenus(); if (!isActive) { $parent.toggleClass('open'); }  $this.focus();  return false; }, keydown: function (e) { var $this, $items, $active, $parent, isActive, index;  if (!/(38|40|27)/.test(e.keyCode)) return;   $this = $(this);  e.preventDefault(); e.stopPropagation(); if ($this.is('.disabled, :disabled')) return;  $parent = getParent($this); isActive = $parent.hasClass('open'); if (!isActive || (isActive && e.keyCode == 27)) {  if (e.which == 27) $parent.find(toggle).focus();  return $this.click() }   $items = $('[role=menu] li:not(.divider):visible a', $parent); if (!$items.length) return; index = $items.index($items.filter(':focus')); if (e.keyCode == 38 && index > 0) index-- ; if (e.keyCode == 40 && index < $items.length - 1) index++; if (!~index) index = 0;  $items.eq(index).focus() } };  function clearMenus() { $(toggle).each(function () { getParent($(this)).removeClass('open');});} function getParent($this) { var selector = $this.attr('data-target'), $parent; if (!selector) { selector = $this.attr('href');  selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); }  $parent = selector && $(selector); if (!$parent || !$parent.length) $parent = $this.parent();  return $parent; } var old = $.fn.dropdown; $.fn.dropdown = function (option) { return this.each(function () { var $this = $(this), data = $this.data('dropdown'); if (!data) $this.data('dropdown', (data = new Dropdown(this)));  if (typeof option == 'string') data[option].call($this);  });  }; $.fn.dropdown.Constructor = Dropdown; $.fn.dropdown.noConflict = function () { $.fn.dropdown = old;   return this; }; $(document).on('click.dropdown.data-api', clearMenus).on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() }).on('click.dropdown-menu', function (e) { e.stopPropagation() }).on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle).on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown);}(window.jQuery);
//////////////////////////////////////////////////
// bootstrap-popover.js v2.3.1 
//////////////////////////////////////////////////
//!function ($) { "use strict"; var Popover = function (element, options) { this.init('popover', element, options) }; Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, { constructor: Popover, setContent: function () { var $tip = this.tip(), title = this.getTitle(), content = this.getContent(); $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title);  $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content); $tip.removeClass('fade top bottom left right in');  }, hasContent: function () { return this.getTitle() || this.getContent(); }, getContent: function () { var content, $e = this.$element, o = this.options;  content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content) || $e.attr('data-content'); return content; }, tip: function () { if (!this.$tip) { this.$tip = $(this.options.template) }  return this.$tip; }, destroy: function () { this.hide().$element.off('.' + this.type).removeData(this.type); }});  var old = $.fn.popover; $.fn.popover = function (option) { return this.each(function () { var $this = $(this), data = $this.data('popover'), options = typeof option == 'object' && option;  if (!data) $this.data('popover', (data = new Popover(this, options))); if (typeof option == 'string') data[option](); }); }; $.fn.popover.Constructor = Popover; $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, { placement: 'right', trigger: 'click', content: '', template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>' });  $.fn.popover.noConflict = function () { $.fn.popover = old;  return this; };}(window.jQuery);
/////////////////////////////////////////////////
// bootstrap-tab.js v2.3.1 
//////////////////////////////////////////////////
!function ($) { "use strict"; var Tab = function (element) { this.element = $(element); };  Tab.prototype = { constructor: Tab, show: function () { var $this = this.element, $ul = $this.closest('ul:not(.dropdown-menu)'), selector = $this.attr('data-target'), previous, $target, e; if (!selector) {  selector = $this.attr('href');   selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); } if ( $this.parent('li').hasClass('active') ) return;  previous = $ul.find('.active:last a')[0];  e = $.Event('show', { relatedTarget: previous  });  $this.trigger(e);  if (e.isDefaultPrevented()) return;  $target = $(selector);  this.activate($this.parent('li'), $ul);  this.activate($target, $target.parent(), function () { $this.trigger({ type: 'shown', relatedTarget: previous }); }); }, activate: function ( element, container, callback) { var $active = container.find('> .active'), transition = callback && $.support.transition && $active.hasClass('fade');  function next() { $active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active');  element.addClass('active'); if (transition) { element[0].offsetWidth;  element.addClass('in'); } else {element.removeClass('fade');}  if ( element.parent('.dropdown-menu') ) { element.closest('li.dropdown').addClass('active');}  callback && callback(); }   transition ?  $active.one($.support.transition.end, next) : next(); $active.removeClass('in'); } };  var old = $.fn.tab; $.fn.tab = function ( option ) { return this.each(function () { var $this = $(this), data = $this.data('tab');  if (!data) $this.data('tab', (data = new Tab(this))); if (typeof option == 'string') data[option](); });  };  $.fn.tab.Constructor = Tab;  $.fn.tab.noConflict = function () { $.fn.tab = old;  return this;  };  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) { e.preventDefault(); $(this).tab('show'); });}(window.jQuery);
// 