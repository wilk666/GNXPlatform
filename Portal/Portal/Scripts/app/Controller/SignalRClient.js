﻿/**
 *  Manage Modules
*/
Gnx.SignalRClient = function () {

    var self = this;

    /**
     * private
     */
    var _initialized = false;
    this.initialized = false;

    this.clientName = '666';

    var _signalRHubUrl = null;

    var _hubName = null;

    var _roomId = null;

    var _chat = null;


    var _initSignalR = function (signalRHubUrl, hubName, roomId) {

        if (signalRHubUrl) {
            this.signalRHubUrl = _signalRHubUrl = signalRHubUrl;
        }
        if (hubName) {
            this.hubName = _hubName=  hubName;
        }

        if (roomId) {
            this.roomId = _roomId = roomId;
        }

        var self = this;

        // set url to SignalR hub
        $.connection.hub.url = this.signalRHubUrl;

        // Declare a proxy to reference the hub. 
        // Hub name read from global variable
        _chat = $.connection[this.hubName];

        //// method called from "JoinRoom" Hub class
        _chat.client.joinedRoom = _joinedRoom;

        _chat.client.userLoggedInSuccess = _userLoggedInSuccess;

        _chat.client.userLoggedOffSuccess = _userLoggedOffSuccess;

        $.connection.logging = true;

        $.connection.hub.start().done(function () {
            _chat.server.joinRoom(self.roomId, self.clientName);
        });
    }

    var _joinedRoom = function () {
        var not = $.Notify({
            caption: "Joinded",
            content: "Main Module joinded SignalR room",
            timeout: 1000
        });
        Gnx.Event.fireEvent('joinedSignalR', { roomId: this.roomId, clientName: this.clientName });
    };

    var _userLoggedInSuccess = function () {
        var not = $.Notify({
            caption: "Login",
            content: "User login success",
            timeout: 1000
        });
    };

    var _userLoggedOffSuccess = function () {
        var not = $.Notify({
            caption: "Logoff",
            content: "User logoff success",
            timeout: 1000
        });
    };

    // Call SignalR service to pass information to gnx-container that module should be loaded
    var _onAddGadget = function(evt, data){
        var signalRMessage = {
            roomId: roomId,
            data: data.record
        }
        _chat.server.gadgetDropped(signalRMessage);
    }


    //Gnx.Event.fireEvent('modules-get-done', { records: self.modules });

    this.init = function (signalRHubUrl, hubName, roomId) {

        // prevent calling init method after it started already
        if (_initialized) return;

        _initSignalR(signalRHubUrl, hubName, roomId);

        this.initialized = true;


        // bind events
        Gnx.Event.on('add-gadget', _onAddGadget);


        return this.initialized;
    }
};
