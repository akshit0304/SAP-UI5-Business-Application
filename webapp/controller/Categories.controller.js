sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/model/Formatter",
    "bd/businessportal/utils/General",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/utils/setModel",
    
],(Controller,
    Formatter,
    General,
    JSONModel,
    setModel
)=>{
    "use strict"
    return Controller.extend("bd.businessportal.controller.Categories", {
        formatter:Formatter,
        onInit() {
            // console.log("dashboard initialized");
            this.main_page =this.byId("category_page");
            this.table =this.byId("table_category");
            this.component =this.getOwnerComponent();
             const expandFlag =this.component.expandFlag;
            this.oNavContainer = this.component.byId("App--navContainer");
            this.root_element =this.component.byId("App");
            // this.root_element =sap.ui.getCore().byId("container-bd.businessportal---App");
            // this.component = sap.ui.core.Component.getOwnerComponentFor(this.root_element);
            // _set contetn density class
            this.getView().addStyleClass(this.component.getContentDensityClass());
            this.getView().addEventDelegate({
                onBeforeShow:function(){
                    this.component._buttonExpandLogic(1, expandFlag);
                    setModel.configureModel.call(this,"Categories.json");
                    
                }.bind(this)
            })
             // fetch data from 0-data/v2
        },
        navbuttonPressed:function(oEvent){
            this.component.navbuttonPressed(oEvent);
        },
        overViewPage:function(oEvent){
            this.oNavContainer.setBusy(true);
            // console.log(oEvent.getParameter("listItem"));
            var oContext = oEvent.getParameter("listItem").getBindingContext().getPath();
            // console.log(oContext);
            if(!oContext) {
                this.oNavContainer.setBusy();   
                throw new Error("Error id is undefined");
            }
            // console.log(oContext);
            // const id =oContext.getProperty("OrderID");
            const model =this.component.getModel("nav");
            model.setProperty("/idOfBindElement",oContext);
            this.root_element.getController()._loadView("CategoriesOverview");
          },
    });
})