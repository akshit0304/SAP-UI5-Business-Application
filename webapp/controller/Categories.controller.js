sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/General",
    "sap/ui/model/json/JSONModel"
],(Controller,
    Formatter,
    General,
    JSONModel
)=>{
    "use strict"
    return Controller.extend("bd.businessportal.controller.Categories", {
        formatter:Formatter,
        onInit() {
            // console.log("dashboard initialized");
            this.main_page =this.byId("category_page");
            this.table =this.byId("table_category");
            this.component =this.getOwnerComponent();
            this.oNavContainer = this.component.byId("App--navContainer");
            this.root_element =this.component.byId("App");
            // this.root_element =sap.ui.getCore().byId("container-bd.businessportal---App");
            // this.component = sap.ui.core.Component.getOwnerComponentFor(this.root_element);
            // _set contetn density class
            this.getView().addStyleClass(this.component.getContentDensityClass());
             // fetch data from 0-data/v2
            this.model_data =this.component.getModel("MD");
            this.table.setBusy(true);            
            this.model_data.read("/Categories",
                {
                    urlParameters: {
                        "$skip": 0,
                        "$expand":"Products"
                    },
                    success:function (oData){
                            let results =oData["results"];
                            // results =General.countData("Products",results);
                            console.log(results);
                            let MSJson = new JSONModel();
                            MSJson.setData({"results":results});
                            this.getView().setModel(MSJson);
                            this.table.setBusy();
                    }.bind(this),
                    error:function(oError){
                        console.log(oError);
                        this.table.setBusy(false);
                    }.bind(this)
                });
        },
        navbuttonPressed:function(oEvent){
            this.component.navbuttonPressed(oEvent);
        },
        overViewPage:function(oEvent){
            this.oNavContainer.setBusy(true);
            var oContext = oEvent.getSource().getBindingContext();
            // console.log(oContext);
            const id =oContext.getProperty("OrderID");
            const model =this.component.getModel("nav");
            model.setProperty("/idOfBindElement",id);
            this.root_element.getController()._loadView("CategoriesOverview");
          },
    });
})