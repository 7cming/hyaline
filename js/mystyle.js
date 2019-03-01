$(function () {
    $("[addtabs]").click(function () {
        addTabs({id: $(this).attr("id"), title: $(this).attr('title'), close: true});
    });
    $("#navtab .nav-tabs").on("click", "[tabclose]", function (e) {
        id = $(this).attr("tabclose");
        closeTab(id);
    });
    window.onresize = function () {
        var target = $("#boxId .active iframe");
        changeFrameHeight(target);
    }
});

var addTabs = function (options) {
    var url = "";
    options.url = url + options.url;
    id = "tab_" + options.id;
    $("#navtab .active,#boxId .active").removeClass("active");
    //如果TAB不存在，创建一个新的TAB
    if (!$("#" + id)[0]) {
        title = '<li role="presentation" id="tab_' + id + '"><a href="#' + id + '" aria-controls="' + id + '" role="tab" data-toggle="tab"><i class="' + options.icon + '"></i>' + options.title;
        //是否允许关闭
        if (options.close) {
            title += '<i class="fa fa-times-circle fa-lg" tabclose="' + id + '"></i>';
        }
        title += '</a></li>';
        if (options.content) {
            content = '<div role="tabpanel" class="tab-pane" id="' + id + '">' + options.content + '</div>';
        } else {
            content =
                '<div role="tabpanel" class="tab-pane" id="' + id + '">' +
                '<iframe id="iframe_' + id + '" src="' + options.url + '" width="100%" height="100%" onload="changeFrameHeight(this)" frameborder="no" scrolling="yes" allowtransparency="yes">' +
                '</iframe>' +
                '</div>';
        }
        //添加tabs及iframe
        $("#navtab .nav-tabs").append(title);
        $("#boxId").append(content);
        $('#pagemask').show();
    } else {
    }
    //激活TAB
    $("#tab_" + id).addClass('active');
    $("#" + id).addClass("active");

    PositionTab();
};

var closeTab = function (id) {
    //如果关闭的是当前激活的TAB，激活他的前一个TAB
    if ($("#navtab li.active").attr('id') == "tab_" + id) {
        $("#tab_" + id).prev().addClass('active');
        $("#" + id).prev().addClass('active');
    }
    //关闭TAB
    $("#tab_" + id).remove();
    $("#" + id).remove();

    //适应
    var closetw = $("#tab_" + id).width();
    var navul = $('.middletabs').find('ul').first();
    var nleft = parseInt(navul.css('margin-left').replace('px', '')) || 0;
    var nwidth = 0;
    $.each($("#navtab .nav-tabs li"), function (key, item) {
        nwidth += $(item).width();
    });
    if (nleft < 0) {
        var curl = nleft + closetw;
        curl < navul.parent().width() - nwidth && (curl = navul.parent().width() - nwidth);
        curl > 0 && (curl = 0);

        flowRoll(nleft, curl);

        function flowRoll(nleft, curl) {
            nleft -= 15;
            nleft < curl && (nleft = curl);
            navul.css('margin-left', nleft + "px");
            nleft != curl && setTimeout(function () {
                flowRoll(nleft, curl)
            }, 5);
        }
    }
};

var changeFrameHeight = function (that) {
    var box = parent.$('#boxId'), sh = $(window).height() - box[0].getBoundingClientRect().top;
    sh -= parent.document.getElementById("footercontent").offsetHeight;
    $(that).height(sh);
    $(that).parent(".tab-pane").height(sh);
}

$('#navtab').click(function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    if ($(this).children()[0].contains(target)) {
        //左移
        var navul = $(this).find('ul').first(),
            nleft = parseInt(navul.css('margin-left').replace('px', '')) || 0;
        var curl = nleft + 350;
        curl < 200 - navul.width() && (curl = 200 - navul.width());
        curl > 0 && (curl = 0);

        flowRoll(nleft, curl);

        function flowRoll(nleft, curl) {
            nleft += 15;
            nleft > curl && (nleft = curl);
            navul.css('margin-left', nleft + "px");
            nleft != curl && setTimeout(function () {
                flowRoll(nleft, curl)
            }, 5);
        }
    } else if ($(this).children()[2].contains(target)) {
        //右移
        var navul = $('.middletabs').find('ul').first();
        var nleft = parseInt(navul.css('margin-left').replace('px', '')) || 0;
        var nwidth = 0;
        $.each($("#navtab .nav-tabs li"), function (key, item) {
            nwidth += $(item).width();
        });
        var curl = nleft - 350;
        curl < navul.parent().width() - nwidth && (curl = navul.parent().width() - nwidth);
        curl > 0 && (curl = 0);

        flowRoll(nleft, curl);

        function flowRoll(nleft, curl) {
            nleft -= 15;
            nleft < curl && (nleft = curl);
            navul.css('margin-left', nleft + "px");
            nleft != curl && setTimeout(function () {
                flowRoll(nleft, curl)
            }, 5);
        }
    } else if ($(this).find('ul')[0].contains(target)) {
        setTimeout(PositionTab, 20);
    }
});

