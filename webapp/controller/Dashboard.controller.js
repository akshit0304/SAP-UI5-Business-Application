sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "bd/businessportal/model/Formatter",
    "sap/ui/Device",
    'sap/ui/core/BusyIndicator'
], (Controller,
    JSONModel,
    Formatter,
    Device,
    BusyIndicator
) => {
    "use strict"

    function _setGridItemSize(id) {
        let oGrid = this.byId(id);
        let aItems = oGrid?.getItems();

        // find tallest height
        let maxHeight = 0;
        aItems.forEach(item => {
            let domRef = item.getDomRef();
            if (domRef) {
                maxHeight = Math.max(maxHeight, domRef.offsetHeight);
            }
        });

        // set all items to max height
        aItems.forEach(item => {
            let domRef = item.getDomRef();
            if (domRef) {
                domRef.style.height = maxHeight + "px";
            }
        });
    }

     function _numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    const oData = {
        customers: [
            { customerName: "Customer A", orderAmount: 1200 },
            { customerName: "Customer B", orderAmount: 950 },
            { customerName: "Customer C", orderAmount: 875 },
            { customerName: "Customer D", orderAmount: 600 },
            { customerName: "Customer E", orderAmount: 450 }
        ]
    };
    return Controller.extend("bd.businessportal.controller.Dashboard", {
        formatter: Formatter,
        onInit: function () {
            console.log('Dashboard page is loaded');
            // this.main_page =this.byId("");
            // console.log(this.component);
            this.component = this.getOwnerComponent();
            const expandFlag = this.component.expandFlag;
            this.oNavContainer = this.component.byId("App--navContainer");
            this.root_element = this.component.byId("App");
            this.main_page = this.byId("dashboard_container");

            // temp function ---
            const oModel = new sap.ui.model.json.JSONModel(oData);
            this.getView().setModel(oModel);
            // set media ---
            Device.media.attachHandler((oEvent) => {
                if (oEvent.name == 'Phone' || oEvent.name == 'Tablet') {
                    // console.log(table_ref.getWidth());
                }
            }, this);

            // event delegation
            this.getView().addEventDelegate({
                onBeforeShow: function () {
                    // before show
                    this.component._buttonExpandLogic(1, expandFlag);

                }.bind(this)
            });
        },
        onAfterRendering: function () {
            BusyIndicator.hide();
            setTimeout(timeoutFunction.bind(this) , 5000);
            function timeoutFunction() {
                console.log("function called");
                this.countSpecificParameterValue("kpi_stat_list", { "that": this, "setNumber_id": null }, 1);
            };
            // set grid-item size
            // _setGridItemSize.bind(this,"main_grid");

        },
        onExit() {
            console.log("dashboard exit");
        },
        countSpecificParameterValue: async function (list_id, params, index = 0) {
            try {
                 
                var { that, setNumber_id } = params;
                const list_control = that.byId(list_id);
                const list_items = list_control.getItems();
                if (index < list_items.length) {
                    var list_item = list_items[index];
                    list_item.setBusy(true);
                    // if card xml change then change this also.(fetching number for statistics)
                    let list_item_control =setNumber_id?setNumber_id:list_item.getContent()[0].getItems()[1].getItems()[0];

                    let data = await this.make_request(that, "/Order_Subtotals", "Subtotal");
                    data =_numberWithCommas(data);
                    list_item_control.setNumber(data);
                    // console.log(data);
                    list_item.setBusy();

                }
                else {
                    throw new Error("passed index has invalid index");
                }

            } catch (error) {
                that.byId(setNumber_id).setNumber("Error");
                list_item.setBusy();
            }
        },
        make_request: async function (that, path, propKey, params = {}) {
            let request_pointer;
            function oDataReadCall() {
                return new Promise((resolve, reject) => {
                    request_pointer = that.component.getModel("MD").read(path, {
                        urlParameters: params,
                        success: function (oData) {
                            resolve(oData);
                        },
                        error: function (err) {
                            console.log(err);
                            reject(0);
                        }
                    });
                });
            }
            // odata read function end
            // counter function start
            function count() {
                let temp_count = 0;
                for (const d of results) {
                    temp_count += parseInt(d[propKey]);
                }
                return temp_count;
            }
            // counter function ends
            // parse skip variable
            function parseSkipVariable(link, params) {
                const match = link.match(/[?&]\$skiptoken=([^&#]+)/i);
                if (match) {
                    params["$skiptoken"] = parseInt(match[1]);
                }
                return params;
            }
            // parse skip variable end
            var data, link;
            var counter = 0;
            let results;
            data = await oDataReadCall();
            if (!data) { return 0; }
            results = data['results'];
            link = data['__next'];
            if (results[0][propKey]) {
                counter = count();
            }
            else {
                return "propKey is not present in json response";
            }
            // while condition for repeat request
            let count_flag = 0;
            while (link && count_flag < 5 && !that.component.abord_request_flag) {
                params = parseSkipVariable(link, params);
                data = await oDataReadCall();
                if (!data) { return 0; }
                results = data['results'];
                link = data['__next'];
                counter += count();
                count_flag += 1;
            }
            that.component.abord_request_flag = 0;
            // console.log(counter);
            return counter;


        }
    });
})