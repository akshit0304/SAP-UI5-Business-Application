sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/mvc/XMLView",
  "bd/businessportal/model/Formatter",

], (BaseController,
  XMLView,
  Formatter

) => {
  "use strict";

  return BaseController.extend("bd.businessportal.controller.App", {
    formatter: Formatter,
    onInit() {
      console.log("app controller is initialized");
      // initial setup
      this.main_page = this.byId("shell_page");
      this.oNavContainer = this.byId("navContainer");
      this.component = this.getOwnerComponent();
      this.router = this.component.getRouter();

      this.getView().addEventDelegate({
        onAfterShow: function () {
          this._setFocus("dashboard");
          this._setNavigationList('list');
        }.bind(this)
      });
    },
    _loadView: function (sViewName) {
      if (!sViewName || typeof sViewName != 'string') return "error";
      let oExistingPage = this.oNavContainer.getPages()
        .find(p => p.getViewName && p.getViewName().endsWith(sViewName));

      if (oExistingPage) {
        this.oNavContainer.setBusy();
        this.oNavContainer.to(oExistingPage);
        return;
      }
      this.component.runAsOwner(
        function () {
          XMLView.create({
            viewName: "bd.businessportal.view." + sViewName,
            id: "container-bd.businessportal---App--navContainer--" + sViewName.toLowerCase()
          }).then(oView => {
            // sap.ui.core.Component.(oView, oComponent);
            // console.log(sap.ui.core.Component.getOwnerComponentFor(oView));
            // sap.ui.core.Component.setOwnerComponentFor(oView,this.component);
            this.oNavContainer.addPage(oView);
            this.oNavContainer.to(oView);
            this.oNavContainer.setBusy();
          });
        }.bind(this)
      )

    },
    _setNavigationList: function (id) {
      const control = this.byId(id);
      // console.log(control.getItems());
      const first_list_item = control.getItems()[0];
      control.setSelectedItem(first_list_item);
      // console.log(this.getLocalId(control.getSelectedKey(control)));
    },
    _setFocus: function (id) {
      if (!id) return 0
      const control = this.byId(id);
      if (control) {
        console.log('control control fullfilled');
        control.focus();
      }
      return 1;
    },

    onItemSelect: function (oEvent) {
      this.oNavContainer.setBusy(true);
      const oItem = oEvent.getParameter("item");
      const oItemKey = oItem.getKey();
      this._loadView(oItemKey);
    },
    hamburgerMenu: function (oEvent) {
      // console.log("menu button pressed");
      this.component._buttonExpandLogic();
    },
    backButton:function(oEvent){
        // console.log("back button pressed");
        this.oNavContainer.back();
    }
  });
});