function PositionTab() {
    var navul = $('#navtab').find('ul').first();
    var nleft = parseInt(navul.css('margin-left').replace('px', '')) || 0;
    var nwidth = 0;
    $.each($("#navtab .nav-tabs li"), function (key, item) {
        nwidth += $(item).width();
    });
    if (navul.parent().width() < nwidth) {
        var lwidth = 0, lthat, curl = 0;
        navul.find('li').each(function () {
            if (this.className.indexOf('active') >= 0) {
                lthat = $(this);
                return false;
            }
            lwidth += this.offsetWidth;
        });
        lwidth < 0 && (lwidth = 0);

        var lnext = 0;
        //左定位
        if (-nleft > lwidth) {
            curl = lthat.prev().width() - lwidth;
        } else if ((lnext = lwidth + lthat.width() + nleft) > navul.parent().width()) {
            curl = navul.parent().width() - lnext + nleft;
        } else {
            curl = nleft
        }
        curl > 0 && (curl = 0);
        curl < navul.parent().width() - nwidth && (curl = navul.parent().width() - nwidth);

        flowRoll(nleft, curl, nleft > curl ? 'right' : 'left');

        function flowRoll(nleft, curl, dir) {
            if (dir == "right") {
                nleft -= 15;
                nleft < curl && (nleft = curl);
            } else {
                nleft += 15;
                nleft > curl && (nleft = curl);
            }
            navul.css('margin-left', nleft + "px");
            nleft != curl && setTimeout(function () {
                flowRoll(nleft, curl, dir)
            }, 5);
        }
    }
}

$('.fullscreen').click(function () {
    var el = document.documentElement; //若要全屏页面中div,var element= document.getElementById("divID");
    //切换全屏
    var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
    } else if (typeof window.ActiveXObject != "undefined") {
        // for Internet Explorer
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
            wscript.SendKeys("{F11}");
        }
    }
    //取消全屏
    var cfs = document.exitFullscreen || document.webkitCancelFullScreen || document.msExitFullscreen || document.mozCancelFullScreen;
    if (typeof cfs != "undefined" && cfs) {
        cfs.call(document);
    } else if (typeof window.ActiveXObject != "undefined") {
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
            wscript.SendKeys("{F11}");
        }
    }
});

$('.centerscreen').click(function () {
    //居中
    if ($('#main-container').hasClass('container')) {
        $('#main-container').removeClass('container');
        $('#sidebar').show();
    } else {
        $('#main-container').addClass('container');
        if ($('#sidebar').hasClass('sidebar-close')) {
            $('#sidebar').hide();
        }
    }
});

$('.closeothertabs').click(function () {
    var lis = $('.middletabs').find('ul').first().css('margin-left', 0).find('li');
    lis.each(function () {
        if (this != lis[0] && this.className.indexOf('active') == -1) {
            $(this).remove();
            $($(this).children().first()[0].hash).remove();
        }
    });
});

$('.closealltabs').click(function () {
    var lis = $('.middletabs').find('ul').first().css('margin-left', 0).find('li');
    lis.each(function () {
        if (this != lis[0]) {
            $(this).remove();
            $($(this).children().first()[0].hash).remove();
        } else {
            lis.first().addClass('active');
            $($(this).children().first()[0].hash).addClass('active');
        }
    });
});

window.onload = function () {
    $(document).off('click.bs.dropdown.data-api');
    $('#portalmask').hide();
};

function pageloadinghide() {
    $('#pagemask').hide();
}

// Make sure jQuery has been loaded
if (typeof jQuery === 'undefined') {
    throw new Error('requires jQuery')
}

/* Layout()
 * ========
 * Implements AdminLTE layout.
 * Fixes the layout height in case min-height fails.
 *
 * @usage activated automatically upon window load.
 *        Configure any options by passing data-option="value"
 *        to the body tag.
 */
