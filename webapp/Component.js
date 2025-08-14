sap.ui.define([
  "sap/ui/core/UIComponent",
  "bd/businessportal/model/models",
  "sap/ui/core/routing/History",
  "sap/ui/Device"
], (UIComponent, models, History, Device) => {
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
      this.loaded_model =undefined;
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
    navbuttonPressed: function (oEvent) {
      const oHistory = History.getInstance();
      let hash = oHistory.getPreviousHash();

      if (hash != undefined) {
        window.history.go(-1);
      }
      else {
        this.getRouter().navTo("RouteView1", {}, true);
      }
    },
    /**
* 
* @param {boolean} bit -if 1 then pass menu_state and 0 for event handler
* @param {boolean} menu_state - set true to open the side navigation else false (pass nothing as parameter while calling the function for use as event handler)
*/
    _buttonExpandLogic: function (bit = false, menu_state = null) {
      const button_style = ['Transparent', "Emphasized"];
      if (!this.oSideNav && !this.hamburger_button) {
          this.App =this.byId("App");
          this.oSideNav = this.App.byId('sideNavigation');
          this.hamburger_button = this.App.byId('hamburgerMenu');
      }
      // console.log(this.byId('hamburgerMenu'));
      // console.log(this.byId('sideNavigation'));
      if (bit) {
        if (menu_state) {
          this.hamburger_button.setType("Transparent");
          this.oSideNav.setExpanded(true);
        }
        else {
          this.hamburger_button.setType("Emphasized");
          this.oSideNav.setExpanded(false);
        }
      }
      else {
        var bExpanded = this.oSideNav.getExpanded();
        this.hamburger_button.setType(button_style[Number(bExpanded)]);
        this.oSideNav.setExpanded(!bExpanded);
      }
    },
  });
});