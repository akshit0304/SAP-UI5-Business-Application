sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter"
  ], (BaseController,JSONModel,Formatter) => {
    "use strict";
    function checkProductId(id) {
        this.main_page.setBusy(true);
        return new Promise((resolve) => {
            this.component.getModel("MD").read("/Employees",{
                urlParameters:{
                },
                filters: [
                    new sap.ui.model.Filter("EmployeeID", "EQ", id),
                ],
                success:function(oData){
                    // console.log(oData);
                    const dataProduct_jsonModel =new JSONModel();
                    dataProduct_jsonModel.setData({"results":oData["results"]});
                    // console.log(dataProduct_jsonModel.getJson());
                    this.getView().setModel(dataProduct_jsonModel);
                    resolve(0)
                }.bind(this),
                error:function (msg) {
                    console.log("error in requests");
                    console.log(msg);
                    resolve(null)
                }
            });
        })
    }
    return BaseController.extend("bd.businessportal.controller.EmployeesOverview", {
        formatter:Formatter,

        onInit:function() {
            
            this.main_page =this.byId("employee_overview");
            this.component =this.getOwnerComponent();
            this.model = this.component.getModel("nav");
            this.root_element =this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            this.req_flag = 0;
            this.oNavContainer.setBusy();
            let id = this.model.getProperty("/idOfBindElement");
            
            checkProductId.call(this, id)
                .then((valid_index) => {
                    if (valid_index == null) return null
                    const bind_path = "/results/" + valid_index;
                    const bind_elements_id =['e_dynamicPageTitle','e_form','info_employee','e_product_general_info'];
                    for (const element of bind_elements_id) {
                        this.byId(element)?.bindElement(bind_path);
                    }
                    this.main_page.setBusy(false);
                })
            this.getView().addEventDelegate({
                onAfterShow: function () {
                    this.oNavContainer.setBusy();
                }.bind(this),
                // i am calling onbefore callback function from formatter file.
                onBeforeShow: function () {
                    if (this.req_flag) {
                        // request logic
                        
                        this.model.getProperty("/idOfBindElement");
                        checkProductId.call(this, id)
                            .then((valid_index) => {
                                if (valid_index == null) return null;
                                this.main_page.setBusy(false);
                            })
                    }
                    this.component._buttonExpandLogic(1, 0);
                    this.req_flag = 1;
                }.bind(this),
            });
        },
        

    });
  });