+function ($) {
    'use strict';

    var DataKey = 'lte.layout';

    var Default = {
        slimscroll: true,
        resetHeight: true
    };

    var Selector = {
        wrapper: '.wrapper',
        contentWrapper: '.content-wrapper',
        layoutBoxed: '.layout-boxed',
        mainFooter: '.main-footer',
        mainHeader: '.main-header',
        sidebar: '.sidebar',
        controlSidebar: '.control-sidebar',
        fixed: '.fixed',
        sidebarMenu: '.sidebar-menu',
        logo: '.main-header .logo'
    };

    var ClassName = {
        fixed: 'fixed',
        holdTransition: 'hold-transition'
    };

    var Layout = function (options) {
        this.options = options;
        this.bindedResize = false;
        this.activate();
    };

    Layout.prototype.activate = function () {
        this.fix();
        this.fixSidebar();

        $('body').removeClass(ClassName.holdTransition);

        if (this.options.resetHeight) {
            $('body, html, ' + Selector.wrapper).css({
                'height': 'auto',
                'min-height': '100%'
            });
        }

        if (!this.bindedResize) {
            $(window).resize(function () {
                this.fix();
                this.fixSidebar();

                $(Selector.logo + ', ' + Selector.sidebar).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                    this.fix();
                    this.fixSidebar();
                }.bind(this));
            }.bind(this));

            this.bindedResize = true;
        }

        $(Selector.sidebarMenu).on('expanded.tree', function () {
            this.fix();
            this.fixSidebar();
        }.bind(this));

        $(Selector.sidebarMenu).on('collapsed.tree', function () {
            this.fix();
            this.fixSidebar();
        }.bind(this));
    };

    Layout.prototype.fix = function () {
        // Remove overflow from .wrapper if layout-boxed exists
        $(Selector.layoutBoxed + ' > ' + Selector.wrapper).css('overflow', 'hidden');

        // Get window height and the wrapper height
        var footerHeight = $(Selector.mainFooter).outerHeight() || 0;
        var headerHeight = $(Selector.mainHeader).outerHeight() || 0;
        var neg = headerHeight + footerHeight;
        var windowHeight = $(window).height();
        var sidebarHeight = $(Selector.sidebar).height() || 0;

        // Set the min-height of the content and sidebar based on
        // the height of the document.
        if ($('body').hasClass(ClassName.fixed)) {
            $(Selector.contentWrapper).css('min-height', windowHeight - footerHeight);
        } else {
            var postSetHeight;

            if (windowHeight >= sidebarHeight) {
                $(Selector.contentWrapper).css('min-height', windowHeight - neg);
                postSetHeight = windowHeight - neg;
            } else {
                $(Selector.contentWrapper).css('min-height', sidebarHeight);
                postSetHeight = sidebarHeight;
            }

            // Fix for the control sidebar height
            var $controlSidebar = $(Selector.controlSidebar);
            if (typeof $controlSidebar !== 'undefined') {
                if ($controlSidebar.height() > postSetHeight)
                    $(Selector.contentWrapper).css('min-height', $controlSidebar.height());
            }
        }
    };

    Layout.prototype.fixSidebar = function () {
        // Make sure the body tag has the .fixed class
        if (!$('body').hasClass(ClassName.fixed)) {
            if (typeof $.fn.slimScroll !== 'undefined') {
                $(Selector.sidebar).slimScroll({destroy: true}).height('auto');
            }
            return;
        }

        // Enable slimscroll for fixed layout
        if (this.options.slimscroll) {
            if (typeof $.fn.slimScroll !== 'undefined') {
                // Destroy if it exists
                // $(Selector.sidebar).slimScroll({ destroy: true }).height('auto')

                // Add slimscroll
                $(Selector.sidebar).slimScroll({
                    height: ($(window).height() - $(Selector.mainHeader).height()) + 'px'
                });
            }
        }
    };

    // Plugin Definition
    // =================
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data(DataKey);

            if (!data) {
                var options = $.extend({}, Default, $this.data(), typeof option === 'object' && option);
                $this.data(DataKey, (data = new Layout(options)));
            }

            if (typeof option === 'string') {
                if (typeof data[option] === 'undefined') {
                    throw new Error('No method named ' + option);
                }
                data[option]();
            }
        });
    }

    var old = $.fn.layout;

    $.fn.layout = Plugin;
    $.fn.layout.Constuctor = Layout;

    // No conflict mode
    // ================
    $.fn.layout.noConflict = function () {
        $.fn.layout = old;
        return this;
    };

    // Layout DATA-API
    // ===============
    $(window).on('load', function () {
        Plugin.call($('body'));
    });
}(jQuery);


