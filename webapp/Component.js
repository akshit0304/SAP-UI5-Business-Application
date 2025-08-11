sap.ui.define([
    "sap/ui/core/UIComponent",
    "bd/businessportal/model/models",
    "sap/ui/core/routing/History",
    "sap/ui/Device"
], (UIComponent, models,History,Device) => {
    "use strict";

    return UIComponent.extend("bd.businessportal.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
            // 1-Event bus initialization
            // const oBus = sap.ui.getCore().getEventBus();
            // oBus.subscribe("myChannel", "myEvent", this.onMyEventReceived, this);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
        },
        getContentDensityClass: function () {
            if (!this._sContentDensityClass) {
              if (Device.support.touch) {
                this._sContentDensityClass = "sapUiSizeCozy";
              } else {
                this._sContentDensityClass = "sapUiSizeCompact";
              }
            }
            return this._sContentDensityClass;
          },
        navbuttonPressed:function(oEvent){
            const oHistory =History.getInstance();
            let hash =oHistory.getPreviousHash();

            if(hash !=undefined){
              window.history.go(-1);
            }
            else{
              this.getRouter().navTo("RouteView1",{},true);
            }
          }
    });
});