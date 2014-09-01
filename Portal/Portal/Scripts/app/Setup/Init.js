﻿/**
 *  Init Gnx namespace
 *  Other modules, classes will extend it
*/
(function ($, namespace, undefined) {

    var me = namespace;

    /**
     * Method initializes freewall and other setup stuff 
     */
    me.init = function () {

        var l = new me.Layout();
        l.init();

        var w = new me.Wall();
        w.init();

        var m = new me.Module();
        m.init();
        
        me.initialized = true;

        // bind to layout west panel resize
        // event triggered from Layout class
        $(document).on("layout-west-resize", function () {
            w.refresh();
        });

        return me.initialized;
    }

    return me;

})(jQuery, window.Gnx = window.Gnx || {});