/* PushMenu()
 * ==========
 * Adds the push menu functionality to the sidebar.
 *
 * @usage: $('.btn').pushMenu(options)
 *          or add [data-toggle="push-menu"] to any button
 *          Pass any option as data-option="value"
 */
+function ($) {
    'use strict';

    var DataKey = 'lte.pushmenu';

    var Default = {
        collapseScreenSize: 767,
        expandOnHover: false,
        expandTransitionDelay: 200
    };

    var Selector = {
        collapsed: '.sidebar-collapse',
        open: '.sidebar-open',
        mainSidebar: '.main-sidebar',
        contentWrapper: '.content-wrapper',
        searchInput: '.sidebar-form .form-control',
        button: '[data-toggle="push-menu"]',
        mini: '.sidebar-mini',
        expanded: '.sidebar-expanded-on-hover',
        layoutFixed: '.fixed'
    };

    var ClassName = {
        collapsed: 'sidebar-collapse',
        open: 'sidebar-open',
        mini: 'sidebar-mini',
        expanded: 'sidebar-expanded-on-hover',
        expandFeature: 'sidebar-mini-expand-feature',
        layoutFixed: 'fixed'
    };

    var Event = {
        expanded: 'expanded.pushMenu',
        collapsed: 'collapsed.pushMenu'
    };

    // PushMenu Class Definition
    // =========================
    var PushMenu = function (options) {
        this.options = options;
        this.init();
    };

    PushMenu.prototype.init = function () {
        if (this.options.expandOnHover
            || ($('body').is(Selector.mini + Selector.layoutFixed))) {
            this.expandOnHover();
            $('body').addClass(ClassName.expandFeature);
        }

        $(Selector.contentWrapper).click(function () {
            // Enable hide menu when clicking on the content-wrapper on small screens
            if ($(window).width() <= this.options.collapseScreenSize && $('body').hasClass(ClassName.open)) {
                this.close();
            }
        }.bind(this));

        // __Fix for android devices
        $(Selector.searchInput).click(function (e) {
            e.stopPropagation();
        });
    };

    PushMenu.prototype.toggle = function () {
        var windowWidth = $(window).width();
        var isOpen = !$('body').hasClass(ClassName.collapsed);

        if (windowWidth <= this.options.collapseScreenSize) {
            isOpen = $('body').hasClass(ClassName.open);
        }

        if (!isOpen) {
            this.open();
        } else {
            this.close();
        }
    };

    PushMenu.prototype.open = function () {
        var windowWidth = $(window).width();

        if (windowWidth > this.options.collapseScreenSize) {
            $('body').removeClass(ClassName.collapsed)
                .trigger($.Event(Event.expanded));
        }
        else {
            $('body').addClass(ClassName.open)
                .trigger($.Event(Event.expanded));
        }
    };

    PushMenu.prototype.close = function () {
        var windowWidth = $(window).width();
        if (windowWidth > this.options.collapseScreenSize) {
            $('body').addClass(ClassName.collapsed)
                .trigger($.Event(Event.collapsed));
        } else {
            $('body').removeClass(ClassName.open + ' ' + ClassName.collapsed)
                .trigger($.Event(Event.collapsed));
        }
    };

    PushMenu.prototype.expandOnHover = function () {
        $(Selector.mainSidebar).hover(function () {
            if ($('body').is(Selector.mini + Selector.collapsed)
                && $(window).width() > this.options.collapseScreenSize) {
                this.expand();
            }
        }.bind(this), function () {
            if ($('body').is(Selector.expanded)) {
                this.collapse();
            }
        }.bind(this));
    };

    PushMenu.prototype.expand = function () {
        setTimeout(function () {
            $('body').removeClass(ClassName.collapsed)
                .addClass(ClassName.expanded);
        }, this.options.expandTransitionDelay);
    };

    PushMenu.prototype.collapse = function () {
        setTimeout(function () {
            $('body').removeClass(ClassName.expanded)
                .addClass(ClassName.collapsed);
        }, this.options.expandTransitionDelay);
    };

    // PushMenu Plugin Definition
    // ==========================
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data(DataKey);

            if (!data) {
                var options = $.extend({}, Default, $this.data(), typeof option == 'object' && option);
                $this.data(DataKey, (data = new PushMenu(options)));
            }

            if (option === 'toggle') data.toggle();
        });
    }

    var old = $.fn.pushMenu;

    $.fn.pushMenu = Plugin;
    $.fn.pushMenu.Constructor = PushMenu;

    // No Conflict Mode
    // ================
    $.fn.pushMenu.noConflict = function () {
        $.fn.pushMenu = old;
        return this;
    };

    // Data API
    // ========
    $(document).on('click', Selector.button, function (e) {
        e.preventDefault();
        Plugin.call($(this), 'toggle');
    });
    $(window).on('load', function () {
        Plugin.call($(Selector.button));
    });
}(jQuery);


