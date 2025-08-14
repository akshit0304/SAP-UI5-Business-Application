sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/setModel",

  ], (BaseController,JSONModel,Formatter,setModel) => {

    "use strict";
    // function checkProductId(id,index){
    //     // this.byId("dynamicPageTitle").setBusy(true);
    //     this.main_page.setBusy(true);
    //     return new Promise((resolve)=>{
    //         this.component.getModel("MD").read("/Orders",{
    //             urlParameters:{
    //                 "$expand":"Customer,Order_Details,Employee,Shipper",
    //                 "$top":10,
    //                 "$skip":0
    //             },
    //             filters: [
    //                 new sap.ui.model.Filter("OrderID", "EQ", id),
    //             ],
    //             success:function(oData){
    //                 const dataProduct_jsonModel =new JSONModel();
    //                 dataProduct_jsonModel.setData({"results":oData["results"]});
    //                 // console.log(dataProduct_jsonModel.getJson());
    //                 this.getView().setModel(dataProduct_jsonModel);
    //                 resolve(0);
    //             }.bind(this),
    //             error:function (msg) {
    //                 console.log("error in requests");
    //                 console.log(msg);
    //                 resolve(null);
    //             }
    //         });
    // })
    // }
  
    return BaseController.extend("bd.businessportal.controller.OrdersOverview", {
        formatter:Formatter,
        onInit:function() {
            
            this.main_page =this.byId("order_overview");
            // this.main_page.setBusy(true);
            // console.log("overview page initialized");
            this.component = this.getOwnerComponent();
            this.root_element =this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            this.model = this.component.getModel("nav");
            this.oNavContainer.setBusy();
            setModel.configureModel.call(this,"Orders.json"); 
            
                        this.getView().addEventDelegate({
                onAfterShow: function () {
                    this.oNavContainer.setBusy();
                }.bind(this),

                onBeforeShow: function () {
                        let bind_path = this.model.getProperty("/idOfBindElement");
                    const bind_elements_id =['o_dynamicPageTitle','o_product_general_info','o_form'];       
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