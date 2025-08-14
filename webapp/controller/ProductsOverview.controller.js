sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/utils/setModel",
    "bd/businessportal/model/Formatter"
], (BaseController, JSONModel,setModel,Formatter) => {
    "use strict";
    // function checkProductId(fileName,key,value) {
    //     this.main_page.setBusy(true);
    //     const that =this;
    //     return new Promise((resolve)=>{
    //             let V =setModel.fetchObject(fileName,
    //                         {"key":key,"value":value},
    //                         that);
    //             resolve(V);
    //     })
    //     // return new Promise((resolve) => {
    //     //     const model =this.component.getModel();
            
    //     //     this.component.getModel("MD").read("/Products", {
    //     //         urlParameters: {
    //     //             "$expand": "Category,Supplier"
    //     //         },
    //     //         filters: [
    //     //             new sap.ui.model.Filter("ProductID", "EQ", id),
    //     //         ],
    //     //         success: function (oData) {
    //     //             const dataProduct_jsonModel = new JSONModel();
    //     //             dataProduct_jsonModel.setData({ "results": oData["results"] });
    //     //             this.getView().setModel(dataProduct_jsonModel);
    //     //             resolve(0)

    //     //         }.bind(this),
    //     //         error: function (msg) {
    //     //             console.log("error in requests");
    //     //             console.log(msg);
    //     //             resolve(null)
    //     //         }.bind(this)
    //     //     });
    //     // })
    // }

    return BaseController.extend("bd.businessportal.controller.ProductsOverview", {
        formatter: Formatter,
        onInit: function () {
            // set event
            this.component = this.getOwnerComponent();
            this.main_page = this.byId("product_overview");
            this.root_element = this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            this.model = this.component.getModel("nav");

            this.oNavContainer.setBusy();
            setModel.configureModel.call(this,"Products.json");
            this.getView().addEventDelegate({
                onAfterShow: function () {
                    this.oNavContainer.setBusy();
                }.bind(this),

                onBeforeShow: function () {
                        let bind_path = this.model.getProperty("/idOfBindElement");
                        const bind_elements_id = ['dynamicPageTitle', 'product_general_info', 'form', 'info_supplier'];
                        for (const element of bind_elements_id) {
                        this.byId(element)?.bindElement(bind_path);
                       }
                    this.component._buttonExpandLogic(1, 0);
                }.bind(this),
            });
        },
    });
});