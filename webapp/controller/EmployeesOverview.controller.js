sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/setModel"
  ], (BaseController,JSONModel,Formatter,setModel) => {
    "use strict";
    return BaseController.extend("bd.businessportal.controller.EmployeesOverview", {
        formatter:Formatter,

        onInit:function() {
            
            this.main_page =this.byId("employee_overview");
            this.component =this.getOwnerComponent();
            this.model = this.component.getModel("nav");
            this.root_element =this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
           this.model = this.component.getModel("nav");

            this.oNavContainer.setBusy();
            setModel.configureModel.call(this,"Employees.json");
            this.getView().addEventDelegate({
                onAfterShow: function () {
                    this.oNavContainer.setBusy();
                }.bind(this),

                onBeforeShow: function () {
                        let bind_path = this.model.getProperty("/idOfBindElement");
                    const bind_elements_id =['e_dynamicPageTitle','e_form','info_employee','e_product_general_info'];
                        for (const element of bind_elements_id) {
                        this.byId(element)?.bindElement(bind_path);
                       }
                    this.component._buttonExpandLogic(1, 0);
                }.bind(this),
            });
        },
        

    });
  });