/* Tree()
 * ======
 * Converts a nested list into a multilevel
 * tree view menu.
 *
 * @Usage: $('.my-menu').tree(options)
 *         or add [data-widget="tree"] to the ul element
 *         Pass any option as data-option="value"
 */
+function ($) {
    'use strict';

    var DataKey = 'lte.tree';

    var Default = {
        animationSpeed: 500,
        accordion: true,
        followLink: false,
        trigger: '.treeview a'
    };

    var Selector = {
        tree: '.tree',
        treeview: '.treeview',
        treeviewMenu: '.treeview-menu',
        open: '.menu-open, .active',
        li: 'li',
        data: '[data-widget="tree"]',
        active: '.active'
    };

    var ClassName = {
        open: 'menu-open',
        tree: 'tree'
    };

    var Event = {
        collapsed: 'collapsed.tree',
        expanded: 'expanded.tree'
    };

    // Tree Class Definition
    // =====================
    var Tree = function (element, options) {
        this.element = element;
        this.options = options;

        $(this.element).addClass(ClassName.tree);

        $(Selector.treeview + Selector.active, this.element).addClass(ClassName.open);

        this._setUpListeners();
    };

    Tree.prototype.toggle = function (link, event) {
        var treeviewMenu = link.next(Selector.treeviewMenu);
        var parentLi = link.parent();
        var isOpen = parentLi.hasClass(ClassName.open);

        if (!parentLi.is(Selector.treeview)) {
            return;
        }

        if (!this.options.followLink || link.attr('href') === '#') {
            event.preventDefault();
        }

        if (isOpen) {
            this.collapse(treeviewMenu, parentLi);
        } else {
            this.expand(treeviewMenu, parentLi);
        }
    };

    Tree.prototype.expand = function (tree, parent) {
        var expandedEvent = $.Event(Event.expanded);

        if (this.options.accordion) {
            var openMenuLi = parent.siblings(Selector.open);
            var openTree = openMenuLi.children(Selector.treeviewMenu);
            this.collapse(openTree, openMenuLi);
        }

        parent.addClass(ClassName.open);
        tree.slideDown(this.options.animationSpeed, function () {
            $(this.element).trigger(expandedEvent);
        }.bind(this));
    };

    Tree.prototype.collapse = function (tree, parentLi) {
        var collapsedEvent = $.Event(Event.collapsed);

        //tree.find(Selector.open).removeClass(ClassName.open);
        parentLi.removeClass(ClassName.open);
        tree.slideUp(this.options.animationSpeed, function () {
            //tree.find(Selector.open + ' > ' + Selector.treeview).slideUp();
            $(this.element).trigger(collapsedEvent);
        }.bind(this));
    };

    // Private

    Tree.prototype._setUpListeners = function () {
        var that = this;

        $(this.element).on('click', this.options.trigger, function (event) {
            that.toggle($(this), event);
        });
    };

    // Plugin Definition
    // =================
    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data(DataKey);

            if (!data) {
                var options = $.extend({}, Default, $this.data(), typeof option == 'object' && option);
                $this.data(DataKey, new Tree($this, options));
            }
        });
    }

    var old = $.fn.tree;

    $.fn.tree = Plugin;
    $.fn.tree.Constructor = Tree;

    // No Conflict Mode
    // ================
    $.fn.tree.noConflict = function () {
        $.fn.tree = old;
        return this;
    };

    // Tree Data API
    // =============
    $(window).on('load', function () {
        $(Selector.data).each(function () {
            Plugin.call($(this));
        });
    });

}(jQuery);
console.log("有问题联系: %c774669939@qq.com\n%cPowered By %c7c", "color:#0099FF", "color:#000", "color:#990099");