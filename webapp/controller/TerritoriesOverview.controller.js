sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/setModel"
  ], (BaseController,Formatter,setModel) => {
    "use strict";
    return BaseController.extend("bd.businessportal.controller.TerritoriesOverview", {
        formatter:Formatter,
        onInit:function() {
            
            this.main_page =this.byId("territory_overview");
            // this.main_page.setBusy(true);
            this.component = this.getOwnerComponent();
            this.root_element =this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            this.model = this.component.getModel("nav");

            this.oNavContainer.setBusy();
            setModel.configureModel.call(this,"Territories.json");
            this.getView().addEventDelegate({
                onAfterShow: function () {
                    this.oNavContainer.setBusy();
                }.bind(this),

                onBeforeShow: function () {
                        let bind_path = this.model.getProperty("/idOfBindElement");
                    const bind_elements_id =['t_dynamicPageTitle','t_product_general_info','territory_overview'];
                        for (const element of bind_elements_id) {
                        this.byId(element)?.bindElement(bind_path);
                       }
                    this.component._buttonExpandLogic(1, 0);
                }.bind(this),
            });
        },
        backNavigation:function (oEvent) {
            this.component.navbuttonPressed(oEvent);
        }
        

    });
  });