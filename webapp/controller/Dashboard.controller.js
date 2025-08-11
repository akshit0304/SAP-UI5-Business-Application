sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter",
    "sap/ui/Device"
],(Controller,
    JSONModel,
    Formatter,
    Device
)=>{
    "use strict"
    return Controller.extend("bd.businessportal.controller.Dashboard", {
        formatter:Formatter,
        onInit() {
           
            // this.main_page =this.byId("");
            this.component =this.getOwnerComponent();
            // set media ---
            Device.media.attachHandler((oEvent)=>{
                if(oEvent.name=='Phone' || oEvent.name=='Tablet'){
                  // console.log(table_ref.getWidth());
                }
              },this);

            // event delegation
            this.getView().addEventDelegate({
                onBeforeShow:function(){
                    // before show
                }.bind(this)
            });
        },
        onExit(){
            console.log("dashboard exit");
        },
        navbuttonPressed:function(oEvent){
            this.component.navbuttonPressed(oEvent);
        },

    });
})