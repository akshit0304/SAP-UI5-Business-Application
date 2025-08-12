sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter"
], (BaseController, JSONModel, Formatter) => {
    "use strict";
    function checkProductId(id) {
        this.main_page.setBusy(true);
        return new Promise((resolve) => {
            this.component.getModel("MD").read("/Products", {
                urlParameters: {
                    "$expand": "Category,Supplier"
                },
                filters: [
                    new sap.ui.model.Filter("ProductID", "EQ", id),
                ],
                success: function (oData) {
                    const dataProduct_jsonModel = new JSONModel();
                    dataProduct_jsonModel.setData({ "results": oData["results"] });
                    this.getView().setModel(dataProduct_jsonModel);
                    resolve(0)

                }.bind(this),
                error: function (msg) {
                    console.log("error in requests");
                    console.log(msg);
                    resolve(null)
                }.bind(this)
            });
        })
    }

    return BaseController.extend("bd.businessportal.controller.ProductsOverview", {
        formatter: Formatter,
        onInit: function () {
            // set event
            this.component = this.getOwnerComponent();
            this.main_page = this.byId("product_overview");
            this.root_element = this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            this.req_flag = 0;

            this.oNavContainer.setBusy();
            const model = this.component.getModel("nav");
            let id = model.getProperty("/idOfBindElement");
            checkProductId.call(this, id)
                .then((valid_index) => {
                    if (valid_index == null) return null
                    const bind_path = "/results/" + valid_index;
                    const bind_elements_id = ['dynamicPageTitle', 'product_general_info', 'form', 'info_supplier'];
                    for (const element of bind_elements_id) {
                        this.byId(element)?.bindElement(bind_path);
                    }
                    this.main_page.setBusy(false);
                })
            // const router =this.component.getRouter();
            // const route =router.getRoute("p_overview");
            // route.attachPatternMatched(this._onRouteMatched,this);
            this.getView().addEventDelegate({
                onAfterShow: function () {
                    this.oNavContainer.setBusy();
                }.bind(this),

                onBeforeShow: function () {
                    if (this.req_flag) {
                        // request logic
                        let model = this.component.getModel("nav");
                        let id = model.getProperty("/idOfBindElement");
                        checkProductId.call(this, id)
                            .then((valid_index) => {
                                if (valid_index == null) return null;
                                // const bind_path = "/results/" + valid_index;
                                // const bind_elements_id = ['dynamicPageTitle', 'product_general_info', 'form', 'info_supplier'];
                                // for (const element of bind_elements_id) {
                                //     this.byId(element)?.bindElement(bind_path);
                                // }
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