/**
 * Validation Plugin - Class ValidationConstructor
 * Author: Jim Isaacs <info@jimisaacs.com>
 * Created: 11/11/2010
 * Upated: 05/03/2011
 * Version: 2
 */
(function($) {
    /**
     * Private - Called from element scope.
     * This is the place any custom validation should be integrated.
     * @return Boolean
     */
    function _validity( conf ) {
        if (this.disabled) {
            if (conf.validateDisabled) {
                this.disabled = false;
                this.setCustomValidity(this.validationMessage);
                this.disabled = true;
            }
        // field is enabled
        } else {
            this.setCustomValidity('');
            if (this.type.toLocaleLowerCase() == 'number') {
                if (this.pattern && !this.value.match(new RegExp(this.pattern)) )
                    this.setCustomValidity('pattern mismatch');
            }
        }
        // Change state based on validity.
        if (this.validity.valid) {
            if (conf.invalidated) $(this).removeClass(conf.className);
        } else {
            // if invalidated, and valueMissing, remove css state
            if (conf.invalidated) $(this)[(this.validity.valueMissing ? 'remove' : 'add')+'Class'](conf.className);
        }
        if (conf.form) _formValidity(this, conf);
        return this.validity.valid;
    }
    /**
     * Private - Changes form validation state based on this.
     * @return void
     */
    function _formValidity( element, conf ) {
        var i = conf.invalid.indexOf(element);
        if (element.validity.valid) {
            if (i !== -1) conf.invalid.splice(i, 1);
        } else {
            if (i === -1) conf.invalid.push(element);
        }
        // Change state based on validity.
        conf.valid = conf.invalid.length === 0;
        $(conf.form)[(conf.valid ? 'remove' : 'add')+'Class'](conf.className);
    }
    /**
     * Private - The only place the element is invalidated outside of setting the initial value.
     * @return void
     */
    function _onInvalid( element, conf ) {
        // invalidate now
        conf.invalidated = true;
        $(element).addClass(conf.className);
        // form case
        if (conf.form) {
            conf.valid = false;
            var i = conf.invalid.indexOf(element);
            // true if not in the array or the first item in the array
            if (i <= 0) {
                if (i === -1) conf.invalid.push(element);
                $(conf.form).addClass(conf.className);
                // dispatch custom event for 'invalid' specifically from <form>
                var e = document.createEvent('Event');
                e.initEvent('invalid', false, false);
                conf.form.dispatchEvent(e);
            }
        }
    }
    /**
     * Private
     * @return void
     */
    function _init( target, conf ) {
        // Setup only once.
        if (target.__lookupSetter__('validation')) {
            target.validation = conf;
            return;
        }

        // flag is to avoid double validation checking both input and change events.
        // input is fired before change (usually).
        var flag = false,
            getter = function() { return conf; },
            setter = function(v) { conf = v; },
            handleInvalid = function(event) { _onInvalid(event.target, conf); };

        // Special property referencing the target's conf directly.
        target.__defineGetter__('validation', getter);
        target.__defineSetter__('validation', setter);

        // form listens for bubbled
        target.addEventListener('input', function(event) {
            flag = true;
            // dispatch custom event of 'validinput' or 'invalidinput'
            var e = document.createEvent('Event');
            e.initEvent((_validity.call(event.target, conf) ? '' : 'in')+'validinput', true, true);
            event.target.dispatchEvent(e);
        }, false);

        // form listens for bubbled
        target.addEventListener('change', function(event) {
            if (!flag) {
                // dispatch custom event of 'validchange' or 'invalidchange'
                var e = document.createEvent('Event');
                e.initEvent((_validity.call(event.target, conf) ? '' : 'in')+'validchange', true, true);
                event.target.dispatchEvent(e);
            }
            flag = false;
        }, false);

        // Initial call (should not invalidate if invalidate was not set to true)
        if (conf.form) {
            conf.valid = true;
            conf.invalid = [];
            var i = target.elements.length;
            while(i--) {
                target.elements[i].__defineGetter__('validation', getter);
                target.elements[i].__defineSetter__('validation', setter);
                // invalid doesn't bubble
                target.elements[i].addEventListener('invalid', handleInvalid, false);
                if (!_validity.call(target.elements[i], conf) && conf.valid) conf.valid = false;
            }
        } else {
            // invalid doesn't bubble
            target.addEventListener('invalid', handleInvalid, false);
            _validity.call(target, conf);
        }
    }
    /**
     * ValidationConstructor
     */
    function ValidationConstructor() {};
    /**
     * ValidationConstructor Prototype
     */
    $.extend(ValidationConstructor.prototype, {
        /**
         * Initiates validation on a single element
         * @param HTMLElement element
         * @param Object conf
         */
        init: function ( element, conf ) {
            // The form is either a custom value, the element's containing form, or null.
            conf.form = conf.form || (element.form ? element.form : null);
            // Init either the form, or element.
            _init(conf.form || element, conf);
        }
    });
    /**
     * Global Singleton
     */
    window.Validation = new ValidationConstructor();
    /**
     * Zepto || jQuery extension
     */
    $.extend($.fn, {
        validation: function( conf ) {
            // conf object to be used for validation.
            var defaults = {
                className: 'invalid',
                invalidated: false,
                validateDisabled: true
            };
            conf = typeof conf === 'object' ? $.extend(defaults, conf) : defaults;
            // Init all things in the selector one at a time, but... with the same conf.
            return this.each(function( i, e ) { Validation.init(e, conf); });
        }
    });
})(Zepto || jQuery);