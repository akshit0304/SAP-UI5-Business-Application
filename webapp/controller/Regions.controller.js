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
    return Controller.extend("bd.businessportal.controller.Regions", {
        formatter:Formatter,
        onInit() {
            this.main_page =this.byId("region_page");
            this.table =this.byId("table_region");
            this.component =this.getOwnerComponent();
            this.root_element =this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            // set media ---
            Device.media.attachHandler((oEvent)=>{
                if(oEvent.name=='Phone' || oEvent.name=='Tablet'){
                }
              },this);
            // _set contetn density class
            this.getView().addStyleClass(this.component.getContentDensityClass());
            
            // event delegation
            this.getView().addEventDelegate({
                onBeforeShow:function(){
                }.bind(this)
            });

            // fetch data from 0-data/v2
            this.model_data =this.component.getModel("MD");
            this.table.setBusy(true);
            this.model_data.read("/Regions",{
                urlParameters:{
                    "$expand":"Territories"
                },
                success:function(oData){
                    const results =oData["results"];
                    for (const ele of results) {
                        ele["Territories"] = Object.getPrototypeOf(ele["Territories"]["results"]) ==Array.prototype? ele["Territories"]["results"].length:"fisshy activity"
                    }
                    this.Json = new JSONModel();
                    this.Json.setData({"results":results});
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
        },
        navbuttonPressed:function(oEvent){
            this.component.navbuttonPressed(oEvent);
        },
        overViewPage:function(oEvent){
            this.oNavContainer.setBusy(true);
            var oContext = oEvent.getSource().getBindingContext();
            // console.log(oContext);
            const id =oContext.getProperty("RegionID");
            const model =this.component.getModel("nav");
            model.setProperty("/idOfBindElement",id);
            this.root_element.getController()._loadView("RegionsOverview");
          },
    });
})