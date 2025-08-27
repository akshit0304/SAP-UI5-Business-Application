sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "bd/businessportal/utils/General",
    "bd/businessportal/utils/setModel",
    "bd/businessportal/model/Formatter",
    "sap/ui/Device",
    'sap/ui/core/BusyIndicator'
],(Controller,
    General,
    setModel,
    Formatter,
    Device,
    BusyIndicator
)=>{
    "use strict"
    return Controller.extend("bd.businessportal.controller.Officials", {
        formatter:Formatter,
        onInit() {
            // console.log("dashboard initialized");
            this.main_page =this.byId("manager_page");
            this.component =this.getOwnerComponent();
            const expandFlag =this.component.expandFlag;
            this.table =this.byId("table_manager");
            this.root_element =this.component.byId("App");
            this.oNavContainer = this.component.byId("App--navContainer");
            // set media ---
            Device.media.attachHandler((oEvent)=>{
                if(oEvent.name=='Phone' || oEvent.name=='Tablet'){
                  // console.log(table_ref.getWidth());
                }
              },this);
            // _set contetn density class
            this.getView().addStyleClass(this.component.getContentDensityClass());
            
            // event delegation
            this.getView().addEventDelegate({
                onBeforeShow:function(){
                    this.component._buttonExpandLogic(1, expandFlag);
                    setModel.configureModel.call(this,"Officials.json");
                }.bind(this),
                onAfterShow:function(){
                    this.oNavContainer.setBusy();
                    BusyIndicator.hide();
                }.bind(this)
            });
            // set event

            // fetch data from 0-data/v2
            
            // this.component._bshow(100); 
        },
        navbuttonPressed:function(oEvent){
            this.component.navbuttonPressed(oEvent);
        },
       overViewPage:function(oEvent){
            this.oNavContainer.setBusy(true);
            var oContext = oEvent.getSource().getBindingContext().getPath();
            // console.log(oContext);
            // const id =oContext.getProperty("EmployeeID");
            const model =this.component.getModel("nav");
            model.setProperty("/idOfBindElement",oContext);
            this.root_element.getController()._loadView("OfficialsOverview");
          },
    });
})