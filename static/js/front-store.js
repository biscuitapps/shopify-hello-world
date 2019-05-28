(function() {

    var sayHello = function($) {
        $("html").append($("<div id='hello-message'>Hello World!</div>"));
        $("#hello-message").dialog();
    };

    var monitor = function(element, callback) {
        // if the browser is Internet Explorer.
        if (element.readyState) {
            element.onreadystatechange = function() {
                if (element.readyState == "loaded" || script.readyState == "complete") {
                    element.onreadystatechange = null;
                    callback();
                }
            };
        // for any other browser.
        } else {
            element.onload = function() {
                callback();
            };
        }
    };

    var loadScript = function(url, callback) {

        var script = document.createElement("script");
        script.type = "text/javascript";
        monitor(script, callback);
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    };

    var loadStyleSheet = function(url, callback) {

        var link = document.createElement("link");
        link.rel = "stylesheet";
        monitor(link, callback);
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    };

    var loadDeferred = function(url, $, load) {
        var deferred = $.Deferred();
        load(url, function() {
            deferred.resolve();
        });
        return deferred;
    }

    var loadJQueryUI = function($) {
        var jsDeferred = loadDeferred(
            "//code.jquery.com/ui/1.12.0/jquery-ui.min.js",
            $, loadScript
        );
        var cssDeferred = loadDeferred(
            "//code.jquery.com/ui/1.12.0/themes/smoothness/jquery-ui.css",
            $, loadStyleSheet
        );
        jQuery.when(jsDeferred, cssDeferred).then(function() {
            sayHello($);
        });
    }

    if ((typeof jQuery === 'undefined') || (parseFloat(jQuery.fn.jquery) < 1.12)) {
        loadScript("//code.jquery.com/jquery-1.12.4.min.js", function() {
            jQuery191 = jQuery.noConflict(true);
            loadJQueryUI(jQuery191);
        });
    } else {
        loadJQueryUI(jQuery);
    }
})();
