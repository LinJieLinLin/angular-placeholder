angular.module('directive', []).directive('placeholder', function() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, e, attr, ctrl) {
            var str = '<style>.placeholder-style{color: gray;}</style>';
            if (angular.element('.placeholder-style').length === 0) {
                angular.element('head').append(str);
            }

            function isIE(min, max) {
                var navAgent = window.navigator.userAgent.toLowerCase(),
                    flag;
                if (navAgent.indexOf('msie') !== -1) {
                    var IE = navAgent.match(/msie\s([0-9]*)/);
                    flag = (arguments.length === 0) ? IE[1] :
                        (arguments.length === 1) ? (parseInt(IE[1]) === min) :
                        (IE[1] >= min && IE[1] <= max) ? IE[1] : false;
                }
                return flag;
            }
            if (isIE(8, 9)) {
                if (!ctrl.$modelValue && ctrl.$modelValue !== false && ctrl.$modelValue !== 0) {
                    e.val(attr.placeholder);
                    e.addClass('placeholder-style');
                }
                try {
                    ctrl.$setViewValue();
                } catch (e) {}

                //对password框的特殊处理1.创建一个text框获取焦点和失去焦点的时候切换  
                if (attr.type === 'password') {
                    e.removeClass('placeholder-style');
                    e.after('<input id="pwdPlaceholder" type="text" value=' + attr.placeholder + ' autocomplete="off" class="placeholder-style" />');
                    var pwdPlaceholder = angular.element('#pwdPlaceholder');
                    pwdPlaceholder.show();
                    e.hide();

                    pwdPlaceholder.focus(function() {
                        pwdPlaceholder.hide();
                        e.show();
                        e.focus();
                    });
                }
                var isFocus = false;
                e.on('focus', function() {
                    isFocus = true;
                    if (attr.type === 'password') {
                        if (!ctrl.$modelValue) {
                            e.val('');
                        }
                    } else {
                        e.removeClass('placeholder-style');
                        if (e.val() === attr.placeholder && !ctrl.$modelValue) {
                            e.val('');
                        }

                    }
                });
                e.on('blur', function() {
                    isFocus = false;
                    if (attr.type === 'password') {
                        if (e.val() === '') {
                            pwdPlaceholder.show();
                            e.hide();
                        }
                    } else {
                        if (!e.val() && !ctrl.$modelValue) {
                            e.val(attr.placeholder);
                            e.addClass('placeholder-style');
                        }
                    }
                });
                scope.$watch(function() {
                    return ctrl.$modelValue;
                }, function(v) {
                    if (v) {
                        e.removeClass('placeholder-style');
                    } else if (isFocus === false) {
                        e.val(attr.placeholder);
                        e.addClass('placeholder-style');
                    }
                });
            }
        }
    };
});
