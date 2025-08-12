sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter",
    "sap/ui/Device",
],(Controller,
    JSONModel,
    Formatter,
    Device
)=>{
    "use strict"
    return Controller.extend("bd.businessportal.controller.Territories", {
        formatter:Formatter,
        onInit() {
            console.log("dashboard initialized");
            this.main_page =this.byId("territory_page");
            this.table =this.byId("table_territory");
            this.component =this.getOwnerComponent();
            this.root_element =this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            // set media ---
            Device.media.attachHandler((oEvent)=>{
                if(oEvent.name=='Phone' || oEvent.name=='Tablet'){
                  // console.log(table_ref.getWidth());
                //   this.table.setWidth("100%");
                }
              },this);
            // _set contetn density class
            this.getView().addStyleClass(this.component.getContentDensityClass());
            // event bus
            
            // event delegation
            this.getView().addEventDelegate({
                onBeforeShow:function(){
                }.bind(this)
            });

            // fetch data from 0-data/v2
            this.model_data =this.component.getModel("MD");
            this.table.setBusy(true);
            this.model_data.read("/Territories",{
                urlParameters:{
                    "$expand":"Region,Employees"
                },
                success:function(oData){
                    const results =oData["results"];
                    // console.log(results);
                    this.Json = new JSONModel();
                    this.Json.setData({"results":results});
                    // console.log(this.Json.getJSON());
                    this.getView().setModel(this.Json);
                    this.table.setBusy();
                }.bind(this),
                error:function(oError){
                    console.log(oError);
                    this.table.setBusy();
                }.bind(this)
            })       
        },
        onExit(){
            console.log("dashboard exit");
        },
        navbuttonPressed:function(oEvent){
            this.component.navbuttonPressed(oEvent);
        },
        overViewPage:function(oEvent){
            this.oNavContainer.setBusy(true);
            var oContext = oEvent.getSource().getBindingContext();
            // console.log(oContext);
            const id =oContext.getProperty("TerritoryID");
            const model =this.component.getModel("nav");
            model.setProperty("/idOfBindElement",id);
            this.root_element.getController()._loadView("TerritoriesOverview");
          },

    });
})