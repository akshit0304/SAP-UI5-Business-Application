sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/mvc/XMLView",
  "bd/businessportal/model/Formatter",
  'sap/ui/core/Fragment',
  'bd/businessportal/controller/DialogBox',
  'sap/m/BusyIndicator'

], (BaseController,
  XMLView,
  Formatter,
  Fragment,
  DialogBox,
  BusyIndicator

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
      this.HISTORY =[];
      this.CURRENT_ITEM ="Dashboard"

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
    _setNavigationList: function (id,flag=0,keyName=null) {
      const control = this.byId(id);
      // console.log(control.getItems());
      const list_items = control.getItems();
      let select_item =list_items[0];
      if(flag){
        if(!keyName) select_item =list_items[0];
        else{
          select_item =list_items.find(function (item) {
                return item.getKey() === keyName;
          });
        }
      }
      control.setSelectedItem(select_item);
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
    _getNavModelData:function(path){
      if (typeof path==="string" && path.indexOf('/')==0){
        const model =this.component.getModel("nav");
        return model.getProperty(path);
      }
      return null;
    },
    _setNavModelData:function(path,data){
      if (typeof path==="string" && path.indexOf('/')==0){
        const model =this.component.getModel("nav");
        return model.setProperty(path,data);
      }
      return null;
    },
    onItemSelect: function (oEvent) {
      const oItem = oEvent.getParameter("item");
      // const lastKey =this._getNavModelData("/current_item");
      const lastKey =this.CURRENT_ITEM;
      const oItemKey = oItem.getKey();
      if (lastKey!==oItemKey){
          this.oNavContainer.setBusy(true);
          // this._setNavModelData("/current_item",oItemKey);
          this.CURRENT_ITEM =oItemKey;
          this.HISTORY.push(lastKey);
          this._loadView(oItemKey);
      }
     
    },
    hamburgerMenu: function (oEvent) {
      // console.log("menu button pressed");
      this.component._buttonExpandLogic();
    },
    backButton: function (oEvent) {
      // console.log("back button pressed");
      let back_item =this.HISTORY.pop();
      // this._setNavModelData("/current_item",back_item);
      this.CURRENT_ITEM =back_item;
      back_item? this._setNavigationList("list",1,back_item):this._setNavigationList("list",1,"Dashboard");
      this.oNavContainer.back();
      
      
    },
    dialogPress: function (oEvent) {
      // create popover
      if (!this.dialog) {
        this.dialog = Fragment.load({
          name: "bd.businessportal.view.DialogBox",
          controller: new DialogBox(this)
        }).then((Odialog) => {
          // add content using javascript
          let getItemKey =oEvent.getSource().getKey();
          if (getItemKey=="Legal"){
            // add content in dialog
            Odialog.addContent(
              new sap.m.VBox({
                items:[
                  new sap.m.TextArea({
                    value:"Company legal notes generally cover the formation, regulation, and dissolution of companies, with a focus on corporate governance, shareholder rights, and legal compliance. Key aspects include the Memorandum of Association (MOA) and Articles of Association (AOA), corporate personality, director duties, and financial structure. The Companies Act, 2013, is the primary legislation governing companies in India.",
                    editable:false,
                    growing:true,
                    width:"97%",
                    height:"250px"

                  })
                ]
              }).addStyleClass("sapUiResponsiveMargin")
            )
            sap.ui.getCore().byId("dialog_title").setText(getItemKey);
          }
          this.getView().addDependent(Odialog);
          return Odialog;
        });
      }
      this.dialog.then((point) => {
        this.point=point;
        point.open();
      })
    },
    
  });
});