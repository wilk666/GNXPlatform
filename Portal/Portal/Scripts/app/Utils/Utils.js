﻿$.getAntiForgeryToken = function (tokenWindow, appPath) {
    // HtmlHelper.AntiForgeryToken() must be invoked to print the token.
    tokenWindow = tokenWindow && typeof tokenWindow === typeof window ? tokenWindow : window;

    appPath = appPath && typeof appPath === "string" ? "_" + appPath.toString() : "";
    // The name attribute is either __RequestVerificationToken,
    // or __RequestVerificationToken_{appPath}.
    var tokenName = "__RequestVerificationToken" + appPath;

    // Finds the <input type="hidden" name={tokenName} value="..." /> from the specified window.
    // var inputElements = tokenWindow.$("input[type='hidden'][name=' + tokenName + "']");
    var inputElements = tokenWindow.document.getElementsByTagName("input");
    for (var i = 0; i < inputElements.length; i++) {
        var inputElement = inputElements[i];
        if (inputElement.type === "hidden" && inputElement.name === tokenName) {
            return {
                name: tokenName,
                value: inputElement.value
            };
        }
    }
};

$.appendAntiForgeryToken = function (data, token) {
    // Converts data if not already a string.
    if (data && typeof data !== "string") {
        data = $.param(data);
    }

    // Gets token from current window by default.
    token = token ? token : $.getAntiForgeryToken(); // $.getAntiForgeryToken(window).

    data = data ? data + "&" : "";
    // If token exists, appends {token.name}={token.value} to data.
    return token ? data + encodeURIComponent(token.name) + "=" + encodeURIComponent(token.value) : data;
};

// Wraps $.post(url, data, callback, type) for most common scenarios.
$.postAntiForgery = function (url, data, callback, type) {
    return $.post(url, $.appendAntiForgeryToken(data), callback, type);
};

// Wraps $.ajax(settings).
$.ajaxAntiForgery = function (settings) {
    // Supports more options than $.ajax(): 
    // settings.token, settings.tokenWindow, settings.appPath.
    var token = settings.token ? settings.token : $.getAntiForgeryToken(settings.tokenWindow, settings.appPath);
    settings.data = $.appendAntiForgeryToken(settings.data, token);
    return $.ajax(settings);
};

$.getHeaders = function (includeAuth) {

    if (this.accessData.Token && !includeAuth) {
        return {
            "Authorization": "Bearer " + this.accessData.Token,
            "Content-Type": "application/json;charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Accept": "application/json",// REQUIRED for FF in order to do proper JSON reuqest
            "Origin": window.location.host
        }
    }

    if (includeAuth) {
        return {
            "Content-Type": "application/json;charset=utf-8",
            "Accept": "application/json" // REQUIRED for FF in order to do proper JSON reuqest
        }
    }

}

$.getUuid = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};



/**
 * Plugin to show loadmask on given div, a, span elements
 * usage: $('#west-pane-div').showLoadMask();
 */
$.fn.showLoadMask = function () {
    var lmId = this.data("_loadMaskId_");

    if (!lmId) {

        lmId = $.getUuid();
        // assign loadmask id to DOM object data
        this.data("_loadMaskId_", lmId);
        // html template
        var html = '<div id="' + lmId + '" style="position: absolute;top: 0px;left: 0px;height: 100%;width: 100%;background-color: transparent;display: none;">' +
                        '<img src="../Content/Images/loading-blue.gif" alt="Loading" style="position: absolute;left: 50%;top: 50%;margin-left: -100px;margin-top: -50px;height: auto;width: 100px;" />' +
                    '</div>';
        this.append(html);
    }
    
    $("#" + lmId).show();
}

/**
 * Plugin to hide loadmask assigned to given div, a, span elements if shown using "showLoadMask" plugin
 * usage: $('#west-pane-div').hideLoadMask();
 */
$.fn.hideLoadMask = function () {
    // get assigned loadmask id from DOM object data
    var lmId = this.data("_loadMaskId_");
    $("#" + lmId).hide();
}