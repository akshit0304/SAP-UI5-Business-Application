sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/setModel"
  ], (BaseController,JSONModel,Formatter,setModel) => {
    "use strict";
    
  
    return BaseController.extend("bd.businessportal.controller.ShippersOverview", {
        formatter:Formatter,
        onInit:function() {
            this.main_page =this.byId("shipper_overview");
            // this.main_page.setBusy(true);
            this.component = this.getOwnerComponent();
            this.root_element =this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            this.model = this.component.getModel("nav");
            this.oNavContainer.setBusy();
            setModel.configureModel.call(this,"Shippers.json");
            this.getView().addEventDelegate({
                onAfterShow: function () {
                    this.oNavContainer.setBusy();
                }.bind(this),

                onBeforeShow: function () {
                        let bind_path = this.model.getProperty("/idOfBindElement");
                    const bind_elements_id =['sh_dynamicPageTitle','sh_product_general_info','shipper_overview'];                    for (const element of bind_elements_id) {
                        for (const element of bind_elements_id) {
                        this.byId(element)?.bindElement(bind_path);
                       }
                    this.component._buttonExpandLogic(1, 0);
                    }
                }.bind(this),
            });
            
            
        },
        backNavigation:function (oEvent) {
            this.component.navbuttonPressed(oEvent);
        }
    });
  });